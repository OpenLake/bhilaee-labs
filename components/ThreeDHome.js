'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
    PointerLockControls, 
    Sky, 
    KeyboardControls, 
    Environment, 
    ContactShadows,
    Text,
    Float,
    MeshReflectorMaterial,
    Html
} from '@react-three/drei';
import * as THREE from 'three';
import Player from './3d/Player';
import LabBuilding from './3d/LabBuilding';
import HomeContent from './HomeContent';

export default function ThreeDHome({ labs, allExperiments }) {
    const [classicMode, setClassicMode] = useState(false);

    if (classicMode) {
        return (
            <div style={{ position: 'relative' }}>
                <button 
                    onClick={() => setClassicMode(false)}
                    style={{ 
                        position: 'fixed', 
                        bottom: '20px', 
                        right: '20px', 
                        padding: '12px 24px', 
                        borderRadius: '30px', 
                        background: '#0070f3', 
                        color: '#fff', 
                        border: 'none', 
                        cursor: 'pointer', 
                        zIndex: 1000,
                        boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                        fontWeight: 'bold'
                    }}>
                    ✨ Switch to 3D Mode
                </button>
                <HomeContent labs={labs} allExperiments={allExperiments} />
            </div>
        );
    }

    return (
        <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "a", "A"] },
                { name: "right", keys: ["ArrowRight", "d", "D"] },
                { name: "jump", keys: ["Space"] },
            ]}>
            <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, background: '#000', zIndex: 1000 }}>
                <Canvas shadows camera={{ fov: 45, position: [0, 5, 20] }}>
                    <Suspense fallback={<Html center><div style={{ color: 'white', whiteSpace: 'nowrap' }}>Loading 3D Plaza...</div></Html>}>
                        <Sky sunPosition={[100, 20, 100]} />
                        <Environment preset="city" />
                        <ambientLight intensity={1.5} />
                        <pointLight position={[10, 10, 10]} intensity={5} castShadow />
                        <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={5} castShadow />
                        
                        <Player />
                        
                        {/* Floor */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
                            <planeGeometry args={[200, 200]} />
                            <MeshReflectorMaterial
                                blur={[100, 100]}
                                resolution={512}
                                mixBlur={1}
                                mixStrength={40}
                                roughness={1}
                                depthScale={1.2}
                                minDepthThreshold={0.4}
                                maxDepthThreshold={1.4}
                                color="#151515"
                                metalness={0.5}
                            />
                        </mesh>

                        <LabBuilding labs={labs} />
                        
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <Text
                                position={[0, 8, -5]}
                                fontSize={2.5}
                                color="#ffffff"
                                anchorX="center"
                                anchorY="middle"
                            >
                                BHILAI EE LABS
                            </Text>
                        </Float>

                        <ContactShadows position={[0, -0.49, 0]} opacity={0.6} scale={25} blur={2.5} far={5} />
                    </Suspense>
                    <PointerLockControls />
                </Canvas>

                {/* Overlay UI */}
                <div style={{ position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)', color: '#fff', textAlign: 'center', pointerEvents: 'none', textShadow: '0 2px 10px rgba(0,0,0,1)' }}>
                    <p style={{ opacity: 0.9, fontSize: '1rem', marginBottom: '8px' }}>Click screen to move view</p>
                    <p style={{ fontWeight: 'bold', letterSpacing: '2px', fontSize: '1.2rem' }}>W / A / S / D to Walk</p>
                </div>
                
                <div style={{ position: 'absolute', top: '30px', left: '30px', display: 'flex', gap: '15px' }}>
                     <button 
                        onClick={() => window.location.href = '/preferences'}
                        style={{ padding: '10px 20px', borderRadius: '25px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(15px)', fontWeight: '600' }}>
                        Settings
                    </button>
                    <button 
                        onClick={() => window.location.href = '/observations'}
                        style={{ padding: '10px 20px', borderRadius: '25px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(15px)', fontWeight: '600' }}>
                        Records
                    </button>
                </div>

                <div style={{ position: 'absolute', bottom: '40px', right: '40px' }}>
                    <button 
                        onClick={() => setClassicMode(true)}
                        style={{ 
                            padding: '12px 24px', 
                            borderRadius: '30px', 
                            background: 'rgba(0,0,0,0.5)', 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            color: '#fff', 
                            cursor: 'pointer', 
                            backdropFilter: 'blur(20px)',
                            fontWeight: 'bold'
                        }}>
                        📁 Switch to Classic View
                    </button>
                </div>
            </div>
        </KeyboardControls>
    );
}
