"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useState, useRef, useMemo } from "react";
import * as THREE from "three";

function NetworkNodes(props: any) {
  const ref = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const particleCount = 200;
  
  // Generate random points in 3D space
  const { positions, linePositions } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const linePositions: number[] = [];
    
    // Create random nodes
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }

    // Connect nodes that are close to each other
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        // If distance is less than 3 units, connect them
        if (distSq < 9) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }
    
    return { 
      positions, 
      linePositions: new Float32Array(linePositions)
    };
  }, []);

  useFrame((state, delta) => {
    if (ref.current && linesRef.current) {
      // Slow rotation for ambiance
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
      linesRef.current.rotation.y += delta * 0.05;
      linesRef.current.rotation.x += delta * 0.02;
      
      // Slight mouse interaction
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      ref.current.rotation.y += 0.05 * (targetX - ref.current.rotation.y);
      ref.current.rotation.x += 0.05 * (targetY - ref.current.rotation.x);
      linesRef.current.rotation.y += 0.05 * (targetX - linesRef.current.rotation.y);
      linesRef.current.rotation.x += 0.05 * (targetY - linesRef.current.rotation.x);
    }
  });

  return (
    <group {...props}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#000000"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
      
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#000000"
          transparent
          opacity={0.05}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <fog attach="fog" args={["#ffffff", 2, 15]} />
        <NetworkNodes />
      </Canvas>
    </div>
  );
}
