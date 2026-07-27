import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";

// Loader Component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        color: '#DE3996',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.9)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '8px', fontSize: '16px' }}>🤖</div>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Loading 3D Model</div>
        <div style={{ fontSize: '12px' }}>{Math.round(progress)}% complete</div>
      </div>
    </Html>
  );
}

// Error Fallback Component
function ErrorFallback({ error }) {
  return (
    <Html center>
      <div style={{
        color: '#dc2626',
        fontSize: '14px',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.95)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #dc2626',
        maxWidth: '300px'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>⚠️</div>
        <div style={{ fontWeight: '600', marginBottom: '8px' }}>Failed to load 3D model</div>
        <div style={{ fontSize: '11px', opacity: 0.8 }}>Check console for details</div>
        {error && (
          <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.6 }}>
            {error.message}
          </div>
        )}
      </div>
    </Html>
  );
}

// Error Boundary (class component)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("3D Model Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Model Component
function MiniBotModel({ modelPath }) {
  const modelRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Rotation animation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  const scale = window.innerWidth < 768 ? [1.65, 1.65, 1.65] : [2, 2, 2]

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
      position={[0, -2.5, 0]}
    />
  );
}

// Preload model to improve UX
useGLTF.preload("/assets/images/mini_bot.glb");

// Main Viewer Component
export default function MiniBotViewer({ modelPath = "/assets/images/mini_bot.glb" }) {
  return (
    <div style={{ width: "100%", height: "410px", background: "transparent", marginTop : '1rem' }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights */}
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow={false} />
        <pointLight position={[-5, 0, 5]} intensity={0.6} />

        {/* Model wrapped in Suspense + ErrorBoundary */}
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <MiniBotModel modelPath={modelPath} />
          </Suspense>
        </ErrorBoundary>

        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={8}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
