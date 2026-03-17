'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function LabBuilding({ labs, onExit }) {
    const leftWallLabs = labs.slice(0, 3);
    const frontWallLabs = labs.slice(3, 6);
    const rightWallLabs = labs.slice(6, 9);

    return (
        <group>
            {/* 1. BHILAEE ROOM (Deep Dark Industrial) */}
            <RoomEnvironment />

            {/* 2. THE 4 WALLS WITH BHILAEE ARCHITECTURE */}
            <WallWithHoles position={[-7.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} labs={leftWallLabs} wallIndex={0} />
            <WallWithHoles position={[0, 0, -7.5]} rotation={[0, 0, 0]} labs={frontWallLabs} wallIndex={1} />
            <WallWithHoles position={[7.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} labs={rightWallLabs} wallIndex={2} />
            <ExitWall position={[0, 0, 7.5]} onExit={onExit} />

            {/* 3. HUMOROUS WAYFINDING KIOSK */}
            <WayfindingKiosk position={[0, 0, 1.5]} />
        </group>
    );
}

function WayfindingKiosk({ position }) {
    return (
        <group position={position}>
            {/* Pedestal Base */}
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.6, 0.1, 0.6]} />
                <meshStandardMaterial color="#1a1b20" metalness={0.8} />
            </mesh>

            {/* Pedestal Column */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[0.15, 1.2, 0.15]} />
                <meshStandardMaterial color="#0e1014" metalness={1} />
            </mesh>

            {/* Angled Screen Housing */}
            <group position={[0, 1.2, 0]} rotation={[-Math.PI / 6, 0, 0]}>
                <mesh position={[0, 0, 0.05]}>
                    <boxGeometry args={[0.8, 0.6, 0.1]} />
                    <meshStandardMaterial color="#1c1d22" metalness={0.9} />
                </mesh>

                {/* Glowing Screen */}
                <mesh position={[0, 0, 0.101]}>
                    <planeGeometry args={[0.7, 0.5]} />
                    <meshBasicMaterial color="#001a1f" />
                </mesh>

                {/* Bezel */}
                <mesh position={[0, 0, 0.11]}>
                    <boxGeometry args={[0.72, 0.52, 0.01]} />
                    <meshStandardMaterial color="#000" />
                </mesh>

                {/* Content Text - Enhanced Industrial UI */}
                <group position={[0, 0.02, 0.12]}>
                    <Text fontSize={0.045} fontWeight="bold" color="#fff" position={[0, 0.18, 0]} anchorX="center" letterSpacing={0.1}>
                        BHILAEE WAYFINDING
                    </Text>

                    {/* Divider */}
                    <mesh position={[0, 0.1, 0]}>
                        <planeGeometry args={[0.6, 0.005]} />
                        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
                    </mesh>

                    <group position={[-0.28, 0, 0]}>
                        <Text fontSize={0.032} color="#00ffff" position={[0, 0.02, 0]} anchorX="left" letterSpacing={0.05}>
                            ◀ 1ST & 2ND YR : PROCEED LEFT
                        </Text>
                        <Text fontSize={0.032} color="#00ffff" position={[0, -0.06, 0]} anchorX="left" letterSpacing={0.05}>
                            ▶ 3RD YR : RIGHT & STRAIGHT
                        </Text>

                        {/* Status Divider */}
                        <mesh position={[0.28, -0.12, 0]}>
                            <planeGeometry args={[0.55, 0.002]} />
                            <meshBasicMaterial color="#ff4444" transparent opacity={0.2} />
                        </mesh>

                        <Text fontSize={0.032} color="#ff4444" position={[0, -0.18, 0]} anchorX="left" fontWeight="bold" letterSpacing={0.05}>
                            ▼ NON-EE : NEAREST EXIT
                        </Text>
                    </group>
                </group>

                {/* Corner Bolts */}
                {[-0.36, 0.36].map(x => [0.26, -0.26].map(y => (
                    <mesh key={`${x}-${y}`} position={[x, y, 0.1]}>
                        <sphereGeometry args={[0.02, 8, 8]} />
                        <meshStandardMaterial color="#2e2f34" metalness={1} />
                    </mesh>
                )))}
            </group>
        </group>
    );
}

