'use client';

import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

const SPEED = 5;

export default function Player() {
    const camera = useThree((state) => state.camera);
    const [, get] = useKeyboardControls();
    const velocity = useRef(new THREE.Vector3());

    useFrame((state, delta) => {
        const { forward, backward, left, right } = get();
        
        // Calculate movement direction
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
        const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED)
            .applyQuaternion(camera.quaternion);

        // Movement on XZ plane only
        const newX = camera.position.x + direction.x * delta;
        const newZ = camera.position.z + direction.z * delta;

        // Clamp within room (approx 15x15 room)
        const BOUNDARY = 6.8;
        if (Math.abs(newX) < BOUNDARY) camera.position.x = newX;
        if (Math.abs(newZ) < BOUNDARY) camera.position.z = newZ;
        
        // Keep user grounded
        camera.position.y = 1.7; // Human height approx
    });

    return null;
}
