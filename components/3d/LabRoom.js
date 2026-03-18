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
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.8]}>
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

            {/* 3. FURNITURE & EQUIPMENT (3 benches per wall + center island) */}

            {/* FRONT WALL BENCHES (Z = -10.5) */}
            {[-6, 0, 6].map((x, i) => (
                <group key={`front-group-${i}`}>
                    <LabBench position={[x, 0, -D / 2 + 0.65]} rotation={[0, 0, 0]} tex={benchTex}>
                        <DcVoltageSource position={[-1.2, SURF, 0]} />
                        <LabOscilloscope position={[-0.65, SURF, 0]} />
                        <FuncGen position={[0.0, SURF, 0]} />
                        <SolderStation position={[0.55, SURF, 0.05]} />
                        <LabMultimeter position={[0.85, SURF, 0.1]} />

                        <TrainerKit position={[-0.4, SURF, -0.28]} />

                        <ProBreadboard position={[-0.5, SURF, 0.35]} />
                        <ProBreadboard position={[0.1, SURF, 0.35]} />
                        <LabJumperRibbon position={[-0.15, SURF, 0.4]} />
                        <LabConnectingLoops position={[0.65, SURF, 0.35]} />

                        <RandomWirePile position={[1.15, SURF, 0.2]} />
                    </LabBench>
                    <ComponentBox position={[x + 1.9, 0, -D / 2 + 0.65]} />
                </group>
            ))}

            {/* LEFT WALL BENCHES (X = -9.5) */}
            {[-6, 0, 6].map((z, i) => (
                <group key={`left-group-${i}`}>
                    <LabBench position={[-W / 2 + 0.65, 0, z]} rotation={[0, Math.PI / 2, 0]} tex={benchTex}>
                        <DcVoltageSource position={[-1.2, SURF, 0]} />
                        <LabOscilloscope position={[-0.65, SURF, 0]} />
                        <FuncGen position={[0.0, SURF, 0]} />
                        <SolderStation position={[0.55, SURF, 0.05]} />
                        <LabMultimeter position={[0.85, SURF, 0.1]} />

                        <TrainerKit position={[-0.4, SURF, -0.28]} />

                        <ProBreadboard position={[-0.5, SURF, 0.35]} />
                        <ProBreadboard position={[0.1, SURF, 0.35]} />
                        <LabJumperRibbon position={[-0.15, SURF, 0.4]} />
                        <LabConnectingLoops position={[0.65, SURF, 0.35]} />

                        <RandomWirePile position={[1.15, SURF, 0.2]} />
                    </LabBench>
                    <ComponentBox position={[-W / 2 + 0.65, 0, z + 1.9]} rotation={[0, Math.PI / 2, 0]} />
                </group>
            ))}

            {/* RIGHT WALL BENCHES (X = 9.5) */}
            {[-6, 0, 6].map((z, i) => (
                <group key={`right-group-${i}`}>
                    <LabBench position={[W / 2 - 0.65, 0, z]} rotation={[0, -Math.PI / 2, 0]} tex={benchTex}>
                        <DcVoltageSource position={[-1.2, SURF, 0]} />
                        <LabOscilloscope position={[-0.65, SURF, 0]} />
                        <FuncGen position={[0.0, SURF, 0]} />
                        <SolderStation position={[0.55, SURF, 0.05]} />
                        <LabMultimeter position={[0.85, SURF, 0.1]} />

                        <TrainerKit position={[-0.4, SURF, -0.28]} />

                        <ProBreadboard position={[-0.5, SURF, 0.35]} />
                        <ProBreadboard position={[0.1, SURF, 0.35]} />
                        <LabJumperRibbon position={[-0.15, SURF, 0.4]} />
                        <LabConnectingLoops position={[0.65, SURF, 0.35]} />

                        <RandomWirePile position={[1.15, SURF, 0.2]} />
                    </LabBench>
                    <ComponentBox position={[W / 2 - 0.65, 0, z - 1.9]} rotation={[0, -Math.PI / 2, 0]} />
                </group>
            ))}

            {/* CENTER ISLAND BENCH */}
            <LabBench position={[0, 0, 0]} rotation={[0, 0, 0]} tex={benchTex}>
                <DcVoltageSource position={[-1.2, SURF, 0]} />
                <LabOscilloscope position={[-0.65, SURF, 0]} />
                <FuncGen position={[0.0, SURF, 0]} />
                <SolderStation position={[0.55, SURF, 0.05]} />
                <LabMultimeter position={[0.85, SURF, 0.1]} />

                <TrainerKit position={[-0.4, SURF, -0.28]} />

                <ProBreadboard position={[-0.5, SURF, 0.35]} />
                <ProBreadboard position={[0.1, SURF, 0.35]} />
                <LabJumperRibbon position={[-0.15, SURF, 0.4]} />
                <LabConnectingLoops position={[0.65, SURF, 0.35]} />

                <RandomWirePile position={[1.15, SURF, 0.2]} />
            </LabBench>
            <ComponentBox position={[1.9, 0, 0]} />

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
    const BW = 3.0, BD = 1.2, BHH = 0.94;
    return (
        <group position={position} rotation={rotation}>
            {/* main body */}
            <mesh position={[0, BHH / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[BW, BHH, BD]} />
                <meshStandardMaterial color="#e8e8ec" />
            </mesh>
            {/* top surface */}
            <mesh position={[0, BHH + 0.022, 0]} castShadow receiveShadow>
                <boxGeometry args={[BW + 0.05, 0.045, BD + 0.07]} />
                <meshLambertMaterial map={tex} />
            </mesh>
            {/* front edge strip (dark accent) */}
            <mesh position={[0, BHH + 0.01, BD / 2 + 0.025]}>
                <boxGeometry args={[BW + 0.05, 0.035, 0.02]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* power strip on back */}
            <mesh position={[0, BHH - 0.1, -BD / 2 + 0.04]}>
                <boxGeometry args={[BW * 0.8, 0.06, 0.04]} />
                <meshStandardMaterial color="#eee" />
            </mesh>
            {/* power sockets (6 sockets) */}
            {[-0.8, -0.48, -0.16, 0.16, 0.48, 0.8].map((x, i) => (
                <mesh key={i} position={[x, BHH - 0.1, -BD / 2 + 0.062]}>
                    <boxGeometry args={[0.06, 0.035, 0.005]} />
                    <meshBasicMaterial color="#333" />
                </mesh>
            ))}
            {children}
        </group>
    );
}

