'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

export default function LabBuilding({ labs }) {
    return (
        <group position={[0, 0, -10]}>
            {/* Main Building Structure */}
            <mesh position={[0, 2.5, -5]} castShadow receiveShadow>
                <boxGeometry args={[30, 8, 10]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} transparent opacity={0.7} />
            </mesh>

            {/* Glowing Entrance Frame */}
            <mesh position={[0, 1.5, 0.1]}>
                <boxGeometry args={[6, 4, 0.2]} />
                <meshStandardMaterial color="#00f" emissive="#00f" emissiveIntensity={2} />
            </mesh>

            <mesh position={[0, 1.5, 0.15]}>
                <boxGeometry args={[5.8, 3.8, 0.1]} />
                <meshStandardMaterial color="#000" />
            </mesh>

            {/* Dashboard Stall */}
            <DashboardStall position={[0, 1.5, 8]} />

            {/* Lab Rooms (Stalls) */}
            {labs.map((lab, i) => (
                <LabRoom 
                    key={lab.id} 
                    lab={lab} 
                    position={[(i - (labs.length - 1) / 2) * 8, 1.5, 0]} 
                />
            ))}
        </group>
    );
}

function LabRoom({ lab, position }) {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);
    const boxRef = useRef();

    useFrame((state) => {
        if (boxRef.current) {
            // Subtle pulse if hovered
            const t = state.clock.elapsedTime;
            if (hovered) {
                boxRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.05);
            } else {
                boxRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }
    });

    return (
        <group 
            position={position} 
            onPointerOver={() => setHovered(true)} 
            onPointerOut={() => setHovered(false)}
            onClick={() => router.push(`/lab/${lab.id}`)}
        >
            {/* Room/Pod Structure */}
            <mesh ref={boxRef} castShadow receiveShadow>
                <boxGeometry args={[6, 4, 2]} />
                <meshStandardMaterial 
                    color={hovered ? "#222" : "#111"} 
                    metalness={0.9} 
                    roughness={0.1} 
                    transparent 
                    opacity={0.8} 
                    emissive={hovered ? "#00ffff" : "#000"}
                    emissiveIntensity={hovered ? 0.5 : 0}
                />
            </mesh>

            {/* Label */}
            <Text
                position={[0, 2.5, 0]}
                fontSize={0.4}
                color="#00ffff"
                anchorX="center"
                maxWidth={5}
                textAlign="center"
            >
                {lab.name}
            </Text>

            {/* Neon Portal */}
            <mesh position={[0, 0, 1.01]}>
                <planeGeometry args={[4, 2.5]} />
                <meshStandardMaterial 
                    color="#00ffff" 
                    emissive="#00ffff" 
                    emissiveIntensity={hovered ? 2 : 0.5} 
                    transparent 
                    opacity={0.3} 
                />
            </mesh>
            
            <Text
                position={[0, 0, 1.05]}
                fontSize={0.3}
                color="#fff"
                anchorX="center"
            >
                ENTER LAB
            </Text>
        </group>
    );
}

function DashboardStall({ position }) {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    return (
        <group 
            position={position} 
            onPointerOver={() => setHovered(true)} 
            onPointerOut={() => setHovered(false)}
            onClick={() => router.push('/observations')}
        >
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[2.5, 2.5, 0.5, 32]} />
                    <meshStandardMaterial 
                        color={hovered ? "#ff00ff" : "#222"} 
                        metalness={1} 
                        roughness={0} 
                        emissive={hovered ? "#ff00ff" : "#000"}
                        emissiveIntensity={0.5}
                    />
                </mesh>
                
                <Text
                    position={[0, 1, 0]}
                    fontSize={0.5}
                    color="#ff00ff"
                    anchorX="center"
                >
                    DASHBOARD
                </Text>
                
                <Text
                    position={[0, 0.4, 0]}
                    fontSize={0.25}
                    color="#fff"
                    anchorX="center"
                    maxWidth={2}
                >
                    (Your Records & Stars)
                </Text>
            </Float>
            
            {/* Hologram Peak */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[2, 2, 0.1, 32]} />
                <meshStandardMaterial color="#ff00ff" transparent opacity={0.2} />
            </mesh>
        </group>
    );
}