function RoomEnvironment() {
    return (
        <group>
            {/* Sector 7 Polished Floor (Dark with grid) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
                <planeGeometry args={[16, 16]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={80}
                    roughness={0.6}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050508"
                    metalness={0.8}
                />
            </mesh>
            <gridHelper args={[15, 12, "#111", "#080808"]} position={[0, 0.02, 0]} />

            {/* Ceiling (Deep occlusion) */}
            <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[15.2, 15.2]} />
                <meshStandardMaterial color="#020204" metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    );
}

function WallWithHoles({ position, rotation, labs, wallIndex }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Sector 7 Concrete Wall (Ultra Dark) */}
            <mesh position={[0, 2.5, 0.15]} receiveShadow>
                <boxGeometry args={[15, 5, 0.1]} />
                <meshStandardMaterial color="#0b0b0e" roughness={0.8} />
            </mesh>

            {/* Recessed Frame Trim (Top) */}
            <mesh position={[0, 4.95, 0.2]}>
                <boxGeometry args={[15, 0.1, 0.2]} />
                <meshStandardMaterial color="#1c1d22" metalness={0.7} />
            </mesh>

            {labs.map((lab, i) => (
                <Sector7DoorSystem
                    key={lab.id}
                    lab={lab}
                    position={[(i - 1) * 4.2, 0, 0]}
                    statusText={wallIndex === 0 ? "LAB ACCESS" : wallIndex === 1 ? "AUTHORIZED" : "RESTRICTED"}
                />
            ))}
        </group>
    );
}

