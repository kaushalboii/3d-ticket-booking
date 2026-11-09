import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Seat } from '../../types';

interface CinemaCanvas3DProps {
  seats: Seat[];
  selectedSeatIds: string[];
  focusedSeat: Seat | null;
  viewMode: 'overview' | 'first_person';
  onSeatClick: (seat: Seat) => void;
  onSeatHover?: (seat: Seat | null) => void;
  lookAroundYaw?: number; // delta look around from mouse drag
  lookAroundPitch?: number;
  movieTitle: string;
}

// Pre-allocated scratch vectors to prevent garbage collection allocations in 60fps render loop
const _tempVec3 = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 4.5, -3);

export const CinemaCanvas3D: React.FC<CinemaCanvas3DProps> = ({
  seats,
  selectedSeatIds,
  focusedSeat,
  viewMode,
  onSeatClick,
  onSeatHover,
  lookAroundYaw = 0,
  lookAroundPitch = 0,
  movieTitle
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isSoftwareGlRef = useRef(false);

  // References to keep mutable values accessible in requestAnimationFrame without triggering re-inits
  const seatsRef = useRef(seats);
  seatsRef.current = seats;

  const selectedSeatIdsRef = useRef(selectedSeatIds);
  selectedSeatIdsRef.current = selectedSeatIds;

  const focusedSeatRef = useRef(focusedSeat);
  focusedSeatRef.current = focusedSeat;

  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const lookAroundRef = useRef({ yaw: lookAroundYaw, pitch: lookAroundPitch });
  lookAroundRef.current = { yaw: lookAroundYaw, pitch: lookAroundPitch };

  const onSeatClickRef = useRef(onSeatClick);
  onSeatClickRef.current = onSeatClick;

  const onSeatHoverRef = useRef(onSeatHover);
  onSeatHoverRef.current = onSeatHover;

  // Track hovered seat internal id
  const hoveredSeatIdRef = useRef<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Guard (per Three.js skill)
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
    isSoftwareGlRef.current = isSoftwareGl;

    // 2. Setup Three.js Renderer
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
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0c0e');
    scene.fog = new THREE.FogExp2('#0b0c0e', 0.022);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 14, 25);
    camera.lookAt(0, 3, 8);

    // 4. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. OrbitControls for Overview Mode
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Don't go below floor
    controls.minDistance = 6;
    controls.maxDistance = 40;
    controls.target.set(0, 3, 9);
    controls.update();

    // 6. Auditorium Lighting
    // Warm key spotlight pointing at auditorium seats
    const ceilingKeySpot = new THREE.SpotLight('#f8fafc', 35);
    ceilingKeySpot.position.set(0, 16, 14);
    ceilingKeySpot.target.position.set(0, 1, 10);
    ceilingKeySpot.angle = Math.PI / 3;
    ceilingKeySpot.penumbra = 0.8;
    ceilingKeySpot.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      ceilingKeySpot.shadow.mapSize.width = 1024;
      ceilingKeySpot.shadow.mapSize.height = 1024;
      ceilingKeySpot.shadow.bias = -0.0005;
    }
    scene.add(ceilingKeySpot);
    scene.add(ceilingKeySpot.target);

    // Cool ambient hemisphere fill
    const hemiLight = new THREE.HemisphereLight('#38bdf8', '#020617', 0.6);
    scene.add(hemiLight);

    // Screen projector glow lights (electric cyan and indigo)
    const screenGlowBlue = new THREE.PointLight('#38bdf8', 25, 30);
    screenGlowBlue.position.set(0, 5, 0);
    scene.add(screenGlowBlue);

    const screenGlowViolet = new THREE.PointLight('#a855f7', 18, 25);
    screenGlowViolet.position.set(0, 3, 2);
    scene.add(screenGlowViolet);

    // Subtle projection booth ray from back wall
    const projectorLight = new THREE.SpotLight('#67e8f9', 28, 40, Math.PI / 6.5, 0.6);
    projectorLight.position.set(0, 10, 24);
    projectorLight.target.position.set(0, 4.8, -3);
    scene.add(projectorLight);
    scene.add(projectorLight.target);

    // 7. Procedural Animated Movie Canvas Texture on Curved Screen
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 512;
    const ctx = screenCanvas.getContext('2d')!;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Function to draw animated cinematic visual onto the curved screen
    let simTime = 0;
    const updateScreenCanvas = (timeSec: number) => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 1024, 512);

      // Deep space nebula gradient
      const grad = ctx.createLinearGradient(0, 0, 1024, 512);
      const shift = Math.sin(timeSec * 0.8) * 0.2;
      grad.addColorStop(0, `hsl(215, 90%, ${12 + shift * 6}%)`);
      grad.addColorStop(0.5, `hsl(270, 85%, ${15 + Math.cos(timeSec * 0.7) * 5}%)`);
      grad.addColorStop(1, `hsl(190, 95%, ${14 + shift * 5}%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Glowing horizon grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.5;
      const horizonY = 320;
      for (let i = -10; i <= 10; i++) {
        const spread = (i * 80) + Math.sin(timeSec * 0.5) * 20;
        ctx.beginPath();
        ctx.moveTo(512 + i * 20, horizonY);
        ctx.lineTo(512 + spread * 2.2, 512);
        ctx.stroke();
      }

      // Horizontal perspective rings
      for (let y = horizonY + 20; y < 512; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Central glowing cinematic orb / celestial event
      const orbX = 512;
      const orbY = 220 + Math.sin(timeSec * 1.2) * 12;
      const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, 180);
      orbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      orbGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.8)');
      orbGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.4)');
      orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 180, 0, Math.PI * 2);
      ctx.fill();

      // Movie Title & Sound Branding overlay on the screen
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.fillText(movieTitle.toUpperCase(), 512, 120);

      // Technical Audio/IMAX branding badge
      ctx.shadowBlur = 0;
      ctx.font = '600 15px "JetBrains Mono", monospace';
      ctx.fillStyle = '#67e8f9';
      ctx.fillText('1.43:1 EXPANDED IMAX DUAL LASER  •  12-CHANNEL SPATIAL DOLBY ATMOS', 512, 160);

      // Simulated Real-Time Audio Spectrum Visualizer at bottom of screen
      const barCount = 42;
      const barWidth = 14;
      const startX = 512 - (barCount * (barWidth + 4)) / 2;
      for (let b = 0; b < barCount; b++) {
        const freq = Math.sin(timeSec * 4 + b * 0.4) * 0.5 + 0.5;
        const barHeight = 10 + freq * 65;
        const barGrad = ctx.createLinearGradient(0, 480 - barHeight, 0, 480);
        barGrad.addColorStop(0, '#38bdf8');
        barGrad.addColorStop(1, '#a855f7');
        ctx.fillStyle = barGrad;
        ctx.fillRect(startX + b * (barWidth + 4), 480 - barHeight, barWidth, barHeight);
      }

      screenTexture.needsUpdate = true;
    };

    // 8. Build Curved IMAX Screen Geometry
    // Curved cylinder segment so sides wrap slightly around audience view
    const screenRadius = 26;
    const screenArcAngle = Math.PI * 0.38; // ~68 degree wrap
    const screenHeight = 9.8;
    const screenGeom = new THREE.CylinderGeometry(
      screenRadius,
      screenRadius,
      screenHeight,
      64,
      1,
      true,
      Math.PI * 0.5 - screenArcAngle / 2,
      screenArcAngle
    );
    // Invert geometry normals so inner surface faces viewer at z > -3
    screenGeom.scale(-1, 1, 1);

    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.15,
      metalness: 0.05,
      emissive: '#ffffff',
      emissiveMap: screenTexture,
      emissiveIntensity: 0.85,
    });

    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.set(0, 5.2, -3);
    scene.add(screenMesh);

    // Screen Bezel Frame
    const screenFrameGeom = new THREE.CylinderGeometry(
      screenRadius * 1.01,
      screenRadius * 1.01,
      screenHeight * 1.04,
      64,
      1,
      true,
      Math.PI * 0.5 - screenArcAngle * 1.02 / 2,
      screenArcAngle * 1.02
    );
    screenFrameGeom.scale(-1, 1, 1);
    const screenFrameMat = new THREE.MeshBasicMaterial({ color: '#000000' });
    const screenFrameMesh = new THREE.Mesh(screenFrameGeom, screenFrameMat);
    screenFrameMesh.position.set(0, 5.2, -3.02);
    scene.add(screenFrameMesh);

    // 9. Auditorium Architecture (Risers, Walls, Floor Lights, Exit Signs)
    const auditoriumGroup = new THREE.Group();

    // Stadium stepped concrete risers
    for (let r = 0; r < 8; r++) {
      const riserZ = 4.2 + r * 2.25;
      const riserY = (r * 0.78) / 2;
      const riserHeight = 0.78 * (r + 1);
      const riserStep = new THREE.Mesh(
        new THREE.BoxGeometry(26, riserHeight, 2.3),
        new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.9, metalness: 0.1 })
      );
      riserStep.position.set(0, riserY, riserZ);
      riserStep.receiveShadow = !isSoftwareGl;
      auditoriumGroup.add(riserStep);

      // Low blue LED riser lip safety runner lights
      const lipLight = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 0.04),
        new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.75 })
      );
      lipLight.position.set(0, (r + 1) * 0.78 - 0.01, riserZ - 1.14);
      lipLight.rotation.x = -Math.PI / 2;
      auditoriumGroup.add(lipLight);
    }

    // Auditorium Main Base Floor
    const baseFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 38),
      new THREE.MeshStandardMaterial({ color: '#030712', roughness: 0.95 })
    );
    baseFloor.position.set(0, 0, 14);
    baseFloor.rotation.x = -Math.PI / 2;
    baseFloor.receiveShadow = !isSoftwareGl;
    auditoriumGroup.add(baseFloor);

    // Side Acoustic Wall Baffle Ribs (Composite 3D architecture with LED accent slots)
    [-13.2, 13.2].forEach((wallX, sideIdx) => {
      // Main acoustic wall
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 16, 36),
        new THREE.MeshStandardMaterial({ color: '#050811', roughness: 0.85 })
      );
      wall.position.set(wallX, 7.5, 13);
      auditoriumGroup.add(wall);

      // Geometric vertical acoustic acoustic baffle slats
      for (let s = 0; s < 7; s++) {
        const slatZ = 0 + s * 4.6;
        const slat = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 12, 1.2),
          new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.7, metalness: 0.2 })
        );
        slat.position.set(wallX + (sideIdx === 0 ? 0.35 : -0.35), 7, slatZ);
        auditoriumGroup.add(slat);

        // Restrained acoustic baffle wall illumination
        const strip = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, 9),
          new THREE.MeshBasicMaterial({
            color: '#a1a1aa',
            transparent: true,
            opacity: 0.2
          })
        );
        strip.position.set(wallX + (sideIdx === 0 ? 0.56 : -0.56), 7, slatZ);
        strip.rotation.y = sideIdx === 0 ? Math.PI / 2 : -Math.PI / 2;
        auditoriumGroup.add(strip);
      }
    });

    // Emergency Exit Signs at back sides (Subtle green cinema fixture)
    [[-12.8, 2.5, 25], [12.8, 2.5, 25]].forEach(([x, y, z]) => {
      const exitBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.4, 0.2),
        new THREE.MeshStandardMaterial({ color: '#10b981', emissive: '#10b981', emissiveIntensity: 0.9 })
      );
      exitBox.position.set(x, y, z);
      auditoriumGroup.add(exitBox);
    });

    scene.add(auditoriumGroup);

    // 10. Construct Composite 3D Seats (3–12 parts per seat as required by skill)
    // Shared geometry and materials to keep GPU draw calls low and silky smooth
    const seatBaseGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.3, 10);
    const seatFrameGeom = new THREE.BoxGeometry(0.68, 0.08, 0.62);
    const seatCushionGeom = new THREE.BoxGeometry(0.62, 0.14, 0.58);
    const seatBackGeom = new THREE.BoxGeometry(0.62, 0.68, 0.14);
    const headrestGeom = new THREE.BoxGeometry(0.48, 0.22, 0.16);
    const armrestGeom = new THREE.BoxGeometry(0.09, 0.22, 0.52);
    const cupHolderGeom = new THREE.CylinderGeometry(0.038, 0.038, 0.06, 12);
    const seatPlateGeom = new THREE.PlaneGeometry(0.18, 0.08);

    // Metal pedestals and armrest mounts
    const metalMat = new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.35, metalness: 0.85 });
    const armrestCushionMat = new THREE.MeshStandardMaterial({ color: '#020617', roughness: 0.65 });

    // Seat Groups mapped by seat id
    const seatMeshMap = new Map<string, { group: THREE.Group; cushionMesh: THREE.Mesh; backMesh: THREE.Mesh; headrestMesh: THREE.Mesh }>();

    // Interactive Raycasting proxy list
    const raycastHitboxes: THREE.Mesh[] = [];

    seats.forEach((seat) => {
      const seatGroup = new THREE.Group();
      seatGroup.position.set(seat.coord3D.x, seat.coord3D.y, seat.coord3D.z);

      // Part 1: Floor Mounting Stem
      const stem = new THREE.Mesh(seatBaseGeom, metalMat);
      stem.position.set(0, 0.15, 0);
      stem.castShadow = !isSoftwareGl;
      seatGroup.add(stem);

      // Part 2: Seat Tray Structure
      const tray = new THREE.Mesh(seatFrameGeom, metalMat);
      tray.position.set(0, 0.28, 0);
      tray.castShadow = !isSoftwareGl;
      seatGroup.add(tray);

      // Part 3: Ergonomic Bottom Cushion
      const cushionMat = new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.45,
        metalness: 0.15,
      });
      const cushion = new THREE.Mesh(seatCushionGeom, cushionMat);
      cushion.position.set(0, 0.37, 0);
      cushion.castShadow = !isSoftwareGl;
      cushion.receiveShadow = !isSoftwareGl;
      seatGroup.add(cushion);

      // Part 4: Contoured Backrest tilted back towards spectator recline
      const back = new THREE.Mesh(seatBackGeom, cushionMat);
      back.position.set(0, 0.72, 0.24);
      back.rotation.x = -0.16; // Recline angle
      back.castShadow = !isSoftwareGl;
      seatGroup.add(back);

      // Part 5: Headrest
      const headrest = new THREE.Mesh(headrestGeom, cushionMat);
      headrest.position.set(0, 1.12, 0.32);
      headrest.rotation.x = -0.16;
      seatGroup.add(headrest);

      // Part 6 & 7: Left and Right Armrests with Cup Holders
      [-0.37, 0.37].forEach((armX) => {
        const arm = new THREE.Mesh(armrestGeom, armrestCushionMat);
        arm.position.set(armX, 0.48, 0.05);
        arm.castShadow = !isSoftwareGl;
        seatGroup.add(arm);

        // Cup holder inset
        const cup = new THREE.Mesh(cupHolderGeom, metalMat);
        cup.position.set(armX, 0.6, -0.15);
        seatGroup.add(cup);
      });

      // Part 8: Seat Number Tag Badge on Back
      const tagMat = new THREE.MeshBasicMaterial({ color: '#475569' });
      const tagMesh = new THREE.Mesh(seatPlateGeom, tagMat);
      tagMesh.position.set(0, 0.95, 0.33);
      tagMesh.rotation.x = -0.16;
      seatGroup.add(tagMesh);

      // Invisible Raycasting Hitbox for precise pointer interaction
      const hitboxGeom = new THREE.BoxGeometry(0.82, 1.25, 0.82);
      const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitbox = new THREE.Mesh(hitboxGeom, hitboxMat);
      hitbox.position.set(0, 0.6, 0.1);
      hitbox.userData = { seatId: seat.id };
      seatGroup.add(hitbox);
      raycastHitboxes.push(hitbox);

      scene.add(seatGroup);
      seatMeshMap.set(seat.id, {
        group: seatGroup,
        cushionMesh: cushion,
        backMesh: back,
        headrestMesh: headrest,
      });
    });

    // Helper to update colors of seat materials based on state
    const updateSeatColors = () => {
      const curSelected = selectedSeatIdsRef.current;
      const curFocused = focusedSeatRef.current;
      const curHovered = hoveredSeatIdRef.current;

      seatsRef.current.forEach((seat) => {
        const item = seatMeshMap.get(seat.id);
        if (!item) return;

        const isSelected = curSelected.includes(seat.id);
        const isFocused = curFocused?.id === seat.id;
        const isHovered = curHovered === seat.id;
        const isOccupied = seat.status === 'occupied';

        let targetColor = '#1e293b'; // default slate
        let emissiveColor = '#000000';
        let emissiveIntensity = 0;

        if (isSelected) {
          targetColor = '#ffffff';
          emissiveColor = '#d4a373';
          emissiveIntensity = 0.35;
        } else if (isFocused) {
          targetColor = '#e4e4e7';
          emissiveColor = '#a1a1aa';
          emissiveIntensity = 0.25;
        } else if (isOccupied) {
          targetColor = '#16171b';
        } else if (isHovered) {
          targetColor = '#d4d4d8';
          emissiveColor = '#71717a';
          emissiveIntensity = 0.15;
        } else {
          // Subtle restrained seat tier palette
          if (seat.tier === 'vip_recliner') {
            targetColor = '#78350f'; // Warm dark amber leather
          } else if (seat.tier === 'premium') {
            targetColor = '#27272a'; // Deep zinc premium
          } else {
            targetColor = '#18181b'; // Quiet charcoal standard
          }
        }

        const mat = item.cushionMesh.material as THREE.MeshStandardMaterial;
        mat.color.set(targetColor);
        mat.emissive.set(emissiveColor);
        mat.emissiveIntensity = emissiveIntensity;

        const backMat = item.backMesh.material as THREE.MeshStandardMaterial;
        backMat.color.set(targetColor);
        backMat.emissive.set(emissiveColor);
        backMat.emissiveIntensity = emissiveIntensity;

        const headMat = item.headrestMesh.material as THREE.MeshStandardMaterial;
        headMat.color.set(targetColor);
      });
    };

    // Initial color application
    updateSeatColors();

    // 11. Raycasting Setup for Pointer Events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getPointerCoords = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (viewModeRef.current === 'first_person') return; // Don't raycast seats while sitting in eye level

      getPointerCoords(e);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastHitboxes, false);

      if (intersects.length > 0) {
        const hitSeatId = intersects[0].object.userData.seatId as string;
        const matchedSeat = seatsRef.current.find((s) => s.id === hitSeatId) || null;

        if (matchedSeat && matchedSeat.status !== 'occupied') {
          renderer.domElement.style.cursor = 'pointer';
          if (hoveredSeatIdRef.current !== hitSeatId) {
            hoveredSeatIdRef.current = hitSeatId;
            updateSeatColors();
            onSeatHoverRef.current?.(matchedSeat);
          }
        } else {
          renderer.domElement.style.cursor = 'not-allowed';
          if (hoveredSeatIdRef.current !== null) {
            hoveredSeatIdRef.current = null;
            updateSeatColors();
            onSeatHoverRef.current?.(null);
          }
        }
      } else {
        renderer.domElement.style.cursor = 'default';
        if (hoveredSeatIdRef.current !== null) {
          hoveredSeatIdRef.current = null;
          updateSeatColors();
          onSeatHoverRef.current?.(null);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      getPointerCoords(e);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastHitboxes, false);

      if (intersects.length > 0) {
        const hitSeatId = intersects[0].object.userData.seatId as string;
        const clickedSeat = seatsRef.current.find((s) => s.id === hitSeatId);
        if (clickedSeat && clickedSeat.status !== 'occupied') {
          onSeatClickRef.current(clickedSeat);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointermove', handlePointerMove);
    domElement.addEventListener('click', handleClick);

    // 12. Main 60fps Animation Loop with Exponential Damping & Camera Director
    let frameId = 0;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      frameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      simTime += delta;

      // Update screen visualizer canvas
      updateScreenCanvas(simTime);

      // Camera Director logic
      const mode = viewModeRef.current;
      const currentFocused = focusedSeatRef.current;

      if (mode === 'first_person' && currentFocused) {
        // Disable orbit controls while in eye-level
        controls.enabled = false;

        // Eye position: human eye sits approx 0.88 units above seat riser, slightly forward
        _targetCamPos.set(
          currentFocused.coord3D.x,
          currentFocused.coord3D.y + 0.88,
          currentFocused.coord3D.z + 0.08
        );

        // Look at center of curved movie screen with user's look-around yaw & pitch
        const { yaw, pitch } = lookAroundRef.current;
        _targetLookAt.set(
          0 + yaw * 8,
          4.8 + pitch * 4,
          -3
        );

        // Exponential smooth damping (k = 5.5) for cinematic flight into seat
        const lerpFactor = 1 - Math.exp(-5.5 * delta);
        camera.position.lerp(_targetCamPos, lerpFactor);
        _currentLookAt.lerp(_targetLookAt, lerpFactor);
        camera.lookAt(_currentLookAt);

      } else {
        // Overview Mode
        controls.enabled = true;
        controls.update();
      }

      // Keep seat colors synced if selection or focus changed
      updateSeatColors();

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // 13. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('click', handleClick);

      controls.dispose();
      renderer.dispose();
      screenGeom.dispose();
      screenMat.dispose();
      screenTexture.dispose();
      seatBaseGeom.dispose();
      seatFrameGeom.dispose();
      seatCushionGeom.dispose();
      seatBackGeom.dispose();
      headrestGeom.dispose();
      armrestGeom.dispose();
      cupHolderGeom.dispose();

      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, [movieTitle]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#030712]">
      {/* Three.js Canvas Container - Mounted once */}
      <div ref={mountRef} className="w-full h-full block" />
    </div>
  );
};