function Oscilloscope({ position, rotation }) {
    return (
        <group position={position} rotation={rotation}>
            <mesh position={[0, 0.13, 0]} castShadow>
                <boxGeometry args={[0.34, 0.26, 0.28]} />
                <meshStandardMaterial color="#222428" />
            </mesh>
            <mesh position={[-0.04, 0.16, 0.142]}>
                <planeGeometry args={[0.2, 0.15]} />
                <meshBasicMaterial color="#001a08" />
            </mesh>
            <mesh position={[-0.04, 0.185, 0.143]}>
                <planeGeometry args={[0.18, 0.008]} />
                <meshBasicMaterial color="#00ff88" toneMapped={false} />
            </mesh>
            <mesh position={[-0.04, 0.125, 0.143]}>
                <planeGeometry args={[0.18, 0.008]} />
                <meshBasicMaterial color="#00ffff" toneMapped={false} />
            </mesh>
            {[...Array(5)].map((_, i) => (
                <mesh key={i} position={[0.06 + i * 0.022, 0.09, 0.142]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.016, 0.016, 0.02, 8]} />
                    <meshStandardMaterial color="#444850" />
                </mesh>
            ))}
            {[-1, 1].map((x, i) => (
                <mesh key={i} position={[-0.12 + i * 0.06, 0.06, 0.142]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
                    <meshStandardMaterial color="#8899aa" />
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
            <mesh position={[0, 0.035, 0]}><boxGeometry args={[0.03, 0.07, 0.03]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[0, 0.006, 0]}><boxGeometry args={[0.14, 0.012, 0.12]} /><meshStandardMaterial color="#222" /></mesh>
            <group position={[0, 0.009, 0.16]}>
                <mesh><boxGeometry args={[0.34, 0.018, 0.12]} /><meshStandardMaterial color="#1e2228" /></mesh>
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
            <mesh position={[-0.02, 0.015, -0.01]}><boxGeometry args={[0.06, 0.015, 0.025]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[-0.06, 0.018, 0.02]}><cylinderGeometry args={[0.008, 0.008, 0.018, 8]} /><meshBasicMaterial color="#ff2200" /></mesh>
            {/* Jumper Wires */}
            {[0.02, 0.05, 0.08].map((x, i) => (
                <mesh key={i} position={[x, 0.016, 0.03 - i * 0.02]}>
                    <boxGeometry args={[0.06, 0.005, 0.005]} />
                    <meshBasicMaterial color={['#ff0000', '#00ff00', '#0044ff'][i]} />
                </mesh>
            ))}
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
            <mesh position={[0, 0.1, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.028, 0.028, 0.015, 16]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* Probe Leads */}
            <mesh position={[-0.035, 0.04, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                <meshStandardMaterial color="#cc0000" />
            </mesh>
            <mesh position={[0.025, 0.04, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                <meshStandardMaterial color="#111" />
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
            {/* Displays (V and A) */}
            <mesh position={[-0.06, 0.16, 0.162]}><planeGeometry args={[0.08, 0.05]} /><meshBasicMaterial color="#001122" /></mesh>
            <Text position={[-0.06, 0.16, 0.163]} fontSize={0.018} color="#00ff44">5.0V</Text>
            <mesh position={[0.06, 0.16, 0.162]}><planeGeometry args={[0.08, 0.05]} /><meshBasicMaterial color="#001122" /></mesh>
            <Text position={[0.06, 0.16, 0.163]} fontSize={0.018} color="#ff4400">0.5A</Text>
            {/* Knobs */}
            {[-0.06, 0.06].map((x, i) => (
                <mesh key={i} position={[x, 0.08, 0.162]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.018, 0.018, 0.02, 12]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            ))}
            {/* Banana Terminals */}
            {[-0.08, -0.03, 0.03, 0.08].map((x, i) => (
                <mesh key={i} position={[x, 0.04, 0.162]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.008, 0.008, 0.02, 8]} />
                    <meshStandardMaterial color={i < 2 ? '#cc0000' : '#111'} />
                </mesh>
            ))}
        </group>
    );
}

function SolderStation({ position }) {
    // Highly detailed Quick 936A Soldering Station (Base unit + Iron Stand + Iron)
    return (
        <group position={position} rotation={[0, -0.1, 0]}>
            {/* --- 1. Control Unit (Left) --- */}
            <group position={[-0.07, 0, 0]}>
                {/* Main Box Back/Bottom */}
                <mesh position={[0, 0.04, -0.02]} castShadow>
                    <boxGeometry args={[0.13, 0.08, 0.10]} />
                    <meshStandardMaterial color="#222" roughness={0.7} />
                </mesh>
                {/* Slanted Front Panel Box */}
                <mesh position={[0, 0.038, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
                    <boxGeometry args={[0.13, 0.08, 0.03]} />
                    <meshStandardMaterial color="#222" roughness={0.7} />
                </mesh>

                {/* Front Panel Details (on the slanted face) */}
                <group position={[0, 0.04, 0.066]} rotation={[-0.2, 0, 0]}>
                    <mesh position={[0, 0, 0]}><planeGeometry args={[0.12, 0.07]} /><meshBasicMaterial color="#1a1a1a" /></mesh>
                    {/* Dial */}
                    <mesh position={[0.015, -0.005, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    <mesh position={[0.015, 0.005, 0.01]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[0.004, 0.018, 0.005]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                    {/* Dial Scale Markings */}
                    <mesh position={[0.015, -0.005, 0.001]}>
                        <ringGeometry args={[0.018, 0.02, 16, 1, 0, Math.PI * 1.5]} />
                        <meshBasicMaterial color="#fff" />
                    </mesh>
                    {/* Port (DIN connector) */}
                    <mesh position={[-0.03, -0.015, 0.002]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.01, 0.01, 0.004, 16]} />
                        <meshStandardMaterial color="#080808" />
                    </mesh>
                    {/* LED */}
                    <mesh position={[-0.03, 0.008, 0.001]}>
                        <circleGeometry args={[0.002, 8]} />
                        <meshBasicMaterial color="#dd1111" />
                    </mesh>
                    {/* Yellow Sticker */}
                    <mesh position={[-0.03, 0.025, 0.001]}>
                        <planeGeometry args={[0.022, 0.012]} />
                        <meshBasicMaterial color="#ddcc22" />
                    </mesh>
                    {/* Text Labelling */}
                    <Text position={[0.02, 0.025, 0.001]} fontSize={0.006} color="#aaa" anchorX="center" renderOrder={100}>
                        QUICK 936A
                        <meshBasicMaterial color="#aaa" depthTest={false} />
                    </Text>
                </group>
            </group>

            {/* --- 2. Iron Stand (Right) --- */}
            <group position={[0.06, 0, 0.02]}>
                {/* Metal Base Tray */}
                <mesh position={[0, 0.008, 0]} castShadow>
                    <boxGeometry args={[0.07, 0.016, 0.16]} />
                    <meshStandardMaterial color="#333" metalness={0.6} />
                </mesh>
                {/* Front silver lip */}
                <mesh position={[0, 0.016, 0.078]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[0.07, 0.005, 0.005]} />
                    <meshStandardMaterial color="#aaa" metalness={0.9} />
                </mesh>
                {/* Yellow Sponge */}
                <mesh position={[0, 0.016, 0.045]}>
                    <boxGeometry args={[0.05, 0.004, 0.055]} />
                    <meshStandardMaterial color="#ddaa33" roughness={0.9} />
                </mesh>
                {/* Metal Funnel/Shroud Support Frame */}
                <mesh position={[0, 0.04, -0.06]} rotation={[0.4, 0, 0]}>
                    <boxGeometry args={[0.07, 0.08, 0.01]} />
                    <meshStandardMaterial color="#2a2a2a" metalness={0.5} />
                </mesh>
                <mesh position={[0, 0.04, -0.06]} rotation={[0.4, 0, 0]}>
                    <boxGeometry args={[0.05, 0.06, 0.012]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                {/* Metal Shroud / Spring */}
                <group position={[0, 0.04, -0.04]} rotation={[0.6, 0, 0]}>
                    <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.015, 0.015, 0.03, 12]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    {[...Array(6)].map((_, i) => (
                        <mesh key={i} position={[0, -0.01 + i * 0.006, 0]} rotation={[Math.PI / 2 + 0.1, 0, 0]}>
                            <torusGeometry args={[0.014, 0.0015, 4, 16]} />
                            <meshStandardMaterial color="#111" />
                        </mesh>
                    ))}
                </group>

                {/* --- 3. Soldering Iron (Resting in stand funnel) --- */}
                <group position={[0, 0.04, -0.04]} rotation={[-Math.PI / 2 + 0.6, 0, 0]}>
                    {/* Handle (Black Rubber) */}
                    <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.008, 0.006, 0.09, 12]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                    </mesh>
                    {/* Handle Grip Ridge */}
                    <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.008, 0.002, 8, 16]} />
                        <meshStandardMaterial color="#111" roughness={0.9} />
                    </mesh>
                    {/* Securing Nut (Silver) */}
                    <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.007, 0.007, 0.02, 8]} />
                        <meshStandardMaterial color="#ccc" metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.0075, 0.0075, 0.005, 8]} />
                        <meshStandardMaterial color="#ccc" metalness={0.8} />
                    </mesh>
                    {/* Silver Shaft */}
                    <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.003, 0.003, 0.04, 8]} />
                        <meshStandardMaterial color="#aaa" metalness={0.9} />
                    </mesh>
                    {/* Fine Tip */}
                    <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.0005, 0.003, 0.02, 8]} />
                        <meshStandardMaterial color="#fff" metalness={1.0} />
                    </mesh>
                    {/* Power Cord coming out back of handle */}
                    <mesh position={[0, -0.04, -0.1]} rotation={[-0.2, 0, 0]}>
                        <cylinderGeometry args={[0.0025, 0.0025, 0.08, 6]} />
                        <meshStandardMaterial color="#151515" roughness={0.5} />
                    </mesh>
                </group>
            </group>
        </group>
    );
}

function FunctionGenerator({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.06, 0]} castShadow>
                <boxGeometry args={[0.28, 0.14, 0.24]} />
                <meshStandardMaterial color="#2a2e38" />
            </mesh>
            <mesh position={[-0.04, 0.1, 0.122]}><planeGeometry args={[0.14, 0.08]} /><meshBasicMaterial color="#ff8800" /></mesh>
            <Text position={[-0.04, 0.1, 0.123]} fontSize={0.014} color="#000">1kHz SIN</Text>
            {/* Frequency Knob */}
            <mesh position={[0.08, 0.08, 0.122]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.02, 12]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* BNC Output */}
            <mesh position={[0.08, 0.03, 0.122]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                <meshStandardMaterial color="#888" metalness={0.9} />
            </mesh>
        </group>
    );
}

