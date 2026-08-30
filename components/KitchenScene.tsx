"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import KitchenModel from "./models/KitchenModel";

export default function KitchenScene() {
  return (
    <div className="h-170 w-full bg-neutral-200">
      <Canvas
        camera={{
          position: [5, -20, 8],
          fov: 45,
        }}
        shadows
      >
        {/* الموديل */}
        <KitchenModel />

        {/* تحريك الكاميرا بالماوس */}
        <OrbitControls
          target={[0, -1, 0]}
          enablePan={false}
          enableZoom={true}
          minDistance={1}
          maxDistance={6.8}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8.2}
        />
      </Canvas>
    </div>
  );
}
