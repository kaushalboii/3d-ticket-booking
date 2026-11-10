import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Seat } from '../types';
import { interpolateCameraCoordinates } from './SeatPreviewView';

interface Auditorium3DViewProps {
  seats: Seat[];
  selectedSeat: Seat;
  viewPhase?: 'transition' | 'eye_level';
  replayTrigger?: number;
  onTransitionComplete?: () => void;
}

export const Auditorium3DView: React.FC<Auditorium3DViewProps> = ({
  seats,
  selectedSeat,
  replayTrigger = 0,
  onTransitionComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Look-around angles (yaw: horizontal, pitch: vertical, zoom)
  const lookAroundRef = useRef({ yaw: 0, pitch: 0, zoom: 0 });
  const [, setHasInteracted] = useState(false);

  // Flight animation state
  const flightStartRef = useRef<number>(performance.now());
  const isFlyingRef = useRef<boolean>(true);
  const flightCompletedRef = useRef<boolean>(false);
  const FLIGHT_DURATION = 1350; // ms for the cinematic swoop

  const selectedSeatRef = useRef(selectedSeat);
  selectedSeatRef.current = selectedSeat;

  const onTransitionCompleteRef = useRef(onTransitionComplete);
  onTransitionCompleteRef.current = onTransitionComplete;

  // Reset / Replay camera flight whenever seat or replayTrigger changes
  useEffect(() => {
    flightStartRef.current = performance.now();
    isFlyingRef.current = true;
    flightCompletedRef.current = false;
    lookAroundRef.current = { yaw: 0, pitch: 0, zoom: 0 };
    setHasInteracted(false);
  }, [selectedSeat.id, replayTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL Guard
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Three.js Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    const getWidth = () => container.clientWidth || window.innerWidth;
    const getHeight = () => container.clientHeight || window.innerHeight;

    renderer.setSize(getWidth(), getHeight());
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Scene & Dark Cinema Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#060608');
    scene.fog = new THREE.FogExp2('#060608', 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      56,
      (container.clientWidth || 1) / (container.clientHeight || 1),
      0.05,
      150
    );
    camera.position.set(0, 6.0, 15.5);
    camera.lookAt(0, 3.5, 0);

    // Studio Environment Reflections via RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;
      pmremGenerator.dispose();
    } catch (_) {}

    // Cinema Lighting: Soft architectural ambient + warm screen projector glow
    const ambientLight = new THREE.AmbientLight('#181418', 0.95);
    scene.add(ambientLight);

    const screenProjectorLight = new THREE.PointLight('#fce0b0', 2.2, 38);
    screenProjectorLight.position.set(0, 4.8, 1.5);
    scene.add(screenProjectorLight);

    const ceilingFill = new THREE.DirectionalLight('#383542', 0.7);
    ceilingFill.position.set(0, 18, 8);
    scene.add(ceilingFill);

    // Aisle side lights (subtle amber markers)
    const aisleLeft = new THREE.PointLight('#e5a93c', 0.6, 16);
    aisleLeft.position.set(-4.5, 0.4, 8.5);
    scene.add(aisleLeft);

    const aisleRight = new THREE.PointLight('#e5a93c', 0.6, 16);
    aisleRight.position.set(4.5, 0.4, 8.5);
    scene.add(aisleRight);

    // --- High-Resolution Cinema Screen Canvas Generator ---
    const createCinematicScreenTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 2048;
      cvs.height = 1024;
      const ctx = cvs.getContext('2d')!;

      // Deep anamorphic sci-fi cinema gradient
      const grad = ctx.createRadialGradient(1024, 512, 120, 1024, 512, 1000);
      grad.addColorStop(0, '#f9ecd0');
      grad.addColorStop(0.3, '#d88636');
      grad.addColorStop(0.65, '#3b180d');
      grad.addColorStop(1, '#0c0706');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Anamorphic horizontal lens flare line
      const flare = ctx.createLinearGradient(0, 512, 2048, 512);
      flare.addColorStop(0, 'rgba(255,255,255,0)');
      flare.addColorStop(0.4, 'rgba(245,210,160,0.25)');
      flare.addColorStop(0.5, 'rgba(255,255,255,0.85)');
      flare.addColorStop(0.6, 'rgba(245,210,160,0.25)');
      flare.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = flare;
      ctx.fillRect(0, 506, 2048, 12);

      // Cinema Brand Typography
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 64px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '8px';
      ctx.fillText('C I N E S C A P E', 1024, 460);

      ctx.fillStyle = '#fce7c8';
      ctx.font = '600 28px "Inter", monospace';
      ctx.letterSpacing = '4px';
      ctx.fillText('AUDI 3 · 70MM IMAX LASER · DOLBY ATMOS', 1024, 580);

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '500 20px "Inter", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('FIRST-PERSON EYE-LEVEL SIGHTLINE SIMULATION', 1024, 625);

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const movieTexture = createCinematicScreenTexture();

    // Curved IMAX Screen Geometry
    const screenWidth = 13.5;
    const screenHeight = 6.0;
    const screenGeom = new THREE.PlaneGeometry(screenWidth, screenHeight, 36, 18);

    const posAttr = screenGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const curveZ = (x * x) * 0.026;
      posAttr.setZ(i, curveZ);
    }
    screenGeom.computeVertexNormals();

    const screenMat = new THREE.MeshStandardMaterial({
      map: movieTexture,
      roughness: 0.18,
      metalness: 0.04,
      emissive: '#ffffff',
      emissiveMap: movieTexture,
      emissiveIntensity: 1.05,
    });
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.set(0, 4.4, 0);
    scene.add(screenMesh);

    // Screen frame border
    const frameGeom = new THREE.BoxGeometry(screenWidth + 0.45, screenHeight + 0.45, 0.25);
    const frameMat = new THREE.MeshBasicMaterial({ color: '#010102' });
    const frameMesh = new THREE.Mesh(frameGeom, frameMat);
    frameMesh.position.set(0, 4.4, -0.16);
    scene.add(frameMesh);

    // Also attempt loading custom image texture if available
    try {
      const loader = new THREE.TextureLoader();
      loader.load(
        './dune_movie_screen.jpg',
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          screenMat.map = tex;
          screenMat.emissiveMap = tex;
          screenMat.needsUpdate = true;
        },
        undefined,
        () => {
          // Fallback to high-res canvas already applied
        }
      );
    } catch (_) {}

    // --- Build Luxury Cinema Chairs ---
    // Deep cinema obsidian-charcoal velvet
    const standardVelvetMat = new THREE.MeshStandardMaterial({
      color: '#18191f',
      roughness: 0.72,
      metalness: 0.08,
    });

    const createGoldNumberTexture = (seatNum: number) => {
      const cvs = document.createElement('canvas');
      cvs.width = 128;
      cvs.height = 128;
      const c = cvs.getContext('2d')!;
      c.fillStyle = '#E5A93C';
      c.fillRect(0, 0, 128, 128);
      c.fillStyle = '#060608';
      c.font = 'bold 56px "Inter", sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(String(seatNum), 64, 64);
      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const darkArmrestMat = new THREE.MeshStandardMaterial({
      color: '#0e0e12',
      roughness: 0.6,
      metalness: 0.2,
    });

    const darkStemMat = new THREE.MeshStandardMaterial({
      color: '#08080a',
      roughness: 0.4,
      metalness: 0.8,
    });

    const cushionGeom = new THREE.BoxGeometry(0.54, 0.12, 0.5);
    const backGeom = new THREE.BoxGeometry(0.54, 0.64, 0.12);
    const headrestGeom = new THREE.BoxGeometry(0.46, 0.2, 0.14);
    const armrestGeom = new THREE.BoxGeometry(0.08, 0.2, 0.44);
    const stemGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 8);

    const seatMeshMap = new Map<string, { group: THREE.Group; cushion: THREE.Mesh; back: THREE.Mesh; headrest: THREE.Mesh }>();

    seats.forEach((seat) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(seat.x, seat.y, seat.z);

      const stem = new THREE.Mesh(stemGeom, darkStemMat);
      stem.position.set(0, 0.15, 0);
      chairGroup.add(stem);

      const cushion = new THREE.Mesh(cushionGeom, standardVelvetMat.clone());
      cushion.position.set(0, 0.35, 0);
      chairGroup.add(cushion);

      const back = new THREE.Mesh(backGeom, standardVelvetMat.clone());
      back.position.set(0, 0.68, 0.22);
      back.rotation.x = -0.12;
      chairGroup.add(back);

      const headrest = new THREE.Mesh(headrestGeom, standardVelvetMat.clone());
      headrest.position.set(0, 1.05, 0.28);
      headrest.rotation.x = -0.12;
      chairGroup.add(headrest);

      [-0.31, 0.31].forEach((armX) => {
        const arm = new THREE.Mesh(armrestGeom, darkArmrestMat);
        arm.position.set(armX, 0.45, 0.05);
        chairGroup.add(arm);
      });

      scene.add(chairGroup);
      seatMeshMap.set(seat.id, { group: chairGroup, cushion, back, headrest });
    });

    // Tiered stadium riser steps (placed correctly under the chair stems)
    for (let r = 0; r < 10; r++) {
      const riserZ = 5.2 + r * 1.15;
      const stepHeight = r * 0.32 + 0.1;
      const riserY = stepHeight / 2 - 0.05; // Base at Y=0, top surface at seat.y
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(16, stepHeight, 1.18),
        new THREE.MeshStandardMaterial({ color: '#090a0d', roughness: 0.95 })
      );
      stepMesh.position.set(0, riserY, riserZ);
      scene.add(stepMesh);
    }

    // Stage platform in front of the curved IMAX screen
    const stagePlatform = new THREE.Mesh(
      new THREE.BoxGeometry(15.5, 0.45, 3.2),
      new THREE.MeshStandardMaterial({ color: '#050507', roughness: 0.95 })
    );
    stagePlatform.position.set(0, 0.2, 1.6);
    scene.add(stagePlatform);

    // Auditorium side walls & acoustic sound baffles with soft ambient warm wash
    const wallMat = new THREE.MeshStandardMaterial({ color: '#090a0d', roughness: 0.92 });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 14, 32), wallMat);
    leftWall.position.set(-8.2, 5, 8);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 14, 32), wallMat);
    rightWall.position.set(8.2, 5, 8);
    scene.add(rightWall);

    // Vertical acoustic panel fins along walls for depth
    const finGeom = new THREE.BoxGeometry(0.4, 8, 0.15);
    const finMat = new THREE.MeshStandardMaterial({ color: '#13141a', roughness: 0.85 });
    for (let f = 0; f < 8; f++) {
      const finZ = 3 + f * 2.2;
      const leftFin = new THREE.Mesh(finGeom, finMat);
      leftFin.position.set(-8.0, 4.5, finZ);
      scene.add(leftFin);

      const rightFin = new THREE.Mesh(finGeom, finMat);
      rightFin.position.set(8.0, 4.5, finZ);
      scene.add(rightFin);
    }

    // Function to update chair materials based on selected seat (Warm Champagne Gold)
    let lastAppliedSeatId: string | null = null;
    let cachedGoldMat: THREE.MeshStandardMaterial | null = null;

    const updateChairColors = () => {
      const currentSelected = selectedSeatRef.current;
      if (lastAppliedSeatId === currentSelected.id) return;
      lastAppliedSeatId = currentSelected.id;

      if (cachedGoldMat) {
        cachedGoldMat.map?.dispose();
        cachedGoldMat.dispose();
      }

      const numTexture = createGoldNumberTexture(currentSelected.number);
      cachedGoldMat = new THREE.MeshStandardMaterial({
        map: numTexture,
        roughness: 0.28,
        metalness: 0.15,
        emissive: '#E5A93C',
        emissiveIntensity: 0.65,
      });

      seats.forEach((seat) => {
        const item = seatMeshMap.get(seat.id);
        if (!item) return;

        const isSelected = seat.id === currentSelected.id;
        const mat = isSelected ? cachedGoldMat! : standardVelvetMat;

        item.cushion.material = mat;
        item.back.material = isSelected
          ? new THREE.MeshStandardMaterial({
              color: '#E5A93C',
              roughness: 0.35,
              emissive: '#E5A93C',
              emissiveIntensity: 0.5,
            })
          : standardVelvetMat;
        item.headrest.material = isSelected
          ? new THREE.MeshStandardMaterial({
              color: '#E5A93C',
              roughness: 0.35,
            })
          : standardVelvetMat;
        // Occupied seat headrest is hidden from first-person view to avoid camera clipping behind eyes
        item.headrest.visible = !isSelected;
      });
    };

    updateChairColors();

    // --- Interactive Mouse & Touch Drag Look-Around Controls ---
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (isFlyingRef.current) return;
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || isFlyingRef.current) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      lookAroundRef.current.yaw += deltaX * 0.0035;
      lookAroundRef.current.pitch = Math.max(
        -0.45,
        Math.min(0.45, lookAroundRef.current.pitch - deltaY * 0.003)
      );

      setHasInteracted(true);
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    const onWheel = (e: WheelEvent) => {
      if (isFlyingRef.current) return;
      e.preventDefault();
      lookAroundRef.current.zoom = Math.max(
        -8,
        Math.min(12, lookAroundRef.current.zoom - e.deltaY * 0.01)
      );
      setHasInteracted(true);
    };

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';
    dom.style.cursor = 'grab';
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop with Cinematic 3D Camera Swoop & Seated Eye-Level Sightline
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const selSeat = selectedSeatRef.current;
      const { yaw, pitch, zoom } = lookAroundRef.current;
      const baseFov = (container.clientWidth || 1) / (container.clientHeight || 1) < 1.0 ? 56 : 52;

      if (isFlyingRef.current) {
        // --- 3D CAMERA FLIGHT INTERPOLATION (Auditorium Vantage [0, 6, 15.5] -> Seated Eye-Level) ---
        const elapsed = performance.now() - flightStartRef.current;
        const rawT = Math.min(1.0, elapsed / FLIGHT_DURATION);

        const { position, lookAt, fov } = interpolateCameraCoordinates(selSeat, rawT);

        camera.position.set(position[0], position[1], position[2]);
        camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
        camera.fov = fov;
        camera.updateProjectionMatrix();

        if (rawT >= 1.0) {
          isFlyingRef.current = false;
          if (!flightCompletedRef.current) {
            flightCompletedRef.current = true;
            onTransitionCompleteRef.current?.();
          }
        }
      } else {
        // --- SEATED EYE-LEVEL SIGHTLINE (Sitting right on the seat cushion facing center screen) ---
        const eyeX = selSeat.x;
        const eyeY = selSeat.y + 0.92; // Above cushion at seated eye-level
        const eyeZ = selSeat.z - 0.04;
        camera.position.set(eyeX, eyeY, eyeZ);

        // Spherical look-around from eye level facing center of curved IMAX screen [0, 3.8, 0]
        const baseDist = Math.hypot(0 - eyeX, 0 - eyeZ);
        const baseYaw = Math.atan2(0 - eyeX, eyeZ);
        const basePitch = Math.atan2(3.8 - eyeY, baseDist);

        const currentYaw = baseYaw + yaw;
        const currentPitch = basePitch + pitch;

        const dirX = Math.sin(currentYaw) * Math.cos(currentPitch);
        const dirY = Math.sin(currentPitch);
        const dirZ = -Math.cos(currentYaw) * Math.cos(currentPitch);

        camera.lookAt(eyeX + dirX * 20, eyeY + dirY * 20, eyeZ + dirZ * 20);
        camera.fov = Math.max(36, Math.min(68, baseFov - zoom));
        camera.updateProjectionMatrix();
      }

      updateChairColors();
      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // Responsive Resize observer for pixel-perfect viewport alignment
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
      screenGeom.dispose();
      screenMat.dispose();
      movieTexture.dispose();
      if (cachedGoldMat) cachedGoldMat.dispose();
    };
  }, [seats]);

  return <div ref={mountRef} className="w-full h-full relative" />;
};
export default Auditorium3DView;
