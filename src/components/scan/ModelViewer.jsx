import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Grid,
  useGLTF,
  useEnvironment,
  Center,
  MeshReflectorMaterial,
  ContactShadows
} from "@react-three/drei";

if (typeof window !== "undefined" && typeof useEnvironment.preload === "function") {
  useEnvironment.preload({ preset: "city" });
}

const estimateGltfBytes = (gltf) => {
  const json = gltf?.parser?.json;
  const bin = Number(json?.buffers?.[0]?.byteLength);
  if (!bin) return null;
  let jsonBytes = 0;
  try {
    jsonBytes = new TextEncoder().encode(JSON.stringify(json)).length;
  } catch (err) {
    jsonBytes = 0;
  }
  const paddedJson = Math.ceil(jsonBytes / 4) * 4;
  return 12 + 8 + paddedJson + 8 + bin;
};

const countPolygons = (scene) => {
  let triangles = 0;
  scene?.traverse((node) => {
    const geometry = node.geometry;
    if (!geometry) return;
    if (geometry.index) {
      triangles += geometry.index.count / 3;
    } else if (geometry.attributes?.position) {
      triangles += geometry.attributes.position.count / 3;
    }
  });
  return Math.round(triangles);
};

const Model = ({ url, onLoaded }) => {
  const gltf = useGLTF(url);
  const envMap = useEnvironment({ preset: "city" });
  const onLoadedRef = React.useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  React.useEffect(() => {
    if (!gltf?.scene || !envMap) return undefined;
    let frames = 0;
    let raf = 0;
    const tick = () => {
      frames += 1;
      if (frames >= 2) {
        onLoadedRef.current?.({
          bytes: estimateGltfBytes(gltf),
          polygons: countPolygons(gltf.scene),
        });
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gltf, envMap]);

  return (
    <>
      <Environment map={envMap} />
      <Center top>
        <primitive object={gltf.scene} />
      </Center>
    </>
  );
};

const ModelViewer = ({ 
  modelUrl, 
  onModelLoaded,
  transformControls = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  },
  shadowsEnabled = true,
  gridVisible = true,
  autoRotate = false,
}) => {
  const pos = transformControls?.position || { x: 0, y: 0, z: 0 };
  const rot = transformControls?.rotation || { x: 0, y: 0, z: 0 };
  const scl = transformControls?.scale !== undefined ? transformControls.scale : 1;

  const rotX = (rot.y * Math.PI) / 180;
  const rotY = (rot.x * Math.PI) / 180;
  const rotZ = (rot.z * Math.PI) / 180;

  return (
    <Canvas
      shadows={shadowsEnabled}
      camera={{ position: [0, 2, 6], fov: 50 }} 
      style={{ width: "100%", height: "100%", background: "#F8F9FA" }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.8} />
      <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={1} />

    {gridVisible && (
      <Grid
        position={[0, -0.01, 0]} 
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={1}
        cellColor="#bcbcbc" 
        sectionSize={2}
        sectionThickness={1.5}
        sectionColor="#9a9a9a"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid
      />
    )}

    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
    <circleGeometry args={[1.7, 64]} /> 
    <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={0.6}
        roughness={1}
        depthScale={1}
        color="#0a0a0a" 
        metalness={0.2}
        transparent
        opacity={0.95}
    />
    </mesh>

      {shadowsEnabled && (
        <ContactShadows 
          position={[0, 0, 0]} 
          opacity={0.5} 
          scale={6} 
          blur={2} 
          far={1} 
        />
      )}

      <Suspense fallback={null}>
        <group
          position={[pos.x, pos.y, pos.z]}
          rotation={[rotX, rotY, rotZ]}
          scale={[scl, scl, scl]}
        >
          <Model url={modelUrl} onLoaded={onModelLoaded} />
        </group>
      </Suspense>

      <OrbitControls
        enableDamping
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={autoRotate}
      />
    </Canvas>
  );
};

export default ModelViewer;