function Sector7DoorSystem({ lab, position, statusText }) {
    const doorHinge = useRef();
    const cameraLed = useRef();
    const groupRef = useRef();
    const { camera } = useThree();
    const [isNear, setIsNear] = useState(false);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const worldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPos);
        const distance = worldPos.distanceTo(camera.position);
        const near = distance < 4.3; // Very subtle reduction for intentional feel
        if (near !== isNear) setIsNear(near);

        // Heavy Swing (pivot left)
        const targetRotation = isNear ? -Math.PI * 0.45 : 0;
        if (doorHinge.current) {
            doorHinge.current.rotation.y = THREE.MathUtils.lerp(doorHinge.current.rotation.y, targetRotation, delta * 1.5);
        }

        // Camera Blink
        if (cameraLed.current) {
            cameraLed.current.visible = Math.sin(state.clock.elapsedTime * 3) > 0.4;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* 1. RECESSED FRAME & BOLTS */}
            <group position={[0, 1.8, 0.1]}>
                {/* Dark Recess Background */}
                <mesh position={[0, 0, -0.3]}>
                    <planeGeometry args={[2.2, 3.6]} />
                    <meshStandardMaterial color="#050507" />
                </mesh>

                {/* Frame Surround */}
                <mesh receiveShadow>
                    <boxGeometry args={[2.4, 3.8, 0.2]} />
                    <meshStandardMaterial color="#050507" />
                </mesh>

                {/* Corner Bolts */}
                {[-1.05, 1.05].map(x => [1.75, -1.75].map(y => (
                    <mesh key={`${x}-${y}`} position={[x, y, 0.12]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        <meshStandardMaterial color="#2e2f34" metalness={0.9} />
                    </mesh>
                )))}
            </group>

            {/* 2. OVERHEAD STATUS PLATE */}
            <group position={[0, 3.9, 0.22]}>
                <mesh>
                    <boxGeometry args={[2.4, 0.35, 0.05]} />
                    <meshStandardMaterial color="#0e1014" />
                </mesh>
                <mesh position={[0, 0.17, 0]}>
                    <boxGeometry args={[2.4, 0.01, 0.06]} />
                    <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} toneMapped={false} />
                </mesh>
                <Text
                    position={[0, 0, 0.03]}
                    fontSize={0.12}
                    letterSpacing={0.2}
                    color={isNear ? "#00d4ff" : "#004a5e"}
                >
                    <meshBasicMaterial color={isNear ? "#00d4ff" : "#004a5e"} toneMapped={false} />
                    {statusText}
                </Text>
                {/* Status Dots */}
                {[-0.9, 0.9].map((x, i) => (
                    <mesh key={i} position={[x, 0, 0.03]}>
                        <circleGeometry args={[0.02, 16]} />
                        <meshBasicMaterial color={isNear ? "#00d4ff" : "#d4a017"} toneMapped={false} />
                    </mesh>
                ))}
            </group>

            {/* 3. WALL MOUNT CAMERA */}
            <group position={[-0.9, 4.35, 0.2]}>
                <mesh rotation={[0.4, 0.5, 0]}>
                    <boxGeometry args={[0.3, 0.14, 0.14]} />
                    <meshStandardMaterial color="#1a1b20" metalness={1} />
                    <mesh position={[0.16, 0, 0]}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshStandardMaterial color="#000" metalness={1} roughness={0} />
                    </mesh>
                    <mesh ref={cameraLed} position={[0.08, 0, 0.08]}>
                        <sphereGeometry args={[0.015, 8, 8]} />
                        <meshBasicMaterial color="#ff0000" toneMapped={false} />
                    </mesh>
                </mesh>
                <mesh position={[0, 0.15, -0.1]}><boxGeometry args={[0.04, 0.3, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
            </group>

            {/* 4. SIDE SCANNER POD */}
            <group position={[1.55, 1.8, 0.2]}>
                <mesh><boxGeometry args={[0.25, 0.65, 0.1]} /><meshStandardMaterial color="#0e1013" /></mesh>
                {/* Security Indicator LED (Red by default) */}
                <mesh position={[0, 0.22, 0.06]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshBasicMaterial color={isNear ? "#00d4ff" : "#b00000"} toneMapped={false} />
                </mesh>
                {/* Scanner Slot */}
                <mesh position={[0, -0.08, 0.06]}>
                    <planeGeometry args={[0.15, 0.28]} />
                    <meshStandardMaterial color="#050508" />
                </mesh>
                <Text position={[0, -0.28, 0.06]} fontSize={0.055} color="#ffffff" opacity={0.3} transparent>ID</Text>
            </group>

            {/* 5. BHILAEE SWING DOOR (Pivot Left - Pushed forward to avoid Z-fighting) */}
            <group position={[-1.15, 1.8, 0.17]} ref={doorHinge}>
                <group position={[1.15, 0, 0]}>
                    {/* Door Slab (Disable receiveShadow to prevent stippling) */}
                    <mesh castShadow>
                        <boxGeometry args={[2.3, 3.6, 0.1]} />
                        <meshPhysicalMaterial
                            color="#1b1d22"
                            metalness={0.85}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* Industrial Panel Lines */}
                    {[0.6, 0, -0.6, -1.2].map((y, i) => (
                        <mesh key={i} position={[0, y, 0.051]}>
                            <boxGeometry args={[2.3, 0.015, 0.01]} />
                            <meshBasicMaterial color="#000" />
                        </mesh>
                    ))}

                    {/* Vertical Centre Seam */}
                    <mesh position={[0, 0, 0.052]}>
                        <boxGeometry args={[0.01, 3.6, 0.02]} />
                        <meshBasicMaterial color="#000" />
                    </mesh>

                    {/* ID PLATE */}
                    <group position={[0, 1.3, 0.06]}>
                        <Text fontSize={0.35} letterSpacing={0.1} renderOrder={100}>
                            <meshBasicMaterial color="#00d4ff" toneMapped={false} depthTest={false} />
                            {lab.code}
                        </Text>
                        <Text position={[0, -0.2, 0]} fontSize={0.07} color="#ffffff" opacity={0.2} transparent>
                            {lab.name.toUpperCase()}
                        </Text>
                    </group>

                    {/* Fingerprint Plate (Door Mounted) */}
                    <group position={[0, 0.4, 0.06]}>
                        <mesh><boxGeometry args={[0.5, 0.35, 0.01]} /><meshStandardMaterial color="#0c1014" /></mesh>
                        {[...Array(5)].map((_, i) => (
                            <mesh key={i} position={[0, -0.1 + (i * 0.05), 0.007]}>
                                <boxGeometry args={[0.3, 0.02, 0.005]} />
                                <meshBasicMaterial color={isNear ? "#00d4ff" : "#004a5e"} transparent opacity={0.6} toneMapped={false} />
                            </mesh>
                        ))}
                    </group>

                    {/* Vertical Handle */}
                    <mesh position={[1.0, -0.8, 0.08]}>
                        <boxGeometry args={[0.08, 0.5, 0.08]} />
                        <meshStandardMaterial color="#2c2d32" metalness={1} />
                    </mesh>

                    {/* Hazard Stripe */}
                    <mesh position={[0, -1.73, 0.06]}>
                        <planeGeometry args={[2.3, 0.14]} />
                        <meshBasicMaterial color="#d4a017" transparent opacity={0.5} toneMapped={false} />
                    </mesh>
                </group>

                {/* Hinge Edge */}
                <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <planeGeometry args={[0.1, 3.6]} />
                    <meshStandardMaterial color="#0b0c10" />
                </mesh>
            </group>

            {/* 6. FLOOR GLOW Reveal */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0.8]}>
                <circleGeometry args={[1.8, 32]} />
                <meshBasicMaterial color={isNear ? "#00d4ff" : "#d4a017"} transparent opacity={isNear ? 0.2 : 0} toneMapped={false} />
            </mesh>
        </group>
    );
}

