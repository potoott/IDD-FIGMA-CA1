import { Header } from './components/Header.js';
import { Banner } from './components/Banner.js';
import { Scene3D } from './components/Scene3D.js';

// Initialize Header
const header = new Header('header-root', {
    logo: 'Home',
    navItems: ['About', 'Contact', 'Apple Store'],
    onNavClick: (navName) => {
        console.log(`Clicked: ${navName}`);
        // Add your navigation logic here
    }
});
header.render();
header.animate();

// Initialize 3D Scene
const scene3d = new Scene3D('scene3d-root', {
    modelPath: 'public/assets/scene.gltf',
    modelScale: 100,
    cameraPosition: { x: 5, y: 5, z: 5 },
    enableGUI: true,
    enableControls: true,
    overlayText: null // or 'AirPods Pro 3' to show overlay text
});
scene3d.init();
scene3d.animateEntry();

// Initialize Banner
const banner = new Banner('banner-root', {
    title: 'AirPods Pro 3',
    subtext: "The world's best noise cancellation"
});
banner.render();
banner.animate();

// Optional: Initialize second 3D scene in section 2
const scene3d2 = new Scene3D('scene3d-root-2', {
    modelPath: 'public/assets/scene.gltf',
    modelScale: 100,
    cameraPosition: { x: 5, y: 5, z: 5 },
    enableGUI: false, // Disable GUI for secondary scenes
    enableControls: true
});
scene3d2.init();

// GSAP ScrollTrigger animations
gsap.registerPlugin(ScrollTrigger);

// Animate scene on scroll
ScrollTrigger.create({
    trigger: '#scene3d-root',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
        if (scene3d.object) {
            scene3d.object.rotation.y = self.progress * Math.PI * 2;
        }
    }
});