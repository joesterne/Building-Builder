import React, { useMemo, useRef, useState } from 'react';
import { useTexture } from '@react-three/drei';
import { BuildingData } from '../types';
import { generateBlocks } from '../utils/generator';
import { useStore } from '../store';
import * as THREE from 'three';
// @ts-ignore
import concreteImg from '../assets/images/concrete_texture_1784898985698.jpg';

interface Props {
  data: BuildingData;
  isSelected: boolean;
  onPointerDown: (e: any) => void;
}

export function Building({ data, isSelected, onPointerDown }: Props) {
  const concreteTexture = useTexture(concreteImg);
  const { weathering } = useStore();
  
  // Configure texture to repeat
  useMemo(() => {
    concreteTexture.wrapS = THREE.RepeatWrapping;
    concreteTexture.wrapT = THREE.RepeatWrapping;
    concreteTexture.repeat.set(1, 1);
  }, [concreteTexture]);

  const blocks = useMemo(() => {
    return generateBlocks(data);
  }, [data]);

  const customMaterialCompile = useMemo(() => {
    return (shader: any) => {
      shader.uniforms.uWeathering = { value: weathering ? 1.0 : 0.0 };

      shader.vertexShader = `
        varying vec3 vWorldPosition;
        ${shader.vertexShader}
      `.replace(
        `#include <worldpos_vertex>`,
        `
        #include <worldpos_vertex>
        vWorldPosition = worldPosition.xyz;
        `
      );

      shader.fragmentShader = `
        varying vec3 vWorldPosition;
        uniform float uWeathering;
        
        float random(vec2 p) {
          return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `
        #include <color_fragment>
        if (uWeathering > 0.5) {
          // Dark streaks simulating water stains running down
          float streakNoise = noise(vec2(vWorldPosition.x * 2.0 + vWorldPosition.z * 2.0, vWorldPosition.y * 0.2));
          float streaks = smoothstep(0.4, 0.8, streakNoise) * 0.4;
          diffuseColor.rgb -= streaks;
          
          // Greenish moss on surfaces facing somewhat up, or near bottom
          if (vWorldPosition.y < 3.0) {
            float mossNoise = noise(vWorldPosition.xz * 4.0);
            float moss = smoothstep(0.3, 0.7, mossNoise) * max(0.0, 3.0 - vWorldPosition.y) * 0.4;
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.2, 0.35, 0.15), moss);
          }
        }
        `
      );
    };
  }, [weathering]);

  return (
    <group 
      position={[data.x, 0, data.z]} 
      rotation={[0, ((data.rotationY || 0) * Math.PI) / 180, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown(e);
      }}
    >
      {/* Selection outline/indicator */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(data.baseWidth, data.baseDepth) * 0.8, Math.max(data.baseWidth, data.baseDepth) * 0.8 + 0.2, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
        </mesh>
      )}

      {blocks.map((b, i) => {
        if (b.type === 'window') {
          return (
            <mesh key={i} position={[b.x || 0, b.y, b.z || 0]} castShadow receiveShadow>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </mesh>
          );
        }
        
        return (
          <mesh key={i} position={[b.x || 0, b.y, b.z || 0]} castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial 
              map={concreteTexture} 
              color="#a0a0a0"
              roughness={0.9} 
              metalness={0.1}
              onBeforeCompile={customMaterialCompile}
              customProgramCacheKey={() => weathering ? 'weathered' : 'clean'}
            />
          </mesh>
        );
      })}
    </group>
  );
}
