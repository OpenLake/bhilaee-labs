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
    const [isMounted, setIsMounted] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        if (!classicMode) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [classicMode]);

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
                {isMounted && (
                    <Canvas 
                        shadows={{ type: THREE.PCFShadowMap }}
                        camera={{ fov: 45, position: [0, 1.7, 5] }}
                        onCreated={({ camera }) => {
                            camera.lookAt(0, 1.7, -7.5);
                        }}
                    >
                        <Suspense fallback={<Html center><div style={{ color: 'white', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px' }}>INITIALIZING LABS...</div></Html>}>
                            <Environment preset="city" />
                            <ambientLight intensity={1.8} />
                            
                            {/* MULTI-POINT ARCHITECTURAL LIGHTING (One for each wall) */}
                            <pointLight position={[0, 4, -4]} intensity={250} distance={25} castShadow shadow-bias={-0.0001} />
                            <pointLight position={[0, 4, 4]} intensity={200} distance={25} castShadow shadow-bias={-0.0001} />
                            <pointLight position={[-4, 4, 0]} intensity={200} distance={25} castShadow shadow-bias={-0.0001} />
                            <pointLight position={[4, 4, 0]} intensity={200} distance={25} castShadow shadow-bias={-0.0001} />
                            
                            <Player />
                            
                            <LabBuilding labs={labs} onExit={() => setClassicMode(true)} />
                        </Suspense>
                        {isReady && !classicMode && <PointerLockControls />}
                    </Canvas>
                )}

                {/* Initial Overlay to capture user gesture */}
                {!isReady && (
                    <div 
                        onClick={() => setIsReady(true)}
                        style={{ 
                            position: 'absolute', 
                            inset: 0, 
                            background: 'rgba(0,0,0,0.85)', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            zIndex: 2000, 
                            cursor: 'pointer',
                            color: '#fff'
                        }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '800', letterSpacing: '4px', textAlign: 'center' }}>BHILAI EE LABS</h1>
                        <p style={{ fontSize: '1.2rem', color: '#00ffff', background: 'rgba(0,255,255,0.1)', padding: '10px 20px', borderRadius: '40px', border: '1px solid #00ffff' }}>
                            CLICK TO ENTER 3D PLAZA
                        </p>
                    </div>
                )}

                {/* Overlay UI */}
                {isReady && (
                    <div style={{ position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)', color: '#fff', textAlign: 'center', pointerEvents: 'none', textShadow: '0 2px 10px rgba(0,0,0,1)' }}>
                        <p style={{ opacity: 0.9, fontSize: '1rem', marginBottom: '8px' }}>Press ESC to release cursor</p>
                        <p style={{ fontWeight: 'bold', letterSpacing: '2px', fontSize: '1.2rem' }}>W / A / S / D to Walk</p>
                    </div>
                )}
            </div>
        </KeyboardControls>
    );
}