// === NEW EE-SPECIFIC EQUIPMENT ===

function TrainerKit({ position }) {
    // EE Trainer Kit - panel with banana jacks, LEDs, switches, and resistors
    return (
        <group position={position}>
            {/* Main Panel (Upright) */}
            <mesh position={[0, 0.18, 0]} castShadow>
                <boxGeometry args={[0.5, 0.36, 0.06]} />
                <meshStandardMaterial color="#e0ddd5" />
            </mesh>
            {/* Panel Label */}
            <Text position={[0, 0.33, 0.032]} fontSize={0.022} color="#222" fontWeight="bold" anchorX="center" renderOrder={100}>
                EE TRAINER KIT
                <meshBasicMaterial color="#222" depthTest={false} />
            </Text>
            {/* Banana Jacks (2 rows of 5) */}
            {[0.28, 0.2].map((y, row) => (
                <group key={row}>
                    {[-0.16, -0.08, 0, 0.08, 0.16].map((x, i) => (
                        <mesh key={i} position={[x, y, 0.032]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.008, 0.008, 0.015, 8]} />
                            <meshStandardMaterial color={row === 0 ? '#cc0000' : '#111'} />
                        </mesh>
                    ))}
                </group>
            ))}
            {/* LED Indicators (row of 4) */}
            {[-0.12, -0.04, 0.04, 0.12].map((x, i) => (
                <mesh key={i} position={[x, 0.12, 0.032]}>
                    <sphereGeometry args={[0.008, 8, 8]} />
                    <meshBasicMaterial color={['#ff0000', '#00ff00', '#ffaa00', '#ff0000'][i]} toneMapped={false} />
                </mesh>
            ))}
            {/* DIP Switches (row of 4) */}
            {[-0.1, -0.04, 0.02, 0.08].map((x, i) => (
                <mesh key={i} position={[x, 0.06, 0.032]}>
                    <boxGeometry args={[0.02, 0.03, 0.01]} />
                    <meshStandardMaterial color="#224488" />
                </mesh>
            ))}
            {/* Resistor Bank (bottom) */}
            {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
                <mesh key={i} position={[x, 0.03, 0.032]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.006, 0.006, 0.035, 6]} />
                    <meshStandardMaterial color={['#a52a2a', '#ff8c00', '#228b22', '#4169e1'][i]} />
                </mesh>
            ))}
        </group>
    );
}

function Transformer({ position }) {
    // Single-phase transformer with iron core and copper coils
    return (
        <group position={position}>
            {/* Iron E-Core (dark grey laminated steel look) */}
            <mesh position={[0, 0.08, 0]} castShadow>
                <boxGeometry args={[0.22, 0.16, 0.16]} />
                <meshStandardMaterial color="#3a3a40" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Lamination Lines */}
            {[-0.06, -0.02, 0.02, 0.06].map((y, i) => (
                <mesh key={i} position={[0, 0.08 + y, 0.081]}>
                    <boxGeometry args={[0.22, 0.005, 0.005]} />
                    <meshBasicMaterial color="#222" />
                </mesh>
            ))}
            {/* Primary Coil (Left - Copper Wire) */}
            <mesh position={[-0.06, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.055, 0.025, 8, 16]} />
                <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Secondary Coil (Right - Copper Wire) */}
            <mesh position={[0.06, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.055, 0.02, 8, 16]} />
                <meshStandardMaterial color="#cd7f32" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Terminal Block */}
            <mesh position={[0, 0.17, 0]}>
                <boxGeometry args={[0.18, 0.02, 0.06]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            {/* Terminals */}
            {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
                <mesh key={i} position={[x, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.006, 0.006, 0.02, 6]} />
                    <meshStandardMaterial color={i < 2 ? '#cc0000' : '#111'} />
                </mesh>
            ))}
            {/* Label */}
            <Text position={[0, 0.02, 0.082]} fontSize={0.014} color="#aaa" anchorX="center" renderOrder={100}>
                1-PH XFMR
                <meshBasicMaterial color="#aaa" depthTest={false} />
            </Text>
        </group>
    );
}

function Motor({ position }) {
    // Small DC/AC Motor with cylindrical body and output shaft
    return (
        <group position={position}>
            {/* Motor Body (Cylindrical) */}
            <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.07, 0.07, 0.18, 16]} />
                <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* End Plates */}
            {[-0.095, 0.095].map((x, i) => (
                <mesh key={i} position={[x, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.072, 0.072, 0.01, 16]} />
                    <meshStandardMaterial color="#333" metalness={0.8} />
                </mesh>
            ))}
            {/* Output Shaft */}
            <mesh position={[0.13, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
                <meshStandardMaterial color="#888" metalness={0.9} />
            </mesh>
            {/* Mounting Base */}
            <mesh position={[0, 0.008, 0]}>
                <boxGeometry args={[0.2, 0.016, 0.12]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Terminal Box (on top) */}
            <mesh position={[0, 0.14, 0]}>
                <boxGeometry args={[0.06, 0.03, 0.04]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Label */}
            <Text position={[0, 0.07, 0.072]} fontSize={0.012} color="#ccc" anchorX="center" renderOrder={100}>
                DC MOTOR
                <meshBasicMaterial color="#ccc" depthTest={false} />
            </Text>
        </group>
    );
}

function Rheostat({ position }) {
    // Variable resistor / rheostat with coiled wire
    return (
        <group position={position}>
            {/* Ceramic cylinder base */}
            <mesh position={[0, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.035, 0.035, 0.18, 12]} />
                <meshStandardMaterial color="#d4c8a8" roughness={0.8} />
            </mesh>
            {/* Resistance wire coil (wound around) */}
            <mesh position={[0, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.035, 0.004, 6, 32]} />
                <meshStandardMaterial color="#777" metalness={0.9} />
            </mesh>
            {/* Slider arm */}
            <mesh position={[0.02, 0.08, 0]}>
                <boxGeometry args={[0.12, 0.008, 0.015]} />
                <meshStandardMaterial color="#888" metalness={0.9} />
            </mesh>
            {/* Contact point */}
            <mesh position={[0.02, 0.072, 0]}>
                <sphereGeometry args={[0.006, 6, 6]} />
                <meshStandardMaterial color="#b87333" metalness={0.8} />
            </mesh>
            {/* Terminal screws */}
            {[-0.08, 0, 0.08].map((x, i) => (
                <mesh key={i} position={[x, 0.005, 0.04]}>
                    <cylinderGeometry args={[0.006, 0.006, 0.012, 6]} />
                    <meshStandardMaterial color="#888" metalness={0.9} />
                </mesh>
            ))}
            {/* Mounting base */}
            <mesh position={[0, 0.003, 0]}>
                <boxGeometry args={[0.2, 0.006, 0.1]} />
                <meshStandardMaterial color="#444" />
            </mesh>
        </group>
    );
}

