"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Html,
  useProgress,
  useGLTF,
} from "@react-three/drei";
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode, ErrorInfo } from "react";

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
  /**
   * Optional path to a local .hdr/.exr file (e.g. "/hdri/apartment.hdr").
   * If provided, this is used INSTEAD of Drei's remote CDN preset, which
   * avoids production failures caused by CSP, ad-blockers, or the
   * third-party CDN being unreachable.
   */
  files?: string;
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

  /**
   * Rendered instead of the whole scene if the model / environment
   * fails to load in production (bad path, 404, CDN unreachable, etc).
   */
  errorComponent?: ReactNode;
}

// ---------- Loader ----------

function DefaultLoader({ loadingText }: { loadingText: string }) {
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

function DefaultErrorFallback() {
  return (
    <Html center>
      <div className="flex w-48 flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          تعذر تحميل المطبخ ثلاثي الأبعاد
        </p>
        <p className="text-xs text-muted-foreground/70">
          يرجى إعادة تحميل الصفحة
        </p>
      </div>
    </Html>
  );
}

// ---------- Error Boundary ----------
// Suspense only catches *pending promises*. useGLTF / Environment throw
// real Errors when a fetch fails (404, bad path, CDN unreachable, CORS).
// Without this boundary, that error propagates up and unmounts the
// whole app in production instead of just this widget.

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with your logging/monitoring of choice (Sentry, etc.)
    console.error("[ModelScene] failed to load 3D content:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
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
  return <primitive object={scene} scale={scale} position={position} />;
}

// ---------- Environment wrapper ----------
// Prefers a local file (bundled with your app / same-origin) over Drei's
// remote CDN preset, so it can't fail due to third-party network issues.

function SceneEnvironment({ config }: { config: EnvironmentConfig }) {
  if (config.files) {
    return (
      <Environment files={config.files} background={config.background ?? false} />
    );
  }

  return (
    <Environment
      preset={config.preset ?? "apartment"}
      background={config.background ?? false}
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
  errorComponent,
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
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <ModelErrorBoundary fallback={errorComponent ?? <DefaultErrorFallback />}>
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
                loaderComponent ?? <DefaultLoader loadingText={loadingText} />
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
                <ambientLight intensity={ambientLightIntensity} />
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
              {environment && environment.enabled !== false && (
                <SceneEnvironment config={environment} />
              )}

              {/* Controls */}
              {orbitControls && orbitControls.enabled !== false && (
                <OrbitControls
                  target={orbitControls.target}
                  enablePan={orbitControls.enablePan ?? false}
                  enableZoom={orbitControls.enableZoom ?? true}
                  enableRotate={orbitControls.enableRotate ?? true}
                  autoRotate={orbitControls.autoRotate ?? false}
                  autoRotateSpeed={orbitControls.autoRotateSpeed ?? 1}
                  minDistance={orbitControls.minDistance}
                  maxDistance={orbitControls.maxDistance}
                  minPolarAngle={orbitControls.minPolarAngle}
                  maxPolarAngle={orbitControls.maxPolarAngle}
                  minAzimuthAngle={orbitControls.minAzimuthAngle}
                  maxAzimuthAngle={orbitControls.maxAzimuthAngle}
                />
              )}
            </Suspense>
          )}
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}