function ExitWall({ position, onExit }) {
    const archiveLab = { id: 'archive', code: 'ARC-01', name: 'User Records' };

    return (
        <group position={position} rotation={[0, Math.PI, 0]}>
            {/* BHILAEE Main Concrete Wall */}
            <mesh receiveShadow position={[0, 2.5, 0.1]}><boxGeometry args={[15, 5, 0.1]} /><meshStandardMaterial color="#0a0a0d" /></mesh>

            {/* Exit Portal (Center) */}
            <ExitDoorSystem position={[0, 0, 0]} onExit={onExit} />

            {/* Reception Desk - Swapped to the Right Side (local 2.2) */}
            <group position={[5.75, 0, 0.12]}>
                <ReceptionDesk />
            </group>

            {/* Archive Wing - Stays on the Left Side (local -4.5) */}
            <group position={[-4.5, 0, 0]}>
                <Sector7DoorSystem
                    lab={archiveLab}
                    position={[0, 0, 0]}
                    statusText="USER ARCHIVE"
                />
            </group>
        </group>
    );
}

function ReceptionDesk() {
    // THE ULTIMATE VISIBILITY TEST - SOLID VOLUMETRIC CURVE
    // A thick neon "C" block that is impossible to miss.
    const R = 2.0; // Outer Radius
    const T = 0.4; // Solid thickness
    const H = 1.2; // Height

    const EXT = 2.3 // length of the tail

    const solidShape = useMemo(() => {
        const shape = new THREE.Shape();

        // Start
        shape.moveTo(0, 0);

        // OUTER ARC (270°)
        shape.absarc(-R, 0, R, 0, Math.PI * 1.5, false);

        // OUTER TANGENT EXTENSION (this is the "J" tail)
        shape.lineTo(-R + EXT, -R);

        // Go inward (thickness)
        shape.lineTo(-R + EXT, -R + T);

        // INNER TANGENT BACK
        shape.lineTo(-R + T, -R + T);

        // INNER ARC (reverse)
        shape.absarc(-R, 0, R - T, Math.PI * 1.5, 0, true);

        shape.closePath();

        return shape;
    }, [R, T]);

    return (
        <group>
            {/* Massive solid volumetric glowing neon curve */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <extrudeGeometry args={[solidShape, { depth: H, bevelEnabled: false }]} />
                <meshStandardMaterial color="#2a3036" metalness={0.4} roughness={0.7} />
            </mesh>

            {/* RECEPTION ACCESSORIES - Sitting flush on surface, shifted back towards wall (Z=1.8) */}
            <group position={[-0.8, H, 1.8]}>
                {/* 1. Admin PC Monitor */}
                <group position={[0.4, 0.25, 0]} rotation={[0, -Math.PI / 6, 0]}>
                    {/* Monitor Base */}
                    <mesh position={[0, -0.2, 0]}><boxGeometry args={[0.2, 0.02, 0.15]} /><meshStandardMaterial color="#111" /></mesh>
                    <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.04, 0.2, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
                    {/* Screen */}
                    <mesh rotation={[-0.1, 0, 0]}>
                        <boxGeometry args={[0.6, 0.35, 0.03]} />
                        <meshStandardMaterial color="#050505" />
                    </mesh>
                    <mesh position={[0, 0, 0.016]} rotation={[-0.1, 0, 0]}>
                        <planeGeometry args={[0.56, 0.31]} />
                        <meshBasicMaterial color="#00ffff" toneMapped={false} />
                    </mesh>
                </group>

                {/* 2. Notepad with Papers - Shifted slightly back towards wall */}
                <group position={[-0.2, 0.01, 0.0]} rotation={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[0.25, 0.02, 0.3]} /><meshStandardMaterial color="#d4a017" roughness={0.8} /></mesh>
                    <mesh position={[0, 0.015, 0]}><boxGeometry args={[0.22, 0.01, 0.26]} /><meshStandardMaterial color="#ffffff" roughness={1} /></mesh>
                </group>

                {/* 3. Pen Holder */}
                <group position={[0.1, 0.01, -0.1]}>
                    <mesh position={[0, 0.08, 0]}>
                        <cylinderGeometry args={[0.04, 0.04, 0.16, 16, 1, true]} />
                        <meshStandardMaterial color="#111" side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.04, 0.04, 0.01, 16]} /><meshStandardMaterial color="#111" /></mesh>
                    {/* Two Pens */}
                    <mesh position={[0.01, 0.15, 0]} rotation={[0.2, 0, 0.1]}><cylinderGeometry args={[0.005, 0.005, 0.18]} /><meshStandardMaterial color="#007bff" /></mesh>
                    <mesh position={[-0.01, 0.15, 0.01]} rotation={[-0.1, 0, -0.15]}><cylinderGeometry args={[0.005, 0.005, 0.18]} /><meshStandardMaterial color="#333" /></mesh>
                </group>

                {/* Subtle Task Lighting */}
                <pointLight position={[0.3, 0.6, 0.2]} intensity={0.8} color="#00ffff" distance={2} />
            </group>
        </group>
    );
}

