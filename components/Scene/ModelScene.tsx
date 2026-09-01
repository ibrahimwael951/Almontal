"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Html,
  useProgress,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

// ---------- Types ----------

interface LightConfig {
  enabled?: boolean;
  position?: [number, number, number];
  intensity?: number;
  color?: string;
  castShadow?: boolean;
}

interface EnvironmentConfig {
  enabled?: boolean;
  preset?:
    | "apartment"
    | "city"
    | "dawn"
    | "forest"
    | "lobby"
    | "night"
    | "park"
    | "studio"
    | "sunset"
    | "warehouse";
  background?: boolean;
}

interface OrbitControlsConfig {
  enabled?: boolean;
  target?: [number, number, number];
  enablePan?: boolean;
  enableZoom?: boolean;
  enableRotate?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minAzimuthAngle?: number;
  maxAzimuthAngle?: number;
}

interface CameraConfig {
  position?: [number, number, number];
  fov?: number;
}

interface KitchenSceneProps {
  modelSrc?: string;
  modelScale?: number;
  modelPosition?: [number, number, number];

  camera?: CameraConfig;
  shadows?: boolean;

  light?: LightConfig | false;

  ambientLightIntensity?: number;

  environment?: EnvironmentConfig | false;

  orbitControls?: OrbitControlsConfig | false;

  className?: string;
  loadingText?: string;
  loaderComponent?: ReactNode;
}

// ---------- Loader ----------

function DefaultLoader({
  loadingText,
}: {
  loadingText: string;
}) {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex w-40 flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />

        <div className="text-center">
          <p className="text-sm font-medium whitespace-nowrap">
            {loadingText}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}

// ---------- Lazy Model Trigger ----------

function LazyModel({
  src,
  scale,
  position,
}: {
  src: string;
  scale: number;
  position: [number, number, number];
}) {
  const { scene } = useGLTF(src);

  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
    />
  );
}

// ---------- Main Component ----------

export default function ModelScene({
  modelSrc = "/3d_models/wooden_kitchen.glb",

  modelScale = 1,

  modelPosition = [0, 0, 0],

  camera = {
    position: [5, -20, 8],
    fov: 45,
  },

  shadows = true,

  light = {
    enabled: true,
    position: [5, 8, 5],
    intensity: 2,
    color: "#ffffff",
    castShadow: false,
  },

  ambientLightIntensity = 0.5,

  environment = {
    enabled: true,
    preset: "apartment",
    background: false,
  },

  orbitControls = {
    enabled: true,
    target: [2, 0.5, 0],

    enablePan: false,
    enableZoom: true,
    enableRotate: true,

    autoRotate: false,
    autoRotateSpeed: 1,

    minDistance: 1,
    maxDistance: 5,

    minPolarAngle: Math.PI / 3.8,
    maxPolarAngle: Math.PI / 2.8,

    minAzimuthAngle: -Math.PI / 4,
    maxAzimuthAngle: Math.PI / 3,
  },

  className = "h-full w-full bg-card cursor-grab active:cursor-grabbing",

  loadingText = "جاري تحميل المطبخ...",

  loaderComponent,
}: KitchenSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);

          // Load only once
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
    >
      <Canvas
        camera={camera}
        shadows={shadows}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        {!shouldLoad ? (
          <Html center>
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-primary/20" />

              <p className="text-sm text-muted-foreground whitespace-nowrap">
                جاري تجهيز المطبخ...
              </p>
            </div>
          </Html>
        ) : (
          <Suspense
            fallback={
              loaderComponent ?? (
                <DefaultLoader loadingText={loadingText} />
              )
            }
          >
            {/* Model */}
            <LazyModel
              src={modelSrc}
              scale={modelScale}
              position={modelPosition}
            />

            {/* Ambient Light */}
            {ambientLightIntensity > 0 && (
              <ambientLight
                intensity={ambientLightIntensity}
              />
            )}

            {/* Directional Light */}
            {light && light.enabled !== false && (
              <directionalLight
                position={light.position ?? [5, 8, 5]}
                intensity={light.intensity ?? 2}
                color={light.color ?? "#ffffff"}
                castShadow={light.castShadow ?? false}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
            )}

            {/* Environment */}
            {environment &&
              environment.enabled !== false && (
                <Environment
                  preset={environment.preset ?? "apartment"}
                  background={
                    environment.background ?? false
                  }
                />
              )}

            {/* Controls */}
            {orbitControls &&
              orbitControls.enabled !== false && (
                <OrbitControls
                  target={orbitControls.target}
                  enablePan={
                    orbitControls.enablePan ?? false
                  }
                  enableZoom={
                    orbitControls.enableZoom ?? true
                  }
                  enableRotate={
                    orbitControls.enableRotate ?? true
                  }
                  autoRotate={
                    orbitControls.autoRotate ?? false
                  }
                  autoRotateSpeed={
                    orbitControls.autoRotateSpeed ?? 1
                  }
                  minDistance={
                    orbitControls.minDistance
                  }
                  maxDistance={
                    orbitControls.maxDistance
                  }
                  minPolarAngle={
                    orbitControls.minPolarAngle
                  }
                  maxPolarAngle={
                    orbitControls.maxPolarAngle
                  }
                  minAzimuthAngle={
                    orbitControls.minAzimuthAngle
                  }
                  maxAzimuthAngle={
                    orbitControls.maxAzimuthAngle
                  }
                />
              )}
          </Suspense>
        )}
      </Canvas>
    </div>
  );
}