"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";

function ParticleCloud(props: any) {
  const ref = useRef<THREE.Points>(null);
  
  // Create a sphere of random particles
  const [sphere] = useState(() => {
    // Generate random points in a sphere
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      // radius 1.5
      const r = 1.5 * Math.cbrt(Math.random());
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#10b981" // primary color
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
        />
      </Points>
    </group>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleCloud />
      </Canvas>
    </div>
  );
}
