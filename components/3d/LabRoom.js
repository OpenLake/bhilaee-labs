'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, MeshReflectorMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const W = 20;
const H = 4.2;
const D = 22;

export default function LabRoom({ lab, onExit }) {
    const { camera } = useThree();
    const groupRef = useRef();
    const [isNearExit, setIsNearExit] = useState(false);

    // Procedural Textures
    const wallTex = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 256;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#c8ccd2';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 2000; i++) {
            const v = 180 + Math.random() * 40 | 0;
            ctx.fillStyle = `rgba(${v},${v},${v + 5},0.05)`;
            ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(5, 2.5);
        return tex;
    }, []);

    const floorTex = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = 512; c.height = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#5a5e64';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = 'rgba(40,42,46,0.7)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 512; x += 128) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
        }
        for (let y = 0; y <= 512; y += 128) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
        }
        for (let i = 0; i < 3000; i++) {
            const v = 80 + Math.random() * 30 | 0;
            ctx.fillStyle = `rgba(${v},${v},${v},0.04)`;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 5);
        return tex;
    }, []);

    const benchTex = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 128;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#f0f2f4';
        ctx.fillRect(0, 0, 256, 128);
        for (let i = 0; i < 600; i++) {
            const v = 220 + Math.random() * 30 | 0;
            ctx.fillStyle = `rgba(${v},${v},${v},0.07)`;
            ctx.fillRect(Math.random() * 256, Math.random() * 128, 3, 1);
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 0.5);
        return tex;
    }, []);

    const exitDoorRef = useRef();
    const doorHinge = useRef();

    const doorSlide = useRef();

    useFrame((state, delta) => {
        if (!exitDoorRef.current) return;
        const worldPos = new THREE.Vector3();
        exitDoorRef.current.getWorldPosition(worldPos);
        const distance = worldPos.distanceTo(camera.position);
        
        const near = distance < 5.0;
        if (near !== isNearExit) setIsNearExit(near);

        // Industrial Sliding logic (Sliding horizontally to the left)
        const targetX = isNearExit ? -2.4 : 0;
        if (doorSlide.current) {
            doorSlide.current.position.x = THREE.MathUtils.lerp(doorSlide.current.position.x, targetX, delta * 2.0);
        }

        // AUTOMATIC EXIT: foolproof proximity (3.5m)
        if (distance < 3.5 && onExit) {
            onExit();
        }
    });

    const SURF = 0.94 + 0.025; // Lab bench surface height

    return (
        <group ref={groupRef}>
            {/* 1. ROOM SURFACES */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[W, D]} />
                <meshStandardMaterial map={floorTex} roughness={0.8} />
            </mesh>
            <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[W, D]} />
                <meshStandardMaterial color="#c0c0c8" />
            </mesh>

            {/* Walls */}
            <Wall wid={W} hgt={H} pos={[0, H / 2, -D / 2]} rot={[0, 0, 0]} tex={wallTex} />
            <Wall wid={W} hgt={H} pos={[0, H / 2, D / 2]} rot={[0, Math.PI, 0]} tex={wallTex} />
            <Wall wid={D} hgt={H} pos={[-W / 2, H / 2, 0]} rot={[0, Math.PI / 2, 0]} tex={wallTex} />
            <Wall wid={D} hgt={H} pos={[W / 2, H / 2, 0]} rot={[0, -Math.PI / 2, 0]} tex={wallTex} />

            {/* Industrial Conduit Pipes (Aesthetic Detail) */}
            <group position={[0, H - 0.4, 0]}>
                {/* Front-Back Pipes */}
                {[-W / 2 + 0.1, W / 2 - 0.1].map(x => (
                    <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.04, 0.04, D, 8]} />
                        <meshStandardMaterial color="#222" metalness={0.8} />
                    </mesh>
                ))}
                {/* Side-to-Side Pipes */}
                {[-D / 2 + 0.1, D / 2 - 0.1].map(z => (
                    <mesh key={z} position={[0, 0.1, z]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.03, 0.03, W, 8]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.7} />
                    </mesh>
                ))}
            </group>

            {/* EXIT DOOR (Standardized Industrial Sliding Door - Facing Room Center) */}
            <group position={[0, 0, D / 2]} rotation={[0, Math.PI, 0]} ref={exitDoorRef}>
                {/* 1. Portal Outer Frame (Recessed into wall) */}
                <mesh position={[0, 1.8, 0.02]}>
                    <boxGeometry args={[3.2, 4.0, 0.1]} />
                    <meshStandardMaterial color="#0a0a0d" metalness={0.8} />
                </mesh>

                {/* 2. SLIDING DOOR PANEL (Local Z axis points into the room) */}
                <group ref={doorSlide} position={[0, 1.8, 0.1]}>
                    {/* Main Door Slab (Lighter Brushed Steel) */}
                    <mesh castShadow>
                        <boxGeometry args={[2.4, 3.6, 0.1]} />
                        <meshPhysicalMaterial color="#888b90" metalness={0.9} roughness={0.2} />
                    </mesh>

                    {/* Industrial Grooves (Black lines - slightly in front of slab) */}
                    {[1.25, 0.45, -0.45, -1.25].map(y => (
                        <mesh key={y} position={[0, y, 0.051]}>
                            <boxGeometry args={[2.4, 0.02, 0.02]} />
                            <meshBasicMaterial color="#000" />
                        </mesh>
                    ))}

                    {/* HIGH-VISIBILITY SIGNAGE (Floating and Emissive - Red for High Contrast) */}
                    <group position={[0, 0.6, 0.12]}>
                        <Text 
                            fontSize={0.35} 
                            fontWeight="bold" 
                            color="#ff0044" 
                            anchorX="center"
                            anchorY="middle"
                            renderOrder={100}
                        >
                            GO BACK TO PLAZA
                            <meshBasicMaterial color="#ff0044" toneMapped={false} depthTest={false} />
                        </Text>
                    </group>

                    <group position={[0, -0.8, 0.12]} visible={isNearExit}>
                        <Text 
                            fontSize={0.14} 
                            color="#ff0044" 
                            renderOrder={100}
                        >
                            [ AUTOMATIC EXIT ACTIVE ]
                            <meshBasicMaterial color="#ff0044" toneMapped={false} depthTest={false} />
                        </Text>
                    </group>

                    {/* Industrial Vertical Handle (Black) */}
                    <mesh position={[1.0, -0.4, 0.1]}>
                        <boxGeometry args={[0.08, 0.8, 0.1]} />
                        <meshStandardMaterial color="#000" metalness={1} />
                    </mesh>
                </group>

                {/* 3. Proximity Interaction Zone (Visible Floor Ring) */}
                <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, 1.8]}>
                    <ringGeometry args={[1.6, 1.8, 32]} />
                    <meshBasicMaterial color="#00ffff" transparent opacity={isNearExit ? 0.4 : 0.05} />
                </mesh>

                {/* 4. Floor Spot Light for Visibility */}
                <pointLight position={[0, 3.2, 1.5]} intensity={3.0} color="#fff" distance={8} />
                <pointLight position={[0, 0.5, 1.5]} intensity={2.0} color="#00ffff" distance={5} />
            </group>

            {/* 2. LIGHTING */}
            <ambientLight intensity={1.2} />
            <directionalLight position={[2, 5, 3]} intensity={1.0} castShadow />

            {/* Ceiling Panels - Better coverage */}
            {[-7, -2.5, 2.5, 7].map(x => (
                <group key={x}>
                    <CeilLight position={[x, H - 0.05, -7]} />
                    <CeilLight position={[x, H - 0.05, 0]} />
                    <CeilLight position={[x, H - 0.05, 7]} />
                </group>
            ))}

            {/* 3. FURNITURE & EQUIPMENT (3 benches per wall) */}

            {/* FRONT WALL BENCHES (Z = -10.5) */}
            {[-6, 0, 6].map((x, i) => (
                <LabBench key={`front-bench-${i}`} position={[x, 0, -D / 2 + 0.46]} rotation={[0, 0, 0]} tex={benchTex}>
                    {i === 0 && <Oscilloscope position={[0, SURF, 0]} />}
                    {i === 1 && <WorkstationPC position={[0, SURF, 0]} />}
                    {i === 2 && <PowerSupply position={[0, SURF, 0]} />}
                    <Breadboard position={[0.4, SURF, 0.2]} />
                </LabBench>
            ))}

            {/* LEFT WALL BENCHES (X = -9.5) */}
            {[-6, 0, 6].map((z, i) => (
                <LabBench key={`left-bench-${i}`} position={[-W / 2 + 0.46, 0, z]} rotation={[0, Math.PI / 2, 0]} tex={benchTex}>
                    {i === 0 && <Multimeter position={[0, SURF, 0]} />}
                    {i === 1 && <SolderStation position={[0, SURF, 0]} />}
                    {i === 2 && <Oscilloscope position={[0, SURF, 0]} />}
                    <Breadboard position={[0, SURF, 0.3]} />
                </LabBench>
            ))}

            {/* RIGHT WALL BENCHES (X = 9.5) */}
            {[-6, 0, 6].map((z, i) => (
                <LabBench key={`right-bench-${i}`} position={[W / 2 - 0.46, 0, z]} rotation={[0, -Math.PI / 2, 0]} tex={benchTex}>
                    {i === 0 && <WorkstationPC position={[0, SURF, 0]} />}
                    {i === 1 && <LogicAnalyzer position={[0, SURF, 0]} />}
                    {i === 2 && <FunctionGenerator position={[0, SURF, 0]} />}
                    <Multimeter position={[0.4, SURF, -0.2]} />
                </LabBench>
            ))}

            {/* Atmosphere */}
            <Chalkboard position={[0, 2.1, -D / 2 + 0.03]} />

        </group>
    );
}

