"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, TorusKnot, Float } from "@react-three/drei";
import * as THREE from "three";

function GlassMonolith() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Optimized geometry to reduce polygon count by 75% while maintaining smoothness */}
        <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
        
        {/* Apple-style frosted glass transmission material, optimized for performance */}
        <MeshTransmissionMaterial
          backside={false}
          resolution={256}
          samples={4}
          thickness={1.5}
          chromaticAberration={0.05}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={0.5}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          roughness={0.15}
          transmission={1}
          ior={1.5}
          color="#f8fafc"
        />
      </mesh>
    </Float>
  );
}

export function SecurityCore() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-90 -z-10">
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        
        <GlassMonolith />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 10]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, -20, -10]} intensity={1} color="#a5b4fc" />
        <pointLight position={[0, 0, 5]} intensity={1.5} color="#67e8f9" />
      </Canvas>
    </div>
  );
}
