import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Seat } from '../types';
import { RotateCcw, Move, Compass, ZoomIn, ZoomOut } from 'lucide-react';

interface Auditorium3DViewProps {
  seats: Seat[];
  selectedSeat: Seat;
  viewPhase: 'transition' | 'eye_level';
  screenImage?: string;
  onTransitionComplete?: () => void;
}

// Scratch vector helpers for zero GC in 60fps render loop
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentCamPos = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3();

export const Auditorium3DView: React.FC<Auditorium3DViewProps> = ({
  seats,
  selectedSeat,
  viewPhase,
  screenImage,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Look-around angles (yaw: horizontal, pitch: vertical)
  const lookAroundRef = useRef({ yaw: 0, pitch: 0, zoom: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);

  const selectedSeatRef = useRef(selectedSeat);
  selectedSeatRef.current = selectedSeat;

  const viewPhaseRef = useRef(viewPhase);
  viewPhaseRef.current = viewPhase;

  // Reset Look-Around to Center Screen
  const handleResetLookAround = () => {
    lookAroundRef.current = { yaw: 0, pitch: 0, zoom: 0 };
    setHasInteracted(false);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL Guard (per Three.js skill)
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Three.js Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.FogExp2('#050505', 0.018);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    // Initial camera position
    camera.position.set(0, 16, 15);
    camera.lookAt(0, 0, 8);
    _currentCamPos.copy(camera.position);
    _currentLookAt.set(0, 0, 8);

    // Studio Environment Reflections via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting matching the rich dark red cinema mood
    const ambientLight = new THREE.AmbientLight('#2b0e12', 0.85);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight('#ffffff', 1.8);
    topLight.position.set(0, 16, 10);
    scene.add(topLight);

    const screenBounceLight = new THREE.PointLight('#fce7c8', 1.5, 30);
    screenBounceLight.position.set(0, 4.4, 2);
    scene.add(screenBounceLight);

    const aisleLight = new THREE.PointLight('#ff3b30', 0.7, 25);
    aisleLight.position.set(0, 0.5, 9);
    scene.add(aisleLight);

    // --- Build Cinema Screen ---
    const base = import.meta.env.BASE_URL || '/';
    const defaultScreen = `${base.replace(/\/$/, '')}/dune_clean_screen.jpg`;
    const screenUrl = screenImage
      ? (screenImage.startsWith('/') ? `${base.replace(/\/$/, '')}${screenImage}` : screenImage)
      : defaultScreen;

    const textureLoader = new THREE.TextureLoader();
    const movieTexture = textureLoader.load(
      screenUrl,
      undefined,
      undefined,
      () => {
        if (screenUrl !== defaultScreen) {
          textureLoader.load(defaultScreen, (fallbackTex) => {
            fallbackTex.colorSpace = THREE.SRGBColorSpace;
            screenMat.map = fallbackTex;
            screenMat.emissiveMap = fallbackTex;
            screenMat.needsUpdate = true;
          });
        }
      }
    );
    movieTexture.colorSpace = THREE.SRGBColorSpace;

    // Curved IMAX Screen Geometry
    const screenWidth = 12.8;
    const screenHeight = 5.6;
    const screenGeom = new THREE.PlaneGeometry(screenWidth, screenHeight, 32, 16);

    const posAttr = screenGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const curveZ = (x * x) * 0.024;
      posAttr.setZ(i, curveZ);
    }
    screenGeom.computeVertexNormals();

    const screenMat = new THREE.MeshStandardMaterial({
      map: movieTexture,
      roughness: 0.15,
      metalness: 0.05,
      emissive: '#ffffff',
      emissiveMap: movieTexture,
      emissiveIntensity: 0.98,
    });
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.set(0, 4.4, 0);
    scene.add(screenMesh);

    // Screen frame border
    const frameGeom = new THREE.BoxGeometry(screenWidth + 0.4, screenHeight + 0.4, 0.2);
    const frameMat = new THREE.MeshBasicMaterial({ color: '#020202' });
    const frameMesh = new THREE.Mesh(frameGeom, frameMat);
    frameMesh.position.set(0, 4.4, -0.15);
    scene.add(frameMesh);

    // --- Build Red Cinema Chairs (Composite Models matching reference) ---
    const redVelvetMat = new THREE.MeshStandardMaterial({
      color: '#8e1b21',
      roughness: 0.65,
      metalness: 0.08,
    });

    const createMintNumberTexture = (seatNum: number) => {
      const cvs = document.createElement('canvas');
      cvs.width = 128;
      cvs.height = 128;
      const c = cvs.getContext('2d')!;
      c.fillStyle = '#55E6A5';
      c.fillRect(0, 0, 128, 128);
      c.fillStyle = '#050505';
      c.font = 'bold 50px "Inter", sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(String(seatNum), 64, 64);
      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const darkArmrestMat = new THREE.MeshStandardMaterial({
      color: '#111111',
      roughness: 0.7,
      metalness: 0.3,
    });

    const darkStemMat = new THREE.MeshStandardMaterial({
      color: '#080808',
      roughness: 0.4,
      metalness: 0.8,
    });

    const cushionGeom = new THREE.BoxGeometry(0.52, 0.12, 0.5);
    const backGeom = new THREE.BoxGeometry(0.52, 0.62, 0.12);
    const headrestGeom = new THREE.BoxGeometry(0.44, 0.2, 0.14);
    const armrestGeom = new THREE.BoxGeometry(0.08, 0.2, 0.44);
    const stemGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 8);

    const seatMeshMap = new Map<string, { group: THREE.Group; cushion: THREE.Mesh; back: THREE.Mesh; headrest: THREE.Mesh }>();

    seats.forEach((seat) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(seat.x, seat.y, seat.z);

      const stem = new THREE.Mesh(stemGeom, darkStemMat);
      stem.position.set(0, 0.15, 0);
      chairGroup.add(stem);

      const cushion = new THREE.Mesh(cushionGeom, redVelvetMat.clone());
      cushion.position.set(0, 0.35, 0);
      chairGroup.add(cushion);

      const back = new THREE.Mesh(backGeom, redVelvetMat.clone());
      back.position.set(0, 0.68, 0.22);
      back.rotation.x = -0.12;
      chairGroup.add(back);

      const headrest = new THREE.Mesh(headrestGeom, redVelvetMat.clone());
      headrest.position.set(0, 1.05, 0.28);
      headrest.rotation.x = -0.12;
      chairGroup.add(headrest);

      [-0.3, 0.3].forEach((armX) => {
        const arm = new THREE.Mesh(armrestGeom, darkArmrestMat);
        arm.position.set(armX, 0.45, 0.05);
        chairGroup.add(arm);
      });

      scene.add(chairGroup);
      seatMeshMap.set(seat.id, { group: chairGroup, cushion, back, headrest });
    });

    // Tiered stadium riser steps
    for (let r = 0; r < 10; r++) {
      const riserZ = 5.2 + r * 1.1;
      const riserY = (r * 0.32) / 2;
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(16, r * 0.32 + 0.1, 1.25),
        new THREE.MeshStandardMaterial({ color: '#060606', roughness: 0.9 })
      );
      stepMesh.position.set(0, riserY, riserZ);
      scene.add(stepMesh);
    }

    // Function to update chair materials based on selected seat
    let lastAppliedSeatId: string | null = null;
    let cachedMintMat: THREE.MeshStandardMaterial | null = null;

    const updateChairColors = () => {
      const currentSelected = selectedSeatRef.current;
      if (lastAppliedSeatId === currentSelected.id) return;
      lastAppliedSeatId = currentSelected.id;

      if (cachedMintMat) {
        cachedMintMat.map?.dispose();
        cachedMintMat.dispose();
      }

      const numTexture = createMintNumberTexture(currentSelected.number);
      cachedMintMat = new THREE.MeshStandardMaterial({
        map: numTexture,
        roughness: 0.3,
        metalness: 0.1,
        emissive: '#55E6A5',
        emissiveIntensity: 0.45,
      });

      seats.forEach((seat) => {
        const item = seatMeshMap.get(seat.id);
        if (!item) return;

        const isSelected = seat.id === currentSelected.id;
        const mat = isSelected ? cachedMintMat! : redVelvetMat;

        item.cushion.material = mat;
        item.back.material = isSelected
          ? new THREE.MeshStandardMaterial({
              color: '#55E6A5',
              roughness: 0.35,
              emissive: '#55E6A5',
              emissiveIntensity: 0.5,
            })
          : redVelvetMat;
        item.headrest.material = isSelected
          ? new THREE.MeshStandardMaterial({
              color: '#55E6A5',
              roughness: 0.35,
            })
          : redVelvetMat;
      });
    };

    updateChairColors();

    // --- Interactive Mouse & Touch Drag Look-Around Controls ---
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      // Update look around angles smoothly
      lookAroundRef.current.yaw += deltaX * 0.0035;
      // Clamp vertical pitch so user can look at ceiling or floor comfortably
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

    // Mouse wheel zoom
    const onWheel = (e: WheelEvent) => {
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

    // Animation Loop
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const selSeat = selectedSeatRef.current;
      const currentPhase = viewPhaseRef.current;
      const { yaw, pitch, zoom } = lookAroundRef.current;

      if (currentPhase === 'transition') {
        // Overhead camera view
        _targetCamPos.set(selSeat.x * 0.35 + yaw * 4, 14.5, 12.5 + pitch * 3);
        _targetLookAt.set(selSeat.x * 0.8, selSeat.y, selSeat.z);

        _currentCamPos.lerp(_targetCamPos, 0.09);
        _currentLookAt.lerp(_targetLookAt, 0.09);

        camera.position.copy(_currentCamPos);
        camera.lookAt(_currentLookAt);

      } else {
        // Eye-level First-Person View with Interactive Look-Around
        _targetCamPos.set(
          selSeat.x,
          selSeat.y + 0.95,
          selSeat.z + 0.08
        );

        // Compute forward look vector based on yaw and pitch
        // Default target points towards screen center (0, 4.2, 0)
        const forwardDist = selSeat.z;
        const targetX = Math.sin(yaw) * forwardDist;
        const targetZ = selSeat.z - Math.cos(yaw) * forwardDist;
        const targetY = 4.2 + Math.tan(pitch) * forwardDist;

        _targetLookAt.set(targetX, targetY, targetZ);

        _currentCamPos.lerp(_targetCamPos, 0.09);
        _currentLookAt.lerp(_targetLookAt, 0.12);

        camera.position.copy(_currentCamPos);
        camera.lookAt(_currentLookAt);

        // Apply zoom to FOV
        const baseFov = container.clientWidth / container.clientHeight < 1.0 ? 56 : 50;
        camera.fov = Math.max(34, Math.min(70, baseFov - zoom));
        camera.updateProjectionMatrix();
      }

      updateChairColors();
      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // Responsive Resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const aspect = width / height;
      camera.aspect = aspect;

      if (aspect < 1.0) {
        camera.fov = Math.max(52, Math.min(68, 50 / aspect * 0.74));
      } else {
        camera.fov = 50;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);

      renderer.dispose();
      screenGeom.dispose();
      screenMat.dispose();
      movieTexture.dispose();
      frameGeom.dispose();
      frameMat.dispose();
      cushionGeom.dispose();
      backGeom.dispose();
      headrestGeom.dispose();
      armrestGeom.dispose();
      stemGeom.dispose();

      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#050505] select-none">
      <div ref={mountRef} className="w-full h-full block" />

      {/* Floating 360° Drag Look-Around Guide */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 bg-[#0A0A0A]/85 backdrop-blur-md border border-[#222222] px-3.5 py-1.5 rounded-full shadow-xl">
        <Compass className="w-3.5 h-3.5 text-[#55E6A5]" />
        <span className="text-[11px] text-[#D5D5D5] font-medium">
          Drag / Swipe anywhere to look around your seat
        </span>
      </div>

      {/* Reset Center View Button */}
      {hasInteracted && (
        <button
          onClick={handleResetLookAround}
          className="absolute top-16 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111]/90 border border-[#222222] text-[#F5F5F5] text-xs font-semibold hover:border-[#55E6A5] transition shadow-lg cursor-pointer"
          title="Reset View to Center Screen"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#55E6A5]" />
          <span>Reset Front</span>
        </button>
      )}
    </div>
  );
};