function ExitDoorSystem({ position, onExit }) {
    const doorHinge = useRef();
    const groupRef = useRef();
    const { camera } = useThree();
    const [isNear, setIsNear] = useState(false);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const worldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPos);
        const distance = worldPos.distanceTo(camera.position);
        const near = distance < 3.0; // Reduced from 5.0 for more intentional exit
        if (near !== isNear) setIsNear(near);

        const targetRotation = isNear ? -Math.PI * 0.45 : 0;
        if (doorHinge.current) {
            doorHinge.current.rotation.y = THREE.MathUtils.lerp(doorHinge.current.rotation.y, targetRotation, delta * 1.5);
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Standardized Exit Frame */}
            <mesh position={[0, 1.8, 0.1]} receiveShadow><boxGeometry args={[2.4, 3.8, 0.2]} /><meshStandardMaterial color="#050507" /></mesh>

            <group position={[0, 3.9, 0.22]}>
                <mesh><boxGeometry args={[2.4, 0.35, 0.05]} /><meshStandardMaterial color="#1a0000" /></mesh>
                <Text fontSize={0.12} letterSpacing={0.2}>
                    <meshBasicMaterial color="#ff4444" toneMapped={false} depthTest={false} />
                    SYSTEM TERMINATION
                </Text>
            </group>

            {/* Standardized Swing Door (Pushed forward to avoid Z-fighting) */}
            <group position={[-1.2, 1.8, 0.17]} ref={doorHinge} onClick={onExit}>
                <group position={[1.2, 0, 0]}>
                    <mesh castShadow>
                        <boxGeometry args={[2.3, 3.6, 0.1]} />
                        <meshPhysicalMaterial color="#3a0a0a" metalness={0.7} roughness={0.3} />
                    </mesh>
                    <Text position={[0, 0.6, 0.06]} fontSize={0.35} fontWeight="bold" renderOrder={100}>
                        <meshBasicMaterial color="#ffffff" toneMapped={false} depthTest={false} />
                        EXIT
                    </Text>
                    <Text position={[0, -0.2, 0.06]} fontSize={0.07} color="#ffffff" opacity={0.6} transparent>BHILAEE SHUTDOWN</Text>
                    <mesh position={[0, -1.73, 0.06]}>
                        <planeGeometry args={[2.3, 0.14]} />
                        <meshBasicMaterial color="#d4a017" transparent opacity={0.5} toneMapped={false} />
                    </mesh>
                </group>
                <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.1, 3.6]} /><meshStandardMaterial color="#2a0000" /></mesh>
            </group>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0.8]}>
                <circleGeometry args={[1.8, 32]} />
                <meshBasicMaterial color="#ff0000" transparent opacity={isNear ? 0.2 : 0} toneMapped={false} />
            </mesh>
        </group>
    );
}