function DcVoltageSource({ position }) {
    // Portrait DC Voltage Source — dual channel, enlarged 1.4x
    const bw = 0.25, bh = 0.39, bd = 0.19;
    return (
        <group position={position}>
            {/* Main Body (Portrait) */}
            <mesh position={[0, bh / 2, 0]} castShadow>
                <boxGeometry args={[bw, bh, bd]} />
                <meshStandardMaterial color="#e8e4dc" />
            </mesh>

            {/* Front Panel */}
            <mesh position={[0, bh / 2, bd / 2 + 0.001]}>
                <planeGeometry args={[bw - 0.01, bh - 0.01]} />
                <meshStandardMaterial color="#f0ece4" />
            </mesh>

            {/* Display (dark screen at top) */}
            <mesh position={[0, bh - 0.065, bd / 2 + 0.002]}>
                <planeGeometry args={[bw - 0.04, 0.06]} />
                <meshBasicMaterial color="#001a11" />
            </mesh>
            <Text position={[0, bh - 0.06, bd / 2 + 0.003]} fontSize={0.024} color="#00ff44" anchorX="center">
                5.00 V
            </Text>

            {/* Label */}
            <Text position={[0, bh - 0.015, bd / 2 + 0.003]} fontSize={0.013} color="#444" anchorX="center" renderOrder={100}>
                DC POWER SUPPLY
                <meshBasicMaterial color="#444" depthTest={false} />
            </Text>

            {/* 3 rows x 2 cols of banana jack ports */}
            {[{ label: '+V', color: '#cc0000', y: 0.22 },
            { label: 'COM', color: '#222', y: 0.155 },
            { label: '-V', color: '#2244cc', y: 0.09 }].map((row, ri) => (
                <group key={ri}>
                    <Text position={[-bw / 2 + 0.025, row.y, bd / 2 + 0.003]} fontSize={0.012} color={row.color}
                        anchorX="center" renderOrder={100}>
                        {row.label}
                        <meshBasicMaterial color={row.color} depthTest={false} />
                    </Text>
                    {[0, 1].map(col => (
                        <group key={col} position={[0.015 + col * 0.075, row.y, bd / 2 + 0.001]}>
                            <mesh rotation={[Math.PI / 2, 0, 0]}>
                                <cylinderGeometry args={[0.016, 0.016, 0.01, 12]} />
                                <meshStandardMaterial color={row.color} metalness={0.7} />
                            </mesh>
                            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.001]}>
                                <cylinderGeometry args={[0.008, 0.008, 0.012, 8]} />
                                <meshStandardMaterial color="#111" />
                            </mesh>
                        </group>
                    ))}
                </group>
            ))}

            {/* Channel Labels */}
            <Text position={[0.015, bh - 0.11, bd / 2 + 0.003]} fontSize={0.009} color="#666" anchorX="center" renderOrder={100}>
                CH1
                <meshBasicMaterial color="#666" depthTest={false} />
            </Text>
            <Text position={[0.09, bh - 0.11, bd / 2 + 0.003]} fontSize={0.009} color="#666" anchorX="center" renderOrder={100}>
                CH2
                <meshBasicMaterial color="#666" depthTest={false} />
            </Text>

            {/* Top ventilation slots */}
            {[-0.06, 0, 0.06].map((x, i) => (
                <mesh key={i} position={[x, bh + 0.001, 0]}>
                    <boxGeometry args={[0.03, 0.002, bd * 0.6]} />
                    <meshStandardMaterial color="#bbb" />
                </mesh>
            ))}
        </group>
    );
}

function FuncGen({ position }) {
    // Tektronix AFG1022-style Arbitrary Function Generator (enlarged)
    const fw = 0.55, fh = 0.22, fd = 0.35;
    const tilt = -0.15;
    return (
        <group position={position}>
            {/* Tilted Stand (two triangle supports) */}
            {[-0.16, 0.16].map((x, i) => (
                <group key={i}>
                    <mesh position={[x, 0.02, -fd / 2 + 0.03]} rotation={[0.3, 0, 0]}>
                        <boxGeometry args={[0.025, 0.04, 0.06]} />
                        <meshStandardMaterial color="#444" />
                    </mesh>
                </group>
            ))}
            {/* Front Foot */}
            <mesh position={[0, 0.005, fd / 2 - 0.04]}>
                <boxGeometry args={[fw * 0.7, 0.01, 0.03]} />
                <meshStandardMaterial color="#555" />
            </mesh>

            {/* Main Body (tilted backward) */}
            <group position={[0, fh / 2 + 0.03, 0]} rotation={[tilt, 0, 0]}>
                {/* Chassis */}
                <mesh castShadow>
                    <boxGeometry args={[fw, fh, fd * 0.15]} />
                    <meshStandardMaterial color="#d8dce4" />
                </mesh>

                {/* Top Bezel (Blue accent strip — Tektronix style) */}
                <mesh position={[0, fh / 2 - 0.008, fd * 0.075 + 0.001]}>
                    <boxGeometry args={[fw, 0.016, 0.005]} />
                    <meshStandardMaterial color="#1a5faa" />
                </mesh>

                {/* Brand Label */}
                <Text position={[-fw / 2 + 0.06, fh / 2 - 0.008, fd * 0.075 + 0.004]} fontSize={0.011} color="#fff" anchorX="center" renderOrder={100}>
                    Tektronix
                    <meshBasicMaterial color="#fff" depthTest={false} />
                </Text>

                {/* === LEFT SECTION: WAVEFORM DISPLAY === */}
                {/* Screen Bezel */}
                <mesh position={[-fw / 2 + 0.12, 0.005, fd * 0.075 + 0.002]}>
                    <planeGeometry args={[0.19, 0.13]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                {/* Screen */}
                <mesh position={[-fw / 2 + 0.12, 0.005, fd * 0.075 + 0.003]}>
                    <planeGeometry args={[0.17, 0.11]} />
                    <meshBasicMaterial color="#0a1a2e" />
                </mesh>
                {/* Grid Lines (Waveform BG) */}
                {[...Array(5)].map((_, gi) => (
                    <mesh key={`hg${gi}`} position={[-fw / 2 + 0.12, -0.035 + gi * 0.02, fd * 0.075 + 0.0035]}>
                        <planeGeometry args={[0.16, 0.001]} />
                        <meshBasicMaterial color="#1a3050" transparent opacity={0.5} />
                    </mesh>
                ))}
                {[...Array(7)].map((_, gi) => (
                    <mesh key={`vg${gi}`} position={[-fw / 2 + 0.04 + gi * 0.027, 0.005, fd * 0.075 + 0.0035]}>
                        <planeGeometry args={[0.001, 0.1]} />
                        <meshBasicMaterial color="#1a3050" transparent opacity={0.5} />
                    </mesh>
                ))}
                {/* Sine Wave (green line segments) */}
                {[...Array(16)].map((_, si) => {
                    const sx = -fw / 2 + 0.04 + si * 0.0106;
                    const sy = 0.005 + Math.sin(si * 0.42) * 0.035;
                    return (
                        <mesh key={`sw${si}`} position={[sx, sy, fd * 0.075 + 0.004]}>
                            <planeGeometry args={[0.012, 0.004]} />
                            <meshBasicMaterial color="#00ff66" toneMapped={false} />
                        </mesh>
                    );
                })}
                {/* Frequency Readout (top of screen) */}
                <Text position={[-fw / 2 + 0.12, 0.055, fd * 0.075 + 0.004]} fontSize={0.009} color="#88ccff" anchorX="center">
                    {'1.000 000 000 kHz'}
                </Text>
                {/* Amplitude Readout */}
                <Text position={[-fw / 2 + 0.12, -0.045, fd * 0.075 + 0.004]} fontSize={0.008} color="#ffcc44" anchorX="center">
                    {'Vpp: 2.000 V'}
                </Text>

                {/* === RIGHT SECTION: CONTROLS === */}

                {/* Large Rotary Knob (top-right) */}
                <mesh position={[fw / 2 - 0.06, 0.035, fd * 0.075 + 0.006]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.028, 0.028, 0.015, 20]} />
                    <meshStandardMaterial color="#ccc" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Knob indicator */}
                <mesh position={[fw / 2 - 0.06, 0.055, fd * 0.075 + 0.008]}>
                    <boxGeometry args={[0.003, 0.015, 0.003]} />
                    <meshBasicMaterial color="#fff" />
                </mesh>

                {/* Waveform Select Buttons (Sine, Square, Ramp, Pulse, Arb) */}
                {['SIN', 'SQR', 'RMP', 'PLS', 'ARB'].map((label, bi) => (
                    <group key={bi} position={[fw / 2 - 0.17 + bi * 0.028, 0.035, fd * 0.075 + 0.003]}>
                        <mesh>
                            <boxGeometry args={[0.022, 0.018, 0.006]} />
                            <meshStandardMaterial color={bi === 0 ? '#2266aa' : '#777'} />
                        </mesh>
                        <Text position={[0, 0, 0.004]} fontSize={0.005} color="#fff" anchorX="center" renderOrder={100}>
                            {label}
                            <meshBasicMaterial color="#fff" depthTest={false} />
                        </Text>
                    </group>
                ))}

                {/* Number Pad / Function Buttons (3x3 grid) */}
                {[...Array(9)].map((_, bi) => {
                    const bx = fw / 2 - 0.15 + (bi % 3) * 0.028;
                    const by = -0.005 - Math.floor(bi / 3) * 0.024;
                    return (
                        <mesh key={bi} position={[bx, by, fd * 0.075 + 0.003]}>
                            <boxGeometry args={[0.022, 0.018, 0.005]} />
                            <meshStandardMaterial color="#888" />
                        </mesh>
                    );
                })}

                {/* CH1 / CH2 Labels */}
                <Text position={[fw / 2 - 0.14, -0.07, fd * 0.075 + 0.004]} fontSize={0.008} color="#ffcc00" anchorX="center" renderOrder={100}>
                    CH1
                    <meshBasicMaterial color="#ffcc00" depthTest={false} />
                </Text>
                <Text position={[fw / 2 - 0.06, -0.07, fd * 0.075 + 0.004]} fontSize={0.008} color="#ff6644" anchorX="center" renderOrder={100}>
                    CH2
                    <meshBasicMaterial color="#ff6644" depthTest={false} />
                </Text>

                {/* BNC Output Connectors (bottom of front face) */}
                {[fw / 2 - 0.14, fw / 2 - 0.06].map((bx, bi) => (
                    <group key={bi} position={[bx, -0.08, fd * 0.075 + 0.001]}>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.012, 0.012, 0.015, 12]} />
                            <meshStandardMaterial color="#999" metalness={0.9} />
                        </mesh>
                        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.002]}>
                            <cylinderGeometry args={[0.005, 0.005, 0.018, 8]} />
                            <meshStandardMaterial color="#b87333" metalness={0.9} />
                        </mesh>
                    </group>
                ))}

                {/* USB Port (small rectangle) */}
                <mesh position={[0, -0.08, fd * 0.075 + 0.003]}>
                    <boxGeometry args={[0.016, 0.008, 0.005]} />
                    <meshStandardMaterial color="#222" />
                </mesh>

                {/* Bottom Bezel */}
                <mesh position={[0, -fh / 2 + 0.006, fd * 0.075 + 0.001]}>
                    <boxGeometry args={[fw, 0.012, 0.005]} />
                    <meshStandardMaterial color="#bbb" />
                </mesh>
            </group>
        </group>
    );
}