// --- SUB COMPONENTS ---

function Wall({ wid, hgt, pos, rot, tex }) {
    return (
        <mesh position={pos} rotation={rot} receiveShadow>
            <planeGeometry args={[wid, hgt]} />
            <meshLambertMaterial map={tex} />
        </mesh>
    );
}

function CeilLight({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[2.4, 0.06, 0.55]} />
                <meshLambertMaterial color="#dde0e4" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.2, 0.46]} />
                <meshBasicMaterial color="#f0f4ff" toneMapped={false} />
            </mesh>
            <pointLight intensity={2} distance={10} color="#f0f4ff" />
        </group>
    );
}

function LabBench({ position, rotation, tex, children }) {
    const BW = 2.2, BD = 0.85, BHH = 0.94;
    return (
        <group position={position} rotation={rotation}>
            {/* main body */}
            <mesh position={[0, BHH / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[BW, BHH, BD]} />
                <meshStandardMaterial color="#f5f5f5" />
            </mesh>
            {/* top */}
            <mesh position={[0, BHH + 0.022, 0]} castShadow receiveShadow>
                <boxGeometry args={[BW + 0.05, 0.045, BD + 0.07]} />
                <meshLambertMaterial map={tex} />
            </mesh>
            {children}
        </group>
    );
}

function Oscilloscope({ position, rotation }) {
    const darkGrey = "#444850";
    const metalM = "#8899aa";
    return (
        <group position={position} rotation={rotation}>
            <mesh position={[0, 0.13, 0]} castShadow>
                <boxGeometry args={[0.34, 0.26, 0.28]} />
                <meshStandardMaterial color="#222428" />
            </mesh>
            {/* Screen */}
            <mesh position={[-0.04, 0.16, 0.142]}>
                <planeGeometry args={[0.2, 0.15]} />
                <meshBasicMaterial color="#001a08" />
            </mesh>
            {/* Waveforms */}
            <mesh position={[-0.04, 0.185, 0.143]}>
                <planeGeometry args={[0.18, 0.008]} />
                <meshBasicMaterial color="#00ff88" toneMapped={false} />
            </mesh>
            <mesh position={[-0.04, 0.125, 0.143]}>
                <planeGeometry args={[0.18, 0.008]} />
                <meshBasicMaterial color="#00ffff" toneMapped={false} />
            </mesh>
            {/* Knobs */}
            {[...Array(5)].map((_, i) => (
                <mesh key={i} position={[0.06 + i * 0.022, 0.09, 0.142]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.016, 0.016, 0.02, 8]} />
                    <meshStandardMaterial color={darkGrey} />
                </mesh>
            ))}
            {/* BNC Ports */}
            {[-1, 1].map((x, i) => (
                <mesh key={i} position={[-0.12 + i * 0.06, 0.06, 0.142]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
                    <meshStandardMaterial color={metalM} />
                </mesh>
            ))}
        </group>
    );
}

function WorkstationPC({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.24, 0]} castShadow>
                <boxGeometry args={[0.42, 0.3, 0.035]} />
                <meshStandardMaterial color="#0a0a0d" />
            </mesh>
            <mesh position={[0, 0.24, 0.02]}>
                <planeGeometry args={[0.38, 0.26]} />
                <meshBasicMaterial color="#050a14" />
            </mesh>
            {/* Code lines */}
            <group position={[-0.1, 0.32, 0.021]}>
                {[...Array(6)].map((_, i) => (
                    <mesh key={i} position={[Math.random() * 0.05, -i * 0.03, 0]}>
                        <planeGeometry args={[0.1 + Math.random() * 0.15, 0.01]} />
                        <meshBasicMaterial color="#00ff88" toneMapped={false} />
                    </mesh>
                ))}
            </group>
            <Text position={[0, 0.1, 0.021]} fontSize={0.012} color="#00ff88" anchorX="center">
                BHILAEE SYSTEM v2.04
            </Text>
            {/* Stand */}
            <mesh position={[0, 0.035, 0]}><boxGeometry args={[0.03, 0.07, 0.03]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[0, 0.006, 0]}><boxGeometry args={[0.14, 0.012, 0.12]} /><meshStandardMaterial color="#222" /></mesh>
            {/* Keyboard */}
            <group position={[0, 0.009, 0.16]}>
                <mesh><boxGeometry args={[0.34, 0.018, 0.12]} /><meshStandardMaterial color="#1e2228" /></mesh>
                {/* Key suggestions */}
                {[...Array(3)].map((_, r) => (
                    <group key={r} position={[0, 0.01, -0.04 + r * 0.035]}>
                        {[...Array(8)].map((__, c) => (
                            <mesh key={c} position={[-0.12 + c * 0.034 + (r % 2) * 0.017, 0, 0]}>
                                <boxGeometry args={[0.025, 0.01, 0.025]} />
                                <meshStandardMaterial color="#2a2e38" />
                            </mesh>
                        ))}
                    </group>
                ))}
            </group>
        </group>
    );
}

