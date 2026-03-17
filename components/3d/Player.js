'use client';

import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

const SPEED = 5;

export default function Player({ position = [0, 1.7, 5], boundary = 6.8 }) {
    const camera = useThree((state) => state.camera);
    const [, get] = useKeyboardControls();
    const velocity = useRef(new THREE.Vector3());

    // Set initial position
    useEffect(() => {
        camera.position.set(position[0], position[1], position[2]);
        // Set look direction towards center or forward
        camera.lookAt(0, 1.7, position[2] - 5);
    }, [position, camera]);

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

        // Dynamic boundaries
        const boundX = boundary.x || boundary;
        const boundZ = boundary.z || boundary;

        if (Math.abs(newX) < boundX) camera.position.x = newX;
        if (Math.abs(newZ) < boundZ) camera.position.z = newZ;
        
        // Keep user grounded
        camera.position.y = 1.7; // Human height approx
    });

    return null;
}