function LabOscilloscope({ position }) {
    // Siglent SDS1104X-E style 4-channel Digital Oscilloscope
    // Same footprint as FuncGen for visual consistency
    const ow = 0.55, oh = 0.22, od = 0.35;
    const tilt = -0.15;
    return (
        <group position={position}>
            {/* Tilted Stand */}
            {[-0.18, 0.18].map((x, i) => (
                <mesh key={i} position={[x, 0.02, -od / 2 + 0.03]} rotation={[0.3, 0, 0]}>
                    <boxGeometry args={[0.025, 0.04, 0.06]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
            ))}
            <mesh position={[0, 0.005, od / 2 - 0.04]}>
                <boxGeometry args={[ow * 0.7, 0.01, 0.03]} />
                <meshStandardMaterial color="#555" />
            </mesh>

            {/* Main Body (tilted) */}
            <group position={[0, oh / 2 + 0.03, 0]} rotation={[tilt, 0, 0]}>
                {/* Chassis (light grey) */}
                <mesh castShadow>
                    <boxGeometry args={[ow, oh, od * 0.18]} />
                    <meshStandardMaterial color="#e0ddd6" />
                </mesh>

                {/* Top Bezel (dark strip with brand) */}
                <mesh position={[0, oh / 2 - 0.008, od * 0.09 + 0.001]}>
                    <boxGeometry args={[ow, 0.016, 0.005]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <Text position={[-ow / 2 + 0.06, oh / 2 - 0.008, od * 0.09 + 0.004]} fontSize={0.011} color="#1a8fdd" anchorX="center" renderOrder={100}>
                    SIGLENT
                    <meshBasicMaterial color="#1a8fdd" depthTest={false} />
                </Text>
                <Text position={[-ow / 2 + 0.15, oh / 2 - 0.008, od * 0.09 + 0.004]} fontSize={0.007} color="#999" anchorX="center" renderOrder={100}>
                    SDS 1104X-E
                    <meshBasicMaterial color="#999" depthTest={false} />
                </Text>

                {/* === LEFT: LARGE DISPLAY === */}
                <mesh position={[-ow / 2 + 0.14, -0.005, od * 0.09 + 0.002]}>
                    <planeGeometry args={[0.22, 0.16]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <mesh position={[-ow / 2 + 0.14, -0.005, od * 0.09 + 0.003]}>
                    <planeGeometry args={[0.20, 0.14]} />
                    <meshBasicMaterial color="#0a0e18" />
                </mesh>
                {/* Horizontal grid */}
                {[...Array(6)].map((_, gi) => (
                    <mesh key={`oh${gi}`} position={[-ow / 2 + 0.14, -0.06 + gi * 0.024, od * 0.09 + 0.0035]}>
                        <planeGeometry args={[0.19, 0.0008]} />
                        <meshBasicMaterial color="#1a2a3a" transparent opacity={0.6} />
                    </mesh>
                ))}
                {/* Vertical grid */}
                {[...Array(8)].map((_, gi) => (
                    <mesh key={`ov${gi}`} position={[-ow / 2 + 0.05 + gi * 0.025, -0.005, od * 0.09 + 0.0035]}>
                        <planeGeometry args={[0.0008, 0.13]} />
                        <meshBasicMaterial color="#1a2a3a" transparent opacity={0.6} />
                    </mesh>
                ))}
                {/* Yellow sine wave (CH1) */}
                {[...Array(20)].map((_, si) => {
                    const sx = -ow / 2 + 0.045 + si * 0.0095;
                    const sy = -0.005 + Math.sin(si * 0.35) * 0.04;
                    return (
                        <mesh key={`ch1${si}`} position={[sx, sy, od * 0.09 + 0.004]}>
                            <planeGeometry args={[0.01, 0.004]} />
                            <meshBasicMaterial color="#ffdd00" toneMapped={false} />
                        </mesh>
                    );
                })}
                {/* Green cosine wave (CH2) */}
                {[...Array(20)].map((_, si) => {
                    const sx = -ow / 2 + 0.045 + si * 0.0095;
                    const sy = -0.005 + Math.cos(si * 0.35) * 0.025;
                    return (
                        <mesh key={`ch2${si}`} position={[sx, sy, od * 0.09 + 0.004]}>
                            <planeGeometry args={[0.01, 0.003]} />
                            <meshBasicMaterial color="#00ff88" toneMapped={false} />
                        </mesh>
                    );
                })}
                {/* Screen readouts */}
                <Text position={[-ow / 2 + 0.08, 0.06, od * 0.09 + 0.004]} fontSize={0.007} color="#ffdd00" anchorX="center">
                    {'CH1 20.0mV'}
                </Text>
                <Text position={[-ow / 2 + 0.18, 0.06, od * 0.09 + 0.004]} fontSize={0.007} color="#00ff88" anchorX="center">
                    {'CH2 10.0mV'}
                </Text>
                <Text position={[-ow / 2 + 0.14, -0.068, od * 0.09 + 0.004]} fontSize={0.006} color="#aaa" anchorX="center">
                    {'M 20.0ms  Delay 0.00s'}
                </Text>

                {/* === RIGHT: CONTROL PANEL === */}
                <Text position={[ow / 2 - 0.14, oh / 2 - 0.025, od * 0.09 + 0.004]} fontSize={0.006} color="#666" anchorX="center" renderOrder={100}>
                    Vertical
                    <meshBasicMaterial color="#666" depthTest={false} />
                </Text>
                <Text position={[ow / 2 - 0.06, oh / 2 - 0.025, od * 0.09 + 0.004]} fontSize={0.006} color="#666" anchorX="center" renderOrder={100}>
                    Horizontal
                    <meshBasicMaterial color="#666" depthTest={false} />
                </Text>

                {/* Channel Buttons (1, 2, 3, 4) */}
                {[{ label: '1', color: '#ddaa00' }, { label: '2', color: '#00aa44' },
                { label: '3', color: '#3366cc' }, { label: '4', color: '#cc3333' }].map((ch, ci) => (
                    <group key={ci} position={[ow / 2 - 0.19 + ci * 0.028, 0.04, od * 0.09 + 0.004]}>
                        <mesh>
                            <boxGeometry args={[0.02, 0.016, 0.006]} />
                            <meshStandardMaterial color={ch.color} />
                        </mesh>
                        <Text position={[0, 0, 0.004]} fontSize={0.008} color="#fff" anchorX="center" renderOrder={100}>
                            {ch.label}
                            <meshBasicMaterial color="#fff" depthTest={false} />
                        </Text>
                    </group>
                ))}

                {/* Top row buttons */}
                {['Curs', 'Meas', 'Acq', 'Save', 'Util'].map((label, bi) => (
                    <group key={bi} position={[ow / 2 - 0.19 + bi * 0.028, 0.065, od * 0.09 + 0.003]}>
                        <mesh>
                            <boxGeometry args={[0.022, 0.014, 0.005]} />
                            <meshStandardMaterial color="#777" />
                        </mesh>
                        <Text position={[0, 0, 0.004]} fontSize={0.004} color="#eee" anchorX="center" renderOrder={100}>
                            {label}
                            <meshBasicMaterial color="#eee" depthTest={false} />
                        </Text>
                    </group>
                ))}

                {/* Vertical Rotary Knobs */}
                {[0, 1].map(ki => (
                    <mesh key={`vk${ki}`} position={[ow / 2 - 0.16 + ki * 0.06, 0.01, od * 0.09 + 0.007]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.018, 0.018, 0.012, 16]} />
                        <meshStandardMaterial color="#ddd" metalness={0.7} roughness={0.25} />
                    </mesh>
                ))}

                {/* Horizontal / Trigger Knobs */}
                {[0, 1].map(ki => (
                    <mesh key={`hk${ki}`} position={[ow / 2 - 0.06 + ki * 0.05, 0.01, od * 0.09 + 0.007]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.018, 0.018, 0.012, 16]} />
                        <meshStandardMaterial color="#ddd" metalness={0.7} roughness={0.25} />
                    </mesh>
                ))}

                {/* Run/Stop Button (Green) */}
                <group position={[ow / 2 - 0.04, 0.065, od * 0.09 + 0.003]}>
                    <mesh>
                        <boxGeometry args={[0.028, 0.016, 0.006]} />
                        <meshStandardMaterial color="#22aa44" />
                    </mesh>
                    <Text position={[0, 0, 0.004]} fontSize={0.005} color="#fff" anchorX="center" renderOrder={100}>
                        {'Run/Stop'}
                        <meshBasicMaterial color="#fff" depthTest={false} />
                    </Text>
                </group>

                {/* Auto Setup Button (Orange) */}
                <group position={[ow / 2 - 0.04, 0.04, od * 0.09 + 0.003]}>
                    <mesh>
                        <boxGeometry args={[0.028, 0.016, 0.006]} />
                        <meshStandardMaterial color="#ee8822" />
                    </mesh>
                    <Text position={[0, 0, 0.004]} fontSize={0.005} color="#fff" anchorX="center" renderOrder={100}>
                        Auto
                        <meshBasicMaterial color="#fff" depthTest={false} />
                    </Text>
                </group>

                {/* Math / Ref / Search */}
                {['Math', 'Ref', 'Search'].map((label, bi) => (
                    <group key={bi} position={[ow / 2 - 0.16 + bi * 0.035, -0.03, od * 0.09 + 0.003]}>
                        <mesh>
                            <boxGeometry args={[0.028, 0.014, 0.005]} />
                            <meshStandardMaterial color="#666" />
                        </mesh>
                        <Text position={[0, 0, 0.004]} fontSize={0.004} color="#ddd" anchorX="center" renderOrder={100}>
                            {label}
                            <meshBasicMaterial color="#ddd" depthTest={false} />
                        </Text>
                    </group>
                ))}

                {/* 4 BNC Input Connectors (bottom) */}
                {[...Array(4)].map((_, ci) => (
                    <group key={ci} position={[ow / 2 - 0.19 + ci * 0.04, -0.095, od * 0.09 + 0.001]}>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.012, 0.012, 0.015, 12]} />
                            <meshStandardMaterial color="#999" metalness={0.9} />
                        </mesh>
                        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.002]}>
                            <cylinderGeometry args={[0.005, 0.005, 0.018, 8]} />
                            <meshStandardMaterial color="#b87333" metalness={0.9} />
                        </mesh>
                        <Text position={[0, 0.016, od * 0.09 - 0.024]} fontSize={0.006}
                            color={['#ddaa00', '#00aa44', '#3366cc', '#cc3333'][ci]} anchorX="center" renderOrder={100}>
                            {`${ci + 1}`}
                            <meshBasicMaterial color={['#ddaa00', '#00aa44', '#3366cc', '#cc3333'][ci]} depthTest={false} />
                        </Text>
                    </group>
                ))}

                {/* Power Button (green) */}
                <mesh position={[-ow / 2 + 0.02, -0.095, od * 0.09 + 0.003]}>
                    <boxGeometry args={[0.016, 0.016, 0.006]} />
                    <meshStandardMaterial color="#88cc00" emissive="#88cc00" emissiveIntensity={0.3} />
                </mesh>

                {/* Bottom Bezel */}
                <mesh position={[0, -oh / 2 + 0.006, od * 0.09 + 0.001]}>
                    <boxGeometry args={[ow, 0.012, 0.005]} />
                    <meshStandardMaterial color="#bbb" />
                </mesh>
            </group>
        </group>
    );
}

