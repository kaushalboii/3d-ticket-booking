import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Seat } from '../types';
import { interpolateCameraCoordinates } from './SeatPreviewView';

interface Auditorium3DViewProps {
  seats: Seat[];
  selectedSeat: Seat;
  movieTitle?: string;
  movieBackdrop?: string;
  screenName?: string;
  replayTrigger?: number;
  onTransitionComplete?: () => void;
  onUserInteract?: () => void;
}

const SEAT_FOCUS_Y = 3.45; // Places curved IMAX screen cleanly above bottom drawer

export const Auditorium3DView: React.FC<Auditorium3DViewProps> = ({
  seats,
  selectedSeat,
  movieTitle = 'Scene',
  movieBackdrop = './dune_clean_screen.jpg',
  screenName = 'Audi 3 · IMAX 4K Laser',
  replayTrigger = 0,
  onTransitionComplete,
  onUserInteract,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const lookAroundRef = useRef({ yaw: 0, pitch: 0, zoom: 0 });
  const flightStartRef = useRef<number>(performance.now());
  const isFlyingRef = useRef<boolean>(true);
  const flightCompletedRef = useRef<boolean>(false);
  const FLIGHT_DURATION = 1350;

  const selectedSeatRef = useRef(selectedSeat);
  selectedSeatRef.current = selectedSeat;

  const onTransitionCompleteRef = useRef(onTransitionComplete);
  onTransitionCompleteRef.current = onTransitionComplete;

  const onUserInteractRef = useRef(onUserInteract);
  onUserInteractRef.current = onUserInteract;

  useEffect(() => {
    flightStartRef.current = performance.now();
    isFlyingRef.current = true;
    flightCompletedRef.current = false;
    lookAroundRef.current = { yaw: 0, pitch: 0, zoom: 0 };
  }, [selectedSeat.id, replayTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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

    const getWidth = () => container.clientWidth || window.innerWidth;
    const getHeight = () => container.clientHeight || window.innerHeight;
    const getResponsiveFov = (aspect: number) =>
      aspect < 1.0 ? Math.min(72, Math.max(54, 52 / Math.max(0.58, aspect))) : 52;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(getWidth(), getHeight());
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm obsidian auditorium atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090807');
    scene.fog = new THREE.FogExp2('#090807', 0.015);

    const initialAspect = getWidth() / Math.max(1, getHeight());
    const camera = new THREE.PerspectiveCamera(
      getResponsiveFov(initialAspect),
      initialAspect,
      0.05,
      150
    );
    camera.position.set(0, 6.0, 15.5);
    camera.lookAt(0, SEAT_FOCUS_Y, 0);

    let pmremRenderTarget: THREE.WebGLRenderTarget | null = null;
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      pmremRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
      scene.environment = pmremRenderTarget.texture;
      scene.environmentIntensity = 0.35;
      roomEnv.dispose();
      pmremGenerator.dispose();
    } catch (_) {}

    // Theatrical 3-point lighting: gentle screen bounce illumination onto foreground headrests
    const ambientLight = new THREE.AmbientLight('#201c18', 0.85);
    scene.add(ambientLight);

    const screenBounce = new THREE.PointLight('#f5dec0', 3.4, 34, 1.4);
    screenBounce.position.set(0, 4.6, 2.2);
    scene.add(screenBounce);

    const overheadWash = new THREE.DirectionalLight('#4a433b', 0.65);
    overheadWash.position.set(0, 16, 6);
    scene.add(overheadWash);

    const createProceduralScreenTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 2048;
      cvs.height = 870;
      const ctx = cvs.getContext('2d')!;

      // Warm dune-sky anamorphic wash
      const grad = ctx.createLinearGradient(0, 0, 0, 870);
      grad.addColorStop(0, '#c8beb4');
      grad.addColorStop(0.58, '#dfd3c3');
      grad.addColorStop(0.76, '#6e523a');
      grad.addColorStop(1, '#1a120d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2048, 870);

      // Gentle sun halo + distant silhouette ridge
      const sunGrad = ctx.createRadialGradient(1024, 520, 40, 1024, 520, 640);
      sunGrad.addColorStop(0, 'rgba(255, 244, 224, 0.72)');
      sunGrad.addColorStop(0.5, 'rgba(235, 198, 150, 0.18)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, 2048, 870);

      ctx.beginPath();
      ctx.moveTo(0, 650);
      ctx.quadraticCurveTo(460, 560, 1024, 620);
      ctx.quadraticCurveTo(1560, 680, 2048, 595);
      ctx.lineTo(2048, 870);
      ctx.lineTo(0, 870);
      ctx.closePath();
      ctx.fillStyle = '#332419';
      ctx.fill();

      // Quiet editorial slate typography centered gently
      ctx.fillStyle = 'rgba(24, 20, 16, 0.72)';
      ctx.font = '600 44px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(movieTitle.toUpperCase(), 1024, 410);

      ctx.fillStyle = 'rgba(24, 20, 16, 0.5)';
      ctx.font = '500 20px "JetBrains Mono", monospace';
      ctx.fillText(`${screenName.toUpperCase()} · 70MM SIGHTLINE`, 1024, 456);

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const createCroppedMovieTexture = (img: HTMLImageElement) => {
      const cvs = document.createElement('canvas');
      cvs.width = 2048;
      cvs.height = 870;
      const ctx = cvs.getContext('2d')!;

      // Trim 5% top/bottom to remove any baked black edge bars
      const cropMarginY = img.naturalHeight * 0.05;
      const usableH = img.naturalHeight - cropMarginY * 2;
      const imgRatio = img.naturalWidth / usableH;
      const cvsRatio = cvs.width / cvs.height;

      let sx = 0;
      let sy = cropMarginY;
      let sw = img.naturalWidth;
      let sh = usableH;

      if (imgRatio > cvsRatio) {
        sw = usableH * cvsRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / cvsRatio;
        sy = cropMarginY + (usableH - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cvs.width, cvs.height);

      // Soft theater corner vignette
      const vig = ctx.createRadialGradient(1024, 435, 420, 1024, 435, 1180);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vig.addColorStop(1, 'rgba(10, 9, 8, 0.35)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, 2048, 870);

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const movieTexture = createProceduralScreenTexture();
    let loadedMovieTexture: THREE.Texture | null = null;

    // Curved IMAX Cinema Scope Screen (2.35:1)
    const screenWidth = 13.5;
    const screenHeight = 5.74;
    const screenGeom = new THREE.PlaneGeometry(screenWidth, screenHeight, 40, 16);
    const posAttr = screenGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      posAttr.setZ(i, x * x * 0.024);
    }
    screenGeom.computeVertexNormals();

    const screenMat = new THREE.MeshStandardMaterial({
      map: movieTexture,
      roughness: 0.35,
      metalness: 0.02,
      emissive: '#ffffff',
      emissiveMap: movieTexture,
      emissiveIntensity: 0.92,
    });
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.set(0, 4.55, 0);
    scene.add(screenMesh);

    // Matching curved matte black acoustic screen mask behind the screen
    const frameGeom = new THREE.PlaneGeometry(screenWidth + 0.45, screenHeight + 0.45, 40, 8);
    const fPosAttr = frameGeom.attributes.position;
    for (let i = 0; i < fPosAttr.count; i++) {
      const x = fPosAttr.getX(i);
      fPosAttr.setZ(i, x * x * 0.024 - 0.03);
    }
    frameGeom.computeVertexNormals();
    const frameMat = new THREE.MeshBasicMaterial({ color: '#030303', side: THREE.DoubleSide });
    const frameMesh = new THREE.Mesh(frameGeom, frameMat);
    frameMesh.position.set(0, 4.55, 0);
    scene.add(frameMesh);

    // Load cinema frame image cleanly without baked borders
    const resolvedBackdrop = movieBackdrop || './dune_clean_screen.jpg';
    const imgLoader = new Image();
    imgLoader.crossOrigin = 'anonymous';
    imgLoader.onload = () => {
      try {
        loadedMovieTexture = createCroppedMovieTexture(imgLoader);
        screenMat.map = loadedMovieTexture;
        screenMat.emissiveMap = loadedMovieTexture;
        screenMat.needsUpdate = true;
      } catch (_) {}
    };
    imgLoader.src = resolvedBackdrop;

    // --- Sculpted Rounded Velvet Theater Chairs ---
    const availableVelvetMat = new THREE.MeshStandardMaterial({
      color: '#1f1b19',
      roughness: 0.82,
      metalness: 0.04,
    });

    const occupiedVelvetMat = new THREE.MeshStandardMaterial({
      color: '#34191c',
      roughness: 0.82,
      metalness: 0.04,
    });

    const darkArmrestMat = new THREE.MeshStandardMaterial({
      color: '#11100f',
      roughness: 0.55,
      metalness: 0.25,
    });

    const darkStemMat = new THREE.MeshStandardMaterial({
      color: '#090808',
      roughness: 0.4,
      metalness: 0.8,
    });

    const selectedBackMat = new THREE.MeshStandardMaterial({
      color: '#E5A93C',
      roughness: 0.36,
      metalness: 0.14,
      emissive: '#E5A93C',
      emissiveIntensity: 0.38,
    });

    const selectedHeadrestMat = new THREE.MeshStandardMaterial({
      color: '#E5A93C',
      roughness: 0.36,
      metalness: 0.14,
    });

    const createGoldNumberTexture = (seatNum: number) => {
      const cvs = document.createElement('canvas');
      cvs.width = 128;
      cvs.height = 128;
      const c = cvs.getContext('2d')!;
      c.fillStyle = '#E5A93C';
      c.fillRect(0, 0, 128, 128);
      c.fillStyle = '#12110f';
      c.font = 'bold 54px "JetBrains Mono", "Inter", monospace';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(String(seatNum), 64, 64);
      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const cushionGeom = new RoundedBoxGeometry(0.54, 0.14, 0.5, 3, 0.04);
    const backGeom = new RoundedBoxGeometry(0.54, 0.62, 0.14, 3, 0.045);
    const headrestGeom = new RoundedBoxGeometry(0.46, 0.22, 0.15, 3, 0.055);
    const armrestGeom = new RoundedBoxGeometry(0.075, 0.18, 0.44, 2, 0.025);
    const stemGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 8);

    const seatMeshMap = new Map<
      string,
      {
        status: Seat['status'];
        cushion: THREE.Mesh;
        back: THREE.Mesh;
        headrest: THREE.Mesh;
      }
    >();

    seats.forEach((seat) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(seat.x, seat.y, seat.z);

      const baseMat = seat.status === 'occupied' ? occupiedVelvetMat : availableVelvetMat;

      const stem = new THREE.Mesh(stemGeom, darkStemMat);
      stem.position.set(0, 0.15, 0);
      chairGroup.add(stem);

      const cushion = new THREE.Mesh(cushionGeom, baseMat);
      cushion.position.set(0, 0.35, 0);
      chairGroup.add(cushion);

      const back = new THREE.Mesh(backGeom, baseMat);
      back.position.set(0, 0.68, 0.22);
      back.rotation.x = -0.1;
      chairGroup.add(back);

      const headrest = new THREE.Mesh(headrestGeom, baseMat);
      headrest.position.set(0, 1.03, 0.27);
      headrest.rotation.x = -0.1;
      chairGroup.add(headrest);

      [-0.31, 0.31].forEach((armX) => {
        const arm = new THREE.Mesh(armrestGeom, darkArmrestMat);
        arm.position.set(armX, 0.45, 0.04);
        chairGroup.add(arm);
      });

      scene.add(chairGroup);
      seatMeshMap.set(seat.id, { status: seat.status, cushion, back, headrest });
    });

    // Stadium riser steps + warm brass aisle step guides
    const riserMat = new THREE.MeshStandardMaterial({ color: '#0c0b0a', roughness: 0.94 });
    const riserStepGeoms: THREE.BufferGeometry[] = [];
    const aisleLightMat = new THREE.MeshBasicMaterial({ color: '#E5A93C' });
    const aisleLightGeom = new THREE.BoxGeometry(0.28, 0.018, 0.04);

    for (let r = 0; r < 10; r++) {
      const riserZ = 5.2 + r * 1.15;
      const stepHeight = r * 0.32 + 0.1;
      const riserY = stepHeight / 2 - 0.05;
      const stepGeom = new THREE.BoxGeometry(16, stepHeight, 1.18);
      riserStepGeoms.push(stepGeom);
      const stepMesh = new THREE.Mesh(stepGeom, riserMat);
      stepMesh.position.set(0, riserY, riserZ);
      scene.add(stepMesh);

      // Subtle brass step marker lights at the two center aisles
      if (r < 9) {
        [-3.2, 3.2].forEach((aisleX) => {
          const strip = new THREE.Mesh(aisleLightGeom, aisleLightMat);
          strip.position.set(aisleX, riserY + stepHeight / 2 + 0.01, riserZ - 0.56);
          scene.add(strip);
        });
      }
    }

    // Stage apron below screen
    const stageGeom = new THREE.BoxGeometry(15.6, 0.45, 3.2);
    const stagePlatform = new THREE.Mesh(stageGeom, riserMat);
    stagePlatform.position.set(0, 0.2, 1.6);
    scene.add(stagePlatform);

    // Side walls, acoustic ribs, and ceiling baffles
    const wallGeom = new THREE.BoxGeometry(0.3, 14, 34);
    const wallMat = new THREE.MeshStandardMaterial({ color: '#0b0a09', roughness: 0.92 });
    const leftWall = new THREE.Mesh(wallGeom, wallMat);
    leftWall.position.set(-8.2, 5, 8);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeom, wallMat);
    rightWall.position.set(8.2, 5, 8);
    scene.add(rightWall);

    const finGeom = new THREE.BoxGeometry(0.35, 8.5, 0.16);
    const finMat = new THREE.MeshStandardMaterial({ color: '#171513', roughness: 0.85 });
    for (let f = 0; f < 8; f++) {
      const finZ = 2.8 + f * 2.2;
      const leftFin = new THREE.Mesh(finGeom, finMat);
      leftFin.position.set(-7.95, 4.6, finZ);
      scene.add(leftFin);

      const rightFin = new THREE.Mesh(finGeom, finMat);
      rightFin.position.set(7.95, 4.6, finZ);
      scene.add(rightFin);
    }

    const ceilingBeamGeom = new THREE.BoxGeometry(16, 0.25, 0.28);
    for (let c = 0; c < 6; c++) {
      const beam = new THREE.Mesh(ceilingBeamGeom, finMat);
      beam.position.set(0, 9.2, 2.5 + c * 2.6);
      scene.add(beam);
    }

    // Update chair highlight state
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
        roughness: 0.3,
        metalness: 0.12,
        emissive: '#E5A93C',
        emissiveIntensity: 0.45,
      });

      seats.forEach((seat) => {
        const item = seatMeshMap.get(seat.id);
        if (!item) return;

        const isSelected = seat.id === currentSelected.id;
        const baseMat = item.status === 'occupied' ? occupiedVelvetMat : availableVelvetMat;

        item.cushion.material = isSelected ? cachedGoldMat! : baseMat;
        item.back.material = isSelected ? selectedBackMat : baseMat;
        item.headrest.material = isSelected ? selectedHeadrestMat : baseMat;
        item.headrest.visible = !isSelected;
      });
    };

    updateChairColors();

    // Pointer look-around controls
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (isFlyingRef.current) return;
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      renderer.domElement.style.cursor = 'grabbing';
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

      onUserInteractRef.current?.();
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
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
      onUserInteractRef.current?.();
    };

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';
    dom.style.cursor = 'grab';
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const selSeat = selectedSeatRef.current;
      const { yaw, pitch, zoom } = lookAroundRef.current;
      const aspect = getWidth() / Math.max(1, getHeight());
      const baseFov = getResponsiveFov(aspect);

      if (isFlyingRef.current) {
        const elapsed = performance.now() - flightStartRef.current;
        const rawT = Math.min(1.0, elapsed / FLIGHT_DURATION);

        const { position, lookAt, fov } = interpolateCameraCoordinates(
          selSeat,
          rawT,
          baseFov,
          SEAT_FOCUS_Y
        );

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
        const eyeX = selSeat.x;
        const eyeY = selSeat.y + 0.92;
        const eyeZ = selSeat.z - 0.04;
        camera.position.set(eyeX, eyeY, eyeZ);

        const baseDist = Math.hypot(0 - eyeX, 0 - eyeZ);
        const baseYaw = Math.atan2(0 - eyeX, eyeZ);
        const basePitch = Math.atan2(SEAT_FOCUS_Y - eyeY, baseDist);

        const currentYaw = baseYaw + yaw;
        const currentPitch = basePitch + pitch;

        const dirX = Math.sin(currentYaw) * Math.cos(currentPitch);
        const dirY = Math.sin(currentPitch);
        const dirZ = -Math.cos(currentYaw) * Math.cos(currentPitch);

        camera.lookAt(eyeX + dirX * 20, eyeY + dirY * 20, eyeZ + dirZ * 20);
        camera.fov = Math.max(36, Math.min(74, baseFov - zoom));
        camera.updateProjectionMatrix();
      }

      updateChairColors();
      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

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
    const resizeObserver = new ResizeObserver(handleResize);
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
      frameGeom.dispose();
      screenMat.dispose();
      frameMat.dispose();
      movieTexture.dispose();
      loadedMovieTexture?.dispose();
      cushionGeom.dispose();
      backGeom.dispose();
      headrestGeom.dispose();
      armrestGeom.dispose();
      stemGeom.dispose();
      riserStepGeoms.forEach((g) => g.dispose());
      aisleLightGeom.dispose();
      stageGeom.dispose();
      wallGeom.dispose();
      finGeom.dispose();
      ceilingBeamGeom.dispose();
      availableVelvetMat.dispose();
      occupiedVelvetMat.dispose();
      darkArmrestMat.dispose();
      darkStemMat.dispose();
      selectedBackMat.dispose();
      selectedHeadrestMat.dispose();
      riserMat.dispose();
      aisleLightMat.dispose();
      wallMat.dispose();
      finMat.dispose();
      cachedGoldMat?.map?.dispose();
      cachedGoldMat?.dispose();
      pmremRenderTarget?.dispose();
    };
  }, [seats, movieTitle, movieBackdrop, screenName]);

  return <div ref={mountRef} className="w-full h-full relative" />;
};

export default Auditorium3DView;