function Breadboard({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.007, 0]} castShadow>
                <boxGeometry args={[0.28, 0.014, 0.16]} />
                <meshStandardMaterial color="#f0ebe0" />
            </mesh>
            {/* IC Chip */}
            <mesh position={[-0.02, 0.015, -0.01]}><boxGeometry args={[0.06, 0.015, 0.025]} /><meshStandardMaterial color="#222" /></mesh>
            {/* LED */}
            <mesh position={[-0.06, 0.018, 0.02]}><cylinderGeometry args={[0.008, 0.008, 0.018, 8]} /><meshBasicMaterial color="#ff2200" /></mesh>
        </group>
    );
}

function Multimeter({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.12, 0]} castShadow>
                <boxGeometry args={[0.13, 0.24, 0.065]} />
                <meshStandardMaterial color="#333840" />
            </mesh>
            <mesh position={[0, 0.19, 0.035]}><planeGeometry args={[0.09, 0.07]} /><meshBasicMaterial color="#88ff44" /></mesh>
            <Text position={[0, 0.19, 0.036]} fontSize={0.03} color="#000">12.0</Text>
            {/* Dial */}
            <mesh position={[0, 0.1, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.028, 0.028, 0.015, 16]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* Terminals */}
            <mesh position={[-0.03, 0.04, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0.02, 0.04, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>
    );
}