function ProBreadboard({ position }) {
    // Realistic solderless breadboard on a black metal backing plate
    const bw = 0.45, bd = 0.16, bh = 0.02;
    return (
        <group position={position}>
            {/* Black Metal Backing Plate */}
            <mesh position={[0, 0.0025, 0]} castShadow>
                <boxGeometry args={[bw + 0.04, 0.005, bd + 0.04]} />
                <meshStandardMaterial color="#222" metalness={0.6} roughness={0.6} />
            </mesh>

            {/* Main White Board */}
            <mesh position={[0, bh / 2 + 0.005, 0]} castShadow>
                <boxGeometry args={[bw, bh, bd]} />
                <meshStandardMaterial color="#e0ddcc" />
            </mesh>

            {/* Center Channel (gap) */}
            <mesh position={[0, bh + 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[bw - 0.02, 0.012]} />
                <meshStandardMaterial color="#b0b0a8" />
            </mesh>

            {/* Red Power Rail (top) */}
            <mesh position={[0, bh + 0.006, -bd / 2 + 0.015]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[bw - 0.02, 0.004]} />
                <meshBasicMaterial color="#dd2222" />
            </mesh>
            {/* Blue Power Rail (bottom) */}
            <mesh position={[0, bh + 0.006, bd / 2 - 0.015]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[bw - 0.02, 0.004]} />
                <meshBasicMaterial color="#2255dd" />
            </mesh>

            {/* Central IC Chip plugged in to make scale obvious */}
            <group position={[0, bh + 0.012, 0]}>
                <mesh>
                    <boxGeometry args={[0.08, 0.012, 0.025]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
                </mesh>
                {/* IC Pins */}
                {[...Array(6)].map((_, pi) => (
                    <group key={pi}>
                        <mesh position={[-0.03 + pi * 0.012, -0.002, -0.015]}>
                            <boxGeometry args={[0.003, 0.006, 0.008]} />
                            <meshStandardMaterial color="#aaa" metalness={0.9} />
                        </mesh>
                        <mesh position={[-0.03 + pi * 0.012, -0.002, 0.015]}>
                            <boxGeometry args={[0.003, 0.006, 0.008]} />
                            <meshStandardMaterial color="#aaa" metalness={0.9} />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* Label */}
            <Text position={[-bw / 2 + 0.04, bh + 0.006, bd / 2 - 0.03]} fontSize={0.01} color="#888"
                rotation={[-Math.PI / 2, 0, 0]} anchorX="center" renderOrder={100}>
                MB-102
                <meshBasicMaterial color="#888" depthTest={false} />
            </Text>
        </group>
    );
}

function LabJumperRibbon({ position }) {
    // 10-wire DuPont Ribbon Cable (flat ribbon of parallel wires with black header blocks)
    const colors = ['#8b4513', '#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#800080', '#808080', '#ffffff', '#000000'];
    const wireLen = 0.25;
    return (
        <group position={position} rotation={[0, 0.4, 0]}>
            {/* Parallel wires sticking together forming a ribbon */}
            {colors.map((color, i) => (
                <mesh key={i} position={[0, 0.002, -0.02 + i * 0.0045]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.002, 0.002, wireLen, 8]} />
                    <meshStandardMaterial color={color} roughness={0.6} />
                </mesh>
            ))}

            {/* Black Connector Block Left */}
            <mesh position={[-wireLen / 2 - 0.01, 0.003, 0]}>
                <boxGeometry args={[0.02, 0.006, 0.045]} />
                <meshStandardMaterial color="#111" roughness={0.6} />
            </mesh>

            {/* Black Connector Block Right */}
            <mesh position={[wireLen / 2 + 0.01, 0.003, 0]}>
                <boxGeometry args={[0.02, 0.006, 0.045]} />
                <meshStandardMaterial color="#111" roughness={0.6} />
            </mesh>

            {/* Metal pins sticking out slightly */}
            {colors.map((_, i) => (
                <group key={`pin-${i}`}>
                    <mesh position={[-wireLen / 2 - 0.025, 0.003, -0.02 + i * 0.0045]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.001, 0.001, 0.01, 4]} />
                        <meshStandardMaterial color="#ccc" metalness={0.9} />
                    </mesh>
                    <mesh position={[wireLen / 2 + 0.025, 0.003, -0.02 + i * 0.0045]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.001, 0.001, 0.01, 4]} />
                        <meshStandardMaterial color="#ccc" metalness={0.9} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

function LabConnectingLoops({ position }) {
    // Solid neatly bundled banana plug cables (one Red, one Black) lying flat
    return (
        <group position={position} rotation={[0, -0.2, 0]}>
            {/* Red Cable Bundle */}
            <group position={[-0.05, 0.005, 0]}>
                {/* Rolled oval bundle */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.04, 0.004, 8, 24]} />
                    <meshStandardMaterial color="#cc2222" roughness={0.5} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.8, 1]}>
                    <torusGeometry args={[0.035, 0.004, 8, 24]} />
                    <meshStandardMaterial color="#cc2222" roughness={0.5} />
                </mesh>

                {/* Straight end 1 to plug */}
                <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.04, 8]} />
                    <meshStandardMaterial color="#cc2222" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.006, 0.004, 0.03, 12]} />
                    <meshStandardMaterial color="#cc2222" roughness={0.3} />
                </mesh>

                {/* Straight end 2 to plug */}
                <mesh position={[-0.04, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.04, 8]} />
                    <meshStandardMaterial color="#cc2222" roughness={0.5} />
                </mesh>
                <mesh position={[-0.07, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.006, 0.004, 0.03, 12]} />
                    <meshStandardMaterial color="#cc2222" roughness={0.3} />
                </mesh>
            </group>

            {/* Black Cable Bundle */}
            <group position={[0.05, 0.005, 0.02]} rotation={[0, 0.5, 0]}>
                {/* Rolled oval bundle */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.04, 0.004, 8, 24]} />
                    <meshStandardMaterial color="#222" roughness={0.5} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.8, 1]}>
                    <torusGeometry args={[0.035, 0.004, 8, 24]} />
                    <meshStandardMaterial color="#222" roughness={0.5} />
                </mesh>

                {/* Straight end 1 to plug */}
                <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.04, 8]} />
                    <meshStandardMaterial color="#222" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.006, 0.004, 0.03, 12]} />
                    <meshStandardMaterial color="#222" roughness={0.3} />
                </mesh>

                {/* Straight end 2 to plug */}
                <mesh position={[-0.04, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.04, 8]} />
                    <meshStandardMaterial color="#222" roughness={0.5} />
                </mesh>
                <mesh position={[-0.07, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.006, 0.004, 0.03, 12]} />
                    <meshStandardMaterial color="#222" roughness={0.3} />
                </mesh>
            </group>
        </group>
    );
}

