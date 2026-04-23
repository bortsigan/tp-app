"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Decal, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Placement, ShirtColor } from "@/app/lib/types";
import { DESIGN_MAP } from "@/app/lib/designs";

const SHIRT_DEPTH = 0.9;

type Props = {
  color: ShirtColor;
  designId: string;
  placement: Placement;
  autoRotate?: boolean;
  className?: string;
};

export default function Tshirt3D({
  color,
  designId,
  placement,
  autoRotate = false,
  className,
}: Props) {
  return (
    <div className={className ?? "h-[460px] w-full"}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.2, 8], fov: 32 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#f4f4f5"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} />
        <directionalLight position={[-5, 2, 3]} intensity={0.35} />
        <directionalLight position={[0, -3, -4]} intensity={0.18} />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Shirt color={color} designId={designId} placement={placement} />
          <ContactShadows
            position={[0, -3.6, 0]}
            opacity={0.35}
            scale={12}
            blur={2.6}
            far={6}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={14}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

function Shirt({
  color,
  designId,
  placement,
}: {
  color: ShirtColor;
  designId: string;
  placement: Placement;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const shape = buildShirtShape();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: SHIRT_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.22,
      bevelOffset: 0,
      bevelSegments: 6,
      steps: 1,
      curveSegments: 32,
    });
    g.translate(0, 0, -SHIRT_DEPTH / 2);
    g.computeVertexNormals();
    return g;
  }, []);

  const collarGeom = useMemo(() => {
    const g = new THREE.TorusGeometry(0.78, 0.09, 14, 64);
    g.rotateX(Math.PI / 2);
    g.scale(1.05, 1, 0.6);
    return g;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      collarGeom.dispose();
    };
  }, [geometry, collarGeom]);

  const dark = isDarkColor(color.hex);
  const design = DESIGN_MAP[designId];

  const decalTexture = useMemo(() => {
    if (!design) return null;
    return makeGlyphTexture(design.glyph, dark);
  }, [design, dark]);

  useEffect(() => {
    return () => {
      decalTexture?.dispose();
    };
  }, [decalTexture]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.04;
  });

  const decal = getDecalProps(placement);

  const sheenColor = useMemo(
    () => new THREE.Color(color.hex).lerp(new THREE.Color("#ffffff"), 0.25),
    [color.hex],
  );

  const collarColor = useMemo(() => {
    const c = new THREE.Color(color.hex);
    return dark ? c.clone().lerp(new THREE.Color("#ffffff"), 0.1) : c.clone().multiplyScalar(0.8);
  }, [color.hex, dark]);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={color.hex}
          roughness={0.88}
          metalness={0}
          sheen={0.6}
          sheenRoughness={0.9}
          sheenColor={sheenColor}
          side={THREE.DoubleSide}
        />
        {decalTexture && (
          <Decal
            position={decal.position}
            rotation={decal.rotation}
            scale={decal.scale}
          >
            <meshStandardMaterial
              map={decalTexture}
              transparent
              polygonOffset
              polygonOffsetFactor={-10}
              depthTest
              depthWrite={false}
              toneMapped={false}
              roughness={0.75}
            />
          </Decal>
        )}
      </mesh>

      {/* Thin ring sitting on the neckline so it reads as a collar. */}
      <mesh geometry={collarGeom} position={[0, 1.85, 0]}>
        <meshPhysicalMaterial
          color={collarColor}
          roughness={0.95}
          sheen={0.4}
          sheenColor={sheenColor}
        />
      </mesh>
    </group>
  );
}

/* ---------- silhouette ---------- */
// Same outline as the 2D SVG mockup — just extruded into 3D.
function buildShirtShape(): THREE.Shape {
  const s = new THREE.Shape();
  const scale = 0.018;
  const cx = 200;
  const cy = 210;
  const t = (px: number, py: number): [number, number] => [
    (px - cx) * scale,
    (cy - py) * scale,
  ];

  let [x, y] = t(155, 50);
  s.moveTo(x, y);
  [x, y] = t(100, 70); s.lineTo(x, y);
  [x, y] = t(55, 130); s.lineTo(x, y);
  [x, y] = t(90, 175); s.lineTo(x, y);
  [x, y] = t(125, 150); s.lineTo(x, y);
  [x, y] = t(125, 355); s.lineTo(x, y);
  {
    const [cpx, cpy] = t(125, 370);
    const [ex, ey] = t(140, 370);
    s.quadraticCurveTo(cpx, cpy, ex, ey);
  }
  [x, y] = t(260, 370); s.lineTo(x, y);
  {
    const [cpx, cpy] = t(275, 370);
    const [ex, ey] = t(275, 355);
    s.quadraticCurveTo(cpx, cpy, ex, ey);
  }
  [x, y] = t(275, 150); s.lineTo(x, y);
  [x, y] = t(310, 175); s.lineTo(x, y);
  [x, y] = t(345, 130); s.lineTo(x, y);
  [x, y] = t(300, 70); s.lineTo(x, y);
  [x, y] = t(245, 50); s.lineTo(x, y);
  {
    const [cpx, cpy] = t(225, 95);
    const [ex, ey] = t(200, 95);
    s.quadraticCurveTo(cpx, cpy, ex, ey);
  }
  {
    const [cpx, cpy] = t(175, 95);
    const [ex, ey] = t(155, 50);
    s.quadraticCurveTo(cpx, cpy, ex, ey);
  }
  return s;
}

/* ---------- textures ---------- */

function makeGlyphTexture(glyph: string, dark: boolean): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas not supported");
  ctx.clearRect(0, 0, size, size);
  const isText = /^[A-Za-z0-9 ]+$/.test(glyph);
  const fontSize = isText ? (glyph.length <= 3 ? 240 : 170) : 400;
  ctx.font = `900 ${fontSize}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji", system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = dark ? "#ffffff" : "#111111";
  ctx.fillText(glyph, size / 2, size / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function isDarkColor(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.5;
}

/* ---------- decal placement ---------- */

type DecalProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

/**
 * Where does the print go, and how deep does the "projector" box reach?
 * We deliberately keep the Z-scale smaller than the shirt's thickness,
 * otherwise the decal punches through to the back side and shows up
 * mirrored (which is how we ended up with "LNM" earlier).
 */
function getDecalProps(placement: Placement): DecalProps {
  const projectDepth = 0.7;
  const front = SHIRT_DEPTH / 2 + 0.05;
  const back = -(SHIRT_DEPTH / 2 + 0.05);
  switch (placement) {
    case "front-center":
      return {
        position: [0, -0.3, front],
        rotation: [0, 0, 0],
        scale: [2.2, 2.2, projectDepth],
      };
    case "front-left-chest":
      return {
        position: [1.0, 1.0, front],
        rotation: [0, 0, 0],
        scale: [0.85, 0.85, projectDepth],
      };
    case "back-center":
      return {
        position: [0, -0.3, back],
        rotation: [0, Math.PI, 0],
        scale: [2.2, 2.2, projectDepth],
      };
    case "left-sleeve":
      return {
        position: [-2.25, 0.9, front],
        rotation: [0, 0, 0],
        scale: [0.75, 0.75, projectDepth],
      };
    case "right-sleeve":
      return {
        position: [2.25, 0.9, front],
        rotation: [0, 0, 0],
        scale: [0.75, 0.75, projectDepth],
      };
  }
}