function PowerSupply({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.1, 0]} castShadow>
                <boxGeometry args={[0.28, 0.2, 0.32]} />
                <meshStandardMaterial color="#2a2e34" />
            </mesh>
            <mesh position={[-0.06, 0.16, 0.162]}><planeGeometry args={[0.08, 0.05]} /><meshBasicMaterial color="#001122" /></mesh>
            <mesh position={[0.06, 0.16, 0.162]}><planeGeometry args={[0.08, 0.05]} /><meshBasicMaterial color="#001122" /></mesh>
        </group>
    );
}

function SolderStation({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.2, 0.08, 0.18]} />
                <meshStandardMaterial color="#333840" />
            </mesh>
            <mesh position={[-0.02, 0.06, 0.092]}><planeGeometry args={[0.1, 0.045]} /><meshBasicMaterial color="#ff6600" /></mesh>
        </group>
    );
}

function FunctionGenerator({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.06, 0]} castShadow>
                <boxGeometry args={[0.24, 0.12, 0.22]} />
                <meshStandardMaterial color="#2a2e38" />
            </mesh>
            <mesh position={[-0.04, 0.09, 0.113]}><planeGeometry args={[0.12, 0.07]} /><meshBasicMaterial color="#ff8800" /></mesh>
        </group>
    );
}

function ComponentTray({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.015, 0]} castShadow>
                <boxGeometry args={[0.3, 0.03, 0.18]} />
                <meshStandardMaterial color="#3a3020" />
            </mesh>
        </group>
    );
}

function LogicAnalyzer({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.018, 0]} castShadow>
                <boxGeometry args={[0.2, 0.035, 0.12]} />
                <meshStandardMaterial color="#1a2030" />
            </mesh>
        </group>
    );
}

function DevBoard({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.006, 0]} castShadow>
                <boxGeometry args={[0.085, 0.012, 0.056]} />
                <meshStandardMaterial color="#228833" />
            </mesh>
        </group>
    );
}

function Chalkboard({ position }) {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[3.4, 1.9, 0.05]} />
                <meshLambertMaterial color="#2a3a2a" />
            </mesh>
            <mesh position={[0, 0, -0.015]}>
                <boxGeometry args={[3.5, 2.0, 0.03]} />
                <meshLambertMaterial color="#fafafa" />
            </mesh>
            <Text position={[0, 0.5, 0.04]} fontSize={0.15} color="#eeeeee" anchorX="center" renderOrder={100}>
                <meshBasicMaterial color="#eeeeee" toneMapped={false} depthTest={false} />
                {`OHM'S LAW: V = IR\nKIRCHHOFF'S LAWS\nMAXWELL EQUATIONS`}
            </Text>
        </group>
    );
}
