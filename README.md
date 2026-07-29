# Procedural City Generator

A 3D procedural architecture and city generation tool built with React, Three.js, and React Three Fiber.

## Overview

This application allows users to procedurally generate, manipulate, and arrange 3D buildings in a real-time web environment. It provides a highly interactive interface for designing abstract and realistic architectural forms using a voxel-like block generation system. 

## Features

- **Procedural Architecture Generation:** Generate buildings using various architectural styles (Monolith, Stacked, Tower, Podium, Cantilever, Slab).
- **Interactive Editing:** 
  - Adjust building parameters such as base width, base depth, and core height.
  - Precisely rotate buildings along the Y-axis.
  - Drag and drop buildings across the ground plane.
- **Auto-Generate City Blocks:** Instantly populate the scene with a procedurally generated grid of buildings.
- **Environment & Lighting:**
  - Toggle between 'Abstract' and 'Realistic' environment modes.
  - Adjust the intensity of volumetric lighting.
- **Dynamic Texturing & Shaders:** 
  - Apply concrete textures.
  - Toggle custom weathering effects (water stains, moss) generated via custom GLSL fragment shaders.
- **State Management:** Robust state management using Zustand to keep track of building configurations, selections, and environmental settings.

## Technologies Used

- **React (18+)** - UI framework
- **Three.js & React Three Fiber** - 3D rendering engine and React wrapper
- **Zustand** - State management
- **Tailwind CSS** - Styling for the interface
- **Lucide React** - UI Icons

## Project Structure

- \`/src/components/Scene.tsx\` - The main 3D canvas and environment setup.
- \`/src/components/Building.tsx\` - Handles the rendering, shaders, and interaction logic for individual buildings.
- \`/src/components/Sidebar.tsx\` & \`/src/components/LeftSidebar.tsx\` - UI controls for modifying building parameters and global environment settings.
- \`/src/utils/generator.ts\` - The core logic for generating architectural blocks based on selected styles and dimensions.
- \`/src/store.ts\` - Zustand store managing application state.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## Usage

- Click "Add Entity" or "Gen City Block" in the left sidebar to populate the scene.
- Select a building by clicking on it in the 3D view.
- Use the left sidebar to modify the selected building's dimensions, style, and rotation.
- Use the right sidebar to toggle environment modes, apply weathering shaders, and adjust lighting intensity.
- Click and drag buildings to move them around the grid.
