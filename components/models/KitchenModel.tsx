"use client";

import { useGLTF } from "@react-three/drei";

export default function KitchenModel() {
  const { scene } = useGLTF("/3d_models/kitchen.glb");

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

useGLTF.preload("/models/kitchen.glb");