function LabMultimeter({ position }) {
    // Fluke-style handheld digital multimeter (portrait, yellow body)
    const mw = 0.14, mh = 0.24, md = 0.06;
    return (
        <group position={position} rotation={[0, 0.2, 0]}>
            {/* Body */}
            <mesh position={[0, mh / 2, 0]} castShadow>
                <boxGeometry args={[mw, mh, md]} />
                <meshStandardMaterial color="#ddcc22" />
            </mesh>

            {/* Dark Face Panel */}
            <mesh position={[0, mh / 2 + 0.01, md / 2 + 0.001]}>
                <planeGeometry args={[mw - 0.02, mh - 0.03]} />
                <meshStandardMaterial color="#2a2a2a" />
            </mesh>

            {/* LCD Display */}
            <mesh position={[0, mh - 0.055, md / 2 + 0.002]}>
                <planeGeometry args={[mw - 0.04, 0.04]} />
                <meshBasicMaterial color="#b8c8a0" />
            </mesh>
            <Text position={[0, mh - 0.05, md / 2 + 0.003]} fontSize={0.02} color="#222" anchorX="center">
                1.234
            </Text>

            {/* Rotary Selector Dial */}
            <mesh position={[0, mh / 2 - 0.01, md / 2 + 0.004]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.008, 16]} />
                <meshStandardMaterial color="#444" />
            </mesh>
            {/* Dial pointer */}
            <mesh position={[0.015, mh / 2 + 0.005, md / 2 + 0.006]}>
                <boxGeometry args={[0.018, 0.003, 0.003]} />
                <meshBasicMaterial color="#fff" />
            </mesh>

            {/* Dial markings: V, A, Ω */}
            {[{ t: 'V~', a: -0.7 }, { t: 'V=', a: -0.3 }, { t: 'Ω', a: 0.3 }, { t: 'A', a: 0.7 }].map((m, i) => (
                <Text key={i} position={[Math.sin(m.a) * 0.04, mh / 2 - 0.01 + Math.cos(m.a) * 0.04, md / 2 + 0.005]}
                    fontSize={0.007} color="#ccc" anchorX="center" renderOrder={100}>
                    {m.t}
                    <meshBasicMaterial color="#ccc" depthTest={false} />
                </Text>
            ))}

            {/* Brand Label */}
            <Text position={[0, mh - 0.02, md / 2 + 0.003]} fontSize={0.008} color="#fff" anchorX="center" renderOrder={100}>
                FLUKE
                <meshBasicMaterial color="#fff" depthTest={false} />
            </Text>

            {/* Probe Jack Ports (bottom, red + black) */}
            {[{ color: '#cc2222', x: -0.025 }, { color: '#222', x: 0.025 }].map((p, pi) => (
                <group key={pi} position={[p.x, 0.025, md / 2 + 0.001]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.008, 0.008, 0.008, 10]} />
                        <meshStandardMaterial color={p.color} metalness={0.7} />
                    </mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.001]}>
                        <cylinderGeometry args={[0.004, 0.004, 0.01, 6]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                </group>
            ))}
        </group>

    );
}
function RandomWirePile({ position }) {
    // A genuinely jumbled pile of thick, solid electrical wires (red, black, green, yellow, blue)
    const wireColors = ['#cc2222', '#151515', '#22aa33', '#ddaa00', '#2244cc'];
    return (
        <group position={position}>
            {/* Base shadow layer */}
            <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.25, 0.25]} />
                <meshBasicMaterial color="#000" transparent opacity={0.15} />
            </mesh>

            {/* A mess of overlapping semicircles and straight sections to simulate a wire pile */}
            {[...Array(25)].map((_, i) => {
                const color = wireColors[i % wireColors.length];
                // Scatter them randomly in a 0.20x0.20 m area
                const x = (Math.random() - 0.5) * 0.20;
                const z = (Math.random() - 0.5) * 0.20;
                // Layer them upward strictly, starting at 0.003 so they never dip below 0
                const y = 0.004 + (i * 0.002) + (Math.random() * 0.002);

                // Keep them mostly flat to the table (X and Z rotation near PI/2 or 0 depending on the shape)
                // Y rotation random to point anywhere
                const rotY = Math.random() * Math.PI * 2;

                // Mostly flat in X and Z, max tilt of ~5 degrees
                const tiltX = (Math.random() - 0.5) * 0.1;
                const tiltZ = (Math.random() - 0.5) * 0.1;

                // Mix of arcs (coiled sections) and straight fragments
                if (Math.random() > 0.3) {
                    return (
                        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2 + tiltX, rotY, tiltZ]}>
                            {/* Torus arc: radius (5-10cm), tube_radius, radialSegments, tubularSegments, arc */}
                            <torusGeometry args={[0.05 + Math.random() * 0.06, 0.0025, 8, 32, Math.PI * 1.5]} />
                            <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
                        </mesh>
                    );
                } else {
                    return (
                        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2 + tiltX, tiltZ, rotY]}>
                            {/* Straight wire segment (15-30cm) */}
                            <cylinderGeometry args={[0.0025, 0.0025, 0.15 + Math.random() * 0.15, 8]} />
                            <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
                        </mesh>
                    );
                }
            })}
        </group>
    );
}

