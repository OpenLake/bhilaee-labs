'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function LabBuilding({ labs, onExit }) {
    const leftWallLabs = labs.slice(0, 3);
    const frontWallLabs = labs.slice(3, 6);
    const rightWallLabs = labs.slice(6, 9);

    return (
        <group>
            {/* 1. ROOM SHELL (Industrial Dark Concrete) */}
            <RoomEnvironment />

            {/* 2. THE 4 WALLS WITH PHYSICAL HOLES */}
            <WallWithHoles position={[-7.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} labs={leftWallLabs} />
            <WallWithHoles position={[0, 0, -7.5]} rotation={[0, 0, 0]} labs={frontWallLabs} />
            <WallWithHoles position={[7.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} labs={rightWallLabs} />
            <ExitWall position={[0, 0, 7.5]} onExit={onExit} />
        </group>
    );
}

function RoomEnvironment() {
    return (
        <group>
            {/* Floor - Polished with grid */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.001, 0]}>
                <planeGeometry args={[16.5, 16.5]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={60}
                    roughness={0.6}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#1a1b1e"
                    metalness={0.5}
                />
            </mesh>
            <gridHelper args={[15, 12, "#555", "#333"]} position={[0, 0.05, 0]} />

            {/* Ceiling */}
            <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[15.2, 15.2]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    );
}

function WallWithHoles({ position, rotation, labs }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Piers (Vertical Pillars) */}
            <mesh position={[-6.5, 1.9, 0]} receiveShadow><boxGeometry args={[2, 3.8, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[-2, 1.9, 0]} receiveShadow><boxGeometry args={[1, 3.8, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[2, 1.9, 0]} receiveShadow><boxGeometry args={[1, 3.8, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[6.5, 1.9, 0]} receiveShadow><boxGeometry args={[2, 3.8, 0.2]} /><meshStandardMaterial color="#222" /></mesh>

            {/* Header (Top section) */}
            <mesh position={[0, 4.4, 0]} receiveShadow><boxGeometry args={[15, 1.2, 0.2]} /><meshStandardMaterial color="#222" /></mesh>

            {/* Lab Door Systems */}
            {labs.map((lab, i) => (
                <LabDoorSystem 
                    key={lab.id} 
                    lab={lab} 
                    position={[(i - 1) * 4, 0, -0.1]} 
                />
            ))}
        </group>
    );
}

function ExitWall({ position, onExit }) {
    return (
        <group position={position} rotation={[0, Math.PI, 0]}>
            <mesh position={[-5.25, 1.9, 0]} receiveShadow><boxGeometry args={[4.5, 3.8, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[5.25, 1.9, 0]} receiveShadow><boxGeometry args={[4.5, 3.8, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[0, 4.4, 0]} receiveShadow><boxGeometry args={[15, 1.2, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
            <ExitDoorSystem position={[0, 0, -0.1]} onExit={onExit} />
        </group>
    );
}

function LabDoorSystem({ lab, position }) {
    const doorPanel = useRef();
    const scannerLight = useRef();
    const groupRef = useRef();
    const { camera } = useThree();
    const [isNear, setIsNear] = useState(false);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        // Calculate distance to camera for proximity trigger
        const worldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPos);
        const distance = worldPos.distanceTo(camera.position);
        const near = distance < 4.5;
        if (near !== isNear) setIsNear(near);

        // Mechanized door speed (Slow & Heavy)
        const targetY = isNear ? 3.5 : 0;
        if (doorPanel.current) {
            doorPanel.current.position.y = THREE.MathUtils.lerp(doorPanel.current.position.y, targetY, delta * 1.5);
        }

        // Scanner feedback
        if (scannerLight.current) {
            scannerLight.current.material.color.lerp(
                new THREE.Color(isNear ? "#00f2ff" : "#500"), 
                delta * 10
            );
            scannerLight.current.material.emissiveIntensity = isNear ? 15 : 0.5;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* 1. Recess Interior */}
            <mesh position={[0, 1.9, -0.5]}>
                <boxGeometry args={[3.05, 3.8, 0.6]} />
                <meshStandardMaterial color="#050505" roughness={1} />
            </mesh>
            
            {/* 2. GUARANTEED VISIBLE LAB NAME (Above Door) */}
            <group position={[0, 4.6, 0.15]}>
                <Text
                fontSize={0.22}
                    fontWeight="bold"
                    anchorX="center"
                    renderOrder={100}
                >
                    <meshBasicMaterial 
                        color="#ffffff" 
                        toneMapped={false} 
                        depthTest={false} 
                        transparent 
                        opacity={1}
                    />
                    {lab.name.toUpperCase()}
                </Text>
            </group>

            {/* 3. SLIDING DOOR ASSEMBLY */}
            <group position={[0, 1.8, -0.15]}>
                <group ref={doorPanel}>
                    {/* Metal Slab */}
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[2.98, 3.58, 0.1]} />
                        <meshPhysicalMaterial 
                            color="#2a2b2f" 
                            metalness={0.9} 
                            roughness={0.15}
                            clearcoat={1}
                        />
                    </mesh>

                    {/* Horizontal Grooves */}
                    {[...Array(8)].map((_, i) => (
                        <mesh key={i} position={[0, -1.5 + (i * 0.45), 0.051]}>
                            <boxGeometry args={[2.98, 0.02, 0.01]} />
                            <meshBasicMaterial color="#111" />
                        </mesh>
                    ))}

                    {/* Vertical Seam */}
                    <mesh position={[0, 0, 0.052]}>
                        <boxGeometry args={[0.02, 3.58, 0.02]} />
                        <meshBasicMaterial color="#000" />
                    </mesh>

                    {/* LAB NUMBER ON DOOR */}
                    <group position={[-1.1, 1.3, 0.06]}>
                        <Text
                            fontSize={0.25}
                            fontWeight={800}
                            letterSpacing={0.1}
                            anchorX="left"
                            renderOrder={90}
                        >
                            <meshBasicMaterial color="#00f2ff" toneMapped={false} depthTest={false} />
                            {lab.code}
                        </Text>
                        <mesh position={[-0.1, 0, 0]}>
                            <planeGeometry args={[0.04, 0.5]} />
                            <meshBasicMaterial color="#00f2ff" toneMapped={false} />
                        </mesh>
                    </group>

                    {/* Hazard Strip */}
                    <mesh position={[0, -1.7, 0.06]}>
                        <planeGeometry args={[2.98, 0.15]} />
                        <meshBasicMaterial color="#e1b12c" transparent opacity={0.6} toneMapped={false} />
                    </mesh>
                </group>
            </group>

            {/* 4. SCANNER */}
            <group position={[1.75, 1.8, 0.15]}>
                <mesh><boxGeometry args={[0.22, 0.65, 0.15]} /><meshStandardMaterial color="#111" /></mesh>
                <mesh ref={scannerLight} position={[0, 0.12, 0.08]}>
                    <planeGeometry args={[0.16, 0.06]} />
                    <meshStandardMaterial color="#500" emissive="#ff0000" emissiveIntensity={1} toneMapped={false} />
                </mesh>
                <mesh position={[0, -0.12, 0.08]}>
                    <planeGeometry args={[0.16, 0.06]} />
                    <meshStandardMaterial color="#400" emissive="#330000" emissiveIntensity={0.5} toneMapped={false} />
                </mesh>
            </group>

            {/* 5. FLOOR LIGHT GLOW */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0.5]}>
                <circleGeometry args={[1.2, 32]} />
                <meshBasicMaterial color="#00f2ff" transparent opacity={0.3} toneMapped={false} />
            </mesh>
        </group>
    );
}

function ExitDoorSystem({ position, onExit }) {
    const doorPanel = useRef();
    const groupRef = useRef();
    const { camera } = useThree();
    const [isNear, setIsNear] = useState(false);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const worldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPos);
        const distance = worldPos.distanceTo(camera.position);
        const near = distance < 5.0;
        if (near !== isNear) setIsNear(near);

        const targetY = isNear ? 3.5 : 0;
        if (doorPanel.current) {
            doorPanel.current.position.y = THREE.MathUtils.lerp(doorPanel.current.position.y, targetY, delta * 1.5);
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh position={[0, 1.9, -0.5]}><boxGeometry args={[6.1, 3.8, 0.6]} /><meshStandardMaterial color="#050505" /></mesh>
            
            <group position={[0, 4.6, 0.15]}>
                <Text fontSize={0.35} fontWeight="bold" renderOrder={100}>
                    <meshBasicMaterial color="#ff4444" toneMapped={false} depthTest={false} />
                    BACK TO CLASSIC MODE
                </Text>
            </group>

            <group position={[0, 1.8, -0.15]} onClick={onExit}>
                <group ref={doorPanel}>
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[5.98, 3.58, 0.1]} />
                        <meshPhysicalMaterial color="#400" metalness={0.7} roughness={0.2} />
                    </mesh>
                    
                    <Text position={[0, 0.6, 0.06]} fontSize={0.7} fontWeight="bold" renderOrder={90}>
                        <meshBasicMaterial color="#ffffff" toneMapped={false} depthTest={false} />
                        EXIT
                    </Text>
                    <Text position={[0, -0.4, 0.06]} fontSize={0.25} renderOrder={90}>
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} toneMapped={false} depthTest={false} />
                        SHUTDOWN SESSION
                    </Text>

                    <mesh position={[0, -1.7, 0.06]}>
                        <planeGeometry args={[5.98, 0.2]} />
                        <meshBasicMaterial color="#e1b12c" transparent opacity={0.6} toneMapped={false} />
                    </mesh>
                </group>
            </group>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 1.0]}>
                <circleGeometry args={[2.5, 32]} />
                <meshBasicMaterial color="#ff4444" transparent opacity={0.3} toneMapped={false} />
            </mesh>
        </group>
    );
}