function ComponentBox({ position, rotation }) {
    // Floor-standing component storage cabinet with transparent drawers
    // 3 columns: Resistors | Capacitors | Inductors   5 rows of drawers
    const boxW = 0.75, boxH = 0.88, boxD = 0.38;
    const drawerH = 0.11;
    const numDrawers = 5;
    const colW = boxW / 3;
    return (
        <group position={position} rotation={rotation}>
            {/* Outer Cabinet Frame (Dark Metal) */}
            <mesh position={[0, boxH / 2, 0]} castShadow>
                <boxGeometry args={[boxW, boxH, boxD]} />
                <meshStandardMaterial color="#2a2d32" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Two Vertical Partitions (creating 3 columns) */}
            {[-colW / 2, colW / 2].map((x, i) => (
                <mesh key={i} position={[x, boxH / 2, 0]}>
                    <boxGeometry args={[0.008, boxH - 0.02, boxD - 0.02]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
            ))}

            {/* Top Labels (on top face) */}
            <Text position={[-colW, boxH + 0.012, 0]} fontSize={0.025} color="#ff4444" anchorX="center"
                rotation={[-Math.PI / 2, 0, 0]} renderOrder={100}>
                RESISTORS
                <meshBasicMaterial color="#ff4444" depthTest={false} />
            </Text>
            <Text position={[0, boxH + 0.012, 0]} fontSize={0.022} color="#2288ff" anchorX="center"
                rotation={[-Math.PI / 2, 0, 0]} renderOrder={100}>
                CAPACITORS
                <meshBasicMaterial color="#2288ff" depthTest={false} />
            </Text>
            <Text position={[colW, boxH + 0.012, 0]} fontSize={0.022} color="#22cc66" anchorX="center"
                rotation={[-Math.PI / 2, 0, 0]} renderOrder={100}>
                INDUCTORS
                <meshBasicMaterial color="#22cc66" depthTest={false} />
            </Text>

            {/* Front Face Column Labels */}
            <Text position={[-colW, boxH / 2, boxD / 2 + 0.005]} fontSize={0.04} color="#ff6644" anchorX="center" renderOrder={100}>
                R
                <meshBasicMaterial color="#ff6644" depthTest={false} />
            </Text>
            <Text position={[0, boxH / 2, boxD / 2 + 0.005]} fontSize={0.04} color="#4488ff" anchorX="center" renderOrder={100}>
                C
                <meshBasicMaterial color="#4488ff" depthTest={false} />
            </Text>
            <Text position={[colW, boxH / 2, boxD / 2 + 0.005]} fontSize={0.04} color="#22cc66" anchorX="center" renderOrder={100}>
                L
                <meshBasicMaterial color="#22cc66" depthTest={false} />
            </Text>

            {/* 5 Rows of Drawers × 3 Columns */}
            {[...Array(numDrawers)].map((_, row) => {
                const drawerY = 0.07 + row * (drawerH + 0.06);
                return (
                    <group key={row}>
                        {/* === LEFT COLUMN: Resistors === */}
                        <group position={[-colW, drawerY, 0]}>
                            <mesh>
                                <boxGeometry args={[colW - 0.015, drawerH, boxD - 0.03]} />
                                <meshPhysicalMaterial color="#e8e8ec" transparent opacity={0.35} roughness={0.2} />
                            </mesh>
                            <mesh position={[0, 0, boxD / 2 - 0.005]}>
                                <boxGeometry args={[0.07, 0.012, 0.01]} />
                                <meshStandardMaterial color="#888" metalness={0.9} />
                            </mesh>
                            {/* Resistors (color-banded) */}
                            {[...Array(4)].map((_, r) => (
                                <group key={r} position={[-0.06 + r * 0.04, -0.01, -0.03 + (r % 2) * 0.06]}>
                                    <mesh rotation={[0, 0, Math.PI / 2]}>
                                        <cylinderGeometry args={[0.006, 0.006, 0.035, 6]} />
                                        <meshStandardMaterial color="#d2b48c" />
                                    </mesh>
                                    {[-0.01, 0, 0.01].map((bx, bi) => (
                                        <mesh key={bi} position={[bx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                            <cylinderGeometry args={[0.0065, 0.0065, 0.004, 6]} />
                                            <meshBasicMaterial color={[
                                                ['#a52a2a', '#000', '#ff8c00'],
                                                ['#ff8c00', '#4169e1', '#a52a2a'],
                                                ['#228b22', '#a52a2a', '#ff0'],
                                                ['#4169e1', '#888', '#ff8c00']
                                            ][r][bi]} />
                                        </mesh>
                                    ))}
                                    <mesh position={[-0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                        <cylinderGeometry args={[0.001, 0.001, 0.015, 4]} />
                                        <meshStandardMaterial color="#999" metalness={0.9} />
                                    </mesh>
                                    <mesh position={[0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                        <cylinderGeometry args={[0.001, 0.001, 0.015, 4]} />
                                        <meshStandardMaterial color="#999" metalness={0.9} />
                                    </mesh>
                                </group>
                            ))}
                        </group>

                        {/* === CENTER COLUMN: Capacitors === */}
                        <group position={[0, drawerY, 0]}>
                            <mesh>
                                <boxGeometry args={[colW - 0.015, drawerH, boxD - 0.03]} />
                                <meshPhysicalMaterial color="#e0e8f0" transparent opacity={0.35} roughness={0.2} />
                            </mesh>
                            <mesh position={[0, 0, boxD / 2 - 0.005]}>
                                <boxGeometry args={[0.07, 0.012, 0.01]} />
                                <meshStandardMaterial color="#888" metalness={0.9} />
                            </mesh>
                            {/* Disc Ceramic Capacitors */}
                            {[...Array(3)].map((_, c) => (
                                <group key={c} position={[-0.04 + c * 0.035, -0.01, 0.04]}>
                                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                                        <cylinderGeometry args={[0.01, 0.01, 0.005, 8]} />
                                        <meshStandardMaterial color={['#cc8800', '#2266aa', '#cc8800'][c]} />
                                    </mesh>
                                    {[-0.005, 0.005].map((lx, li) => (
                                        <mesh key={li} position={[lx, -0.015, 0]}>
                                            <cylinderGeometry args={[0.001, 0.001, 0.022, 4]} />
                                            <meshStandardMaterial color="#999" metalness={0.9} />
                                        </mesh>
                                    ))}
                                </group>
                            ))}
                            {/* Electrolytic Capacitors */}
                            {[0, 1].map(c => (
                                <group key={`e${c}`} position={[-0.025 + c * 0.045, 0.005, -0.04]}>
                                    <mesh>
                                        <cylinderGeometry args={[0.012, 0.012, 0.035, 8]} />
                                        <meshStandardMaterial color="#222" />
                                    </mesh>
                                    <mesh position={[0, 0.018, 0]}>
                                        <cylinderGeometry args={[0.012, 0.012, 0.002, 8]} />
                                        <meshStandardMaterial color="#aaa" metalness={0.8} />
                                    </mesh>
                                </group>
                            ))}
                        </group>

                        {/* === RIGHT COLUMN: Inductors === */}
                        <group position={[colW, drawerY, 0]}>
                            <mesh>
                                <boxGeometry args={[colW - 0.015, drawerH, boxD - 0.03]} />
                                <meshPhysicalMaterial color="#e4f0e8" transparent opacity={0.35} roughness={0.2} />
                            </mesh>
                            <mesh position={[0, 0, boxD / 2 - 0.005]}>
                                <boxGeometry args={[0.07, 0.012, 0.01]} />
                                <meshStandardMaterial color="#888" metalness={0.9} />
                            </mesh>
                            {/* Toroid Inductors */}
                            {[0, 1, 2].map(l => (
                                <group key={l} position={[-0.04 + l * 0.035, -0.01, 0]}>
                                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                                        <torusGeometry args={[0.012, 0.005, 6, 12]} />
                                        <meshStandardMaterial color={['#228b22', '#2a6b2a', '#1a5a1a'][l]} />
                                    </mesh>
                                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                                        <torusGeometry args={[0.012, 0.002, 6, 12]} />
                                        <meshStandardMaterial color="#b87333" metalness={0.8} />
                                    </mesh>
                                </group>
                            ))}
                            {/* Axial Inductors */}
                            {[0, 1].map(a => (
                                <group key={`ax${a}`} position={[-0.02 + a * 0.04, -0.015, 0.06]}>
                                    <mesh rotation={[0, 0, Math.PI / 2]}>
                                        <cylinderGeometry args={[0.008, 0.008, 0.03, 6]} />
                                        <meshStandardMaterial color="#336633" />
                                    </mesh>
                                    {[-0.02, 0.02].map((lx, li) => (
                                        <mesh key={li} position={[lx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                            <cylinderGeometry args={[0.001, 0.001, 0.012, 4]} />
                                            <meshStandardMaterial color="#999" metalness={0.9} />
                                        </mesh>
                                    ))}
                                </group>
                            ))}
                        </group>

                        {/* Horizontal Shelf Divider */}
                        <mesh position={[0, drawerY + drawerH / 2 + 0.02, 0]}>
                            <boxGeometry args={[boxW - 0.01, 0.008, boxD - 0.02]} />
                            <meshStandardMaterial color="#333" />
                        </mesh>
                    </group>
                );
            })}
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
