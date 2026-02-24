import * as THREE from 'https://esm.sh/three@0.153.0';
import { OrbitControls } from 'https://esm.sh/three@0.153.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://esm.sh/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'https://esm.sh/three@0.153.0/examples/jsm/libs/lil-gui.module.min.js';

export class Scene3D {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            modelPath: options.modelPath || 'public/assets/scene.gltf',
            modelScale: options.modelScale || 100,
            cameraPosition: options.cameraPosition || { x: 5, y: 5, z: 5 },
            enableGUI: options.enableGUI !== undefined ? options.enableGUI : true,
            enableControls: options.enableControls !== undefined ? options.enableControls : true,
            overlayText: options.overlayText || null,
            backgroundColor: options.backgroundColor || null
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.mixer = null;
        this.object = null;
        this.gui = null;
        this.container = null;
        this.isAnimating = false;
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container with id "${this.containerId}" not found`);
            return;
        }

        this.setupWrapper();
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        if (this.options.enableControls) {
            this.setupControls();
        }
        if (this.options.enableGUI) {
            this.setupGUI();
        }
        this.loadModel();
        this.setupResizeHandler();
        this.animate();
    }

    setupWrapper() {
        const wrapper = document.createElement('div');
        wrapper.className = 'scene3d-component';
        
        const sceneContainer = document.createElement('div');
        sceneContainer.className = 'scene3d-container';
        sceneContainer.id = `${this.containerId}-canvas`;
        
        wrapper.appendChild(sceneContainer);
        
        if (this.options.overlayText) {
            const overlay = document.createElement('div');
            overlay.className = 'scene3d-overlay';
            overlay.innerHTML = `<h2>${this.options.overlayText}</h2>`;
            wrapper.appendChild(overlay);
        }
        
        this.container.appendChild(wrapper);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        if (this.options.backgroundColor) {
            this.scene.background = new THREE.Color(this.options.backgroundColor);
        }
    }

    setupCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
        this.camera.position.set(
            this.options.cameraPosition.x,
            this.options.cameraPosition.y,
            this.options.cameraPosition.z
        );
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        const canvasContainer = document.getElementById(`${this.containerId}-canvas`);
        canvasContainer.appendChild(this.renderer.domElement);
    }

    setupLights() {
        const topLight = new THREE.DirectionalLight(0xffffff, 1);
        topLight.position.set(5, 5, 5);
        topLight.castShadow = true;
        this.scene.add(topLight);

        const ambientLight = new THREE.AmbientLight(0x333333, 1);
        this.scene.add(ambientLight);

        this.topLight = topLight;
        this.ambientLight = ambientLight;
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(0, 0, 0);
        this.controls.enableRotate = true;
        this.controls.enableZoom = true;
    }

    setupGUI() {
        this.gui = new GUI();

        const cameraFolder = this.gui.addFolder('Camera');
        cameraFolder.add(this.camera.position, 'x', -20, 20).name('Position X');
        cameraFolder.add(this.camera.position, 'y', -20, 20).name('Position Y');
        cameraFolder.add(this.camera.position, 'z', -20, 20).name('Position Z');
        cameraFolder.add(this.camera, 'fov', 20, 120).onChange(() => {
            this.camera.updateProjectionMatrix();
        }).name('Field of View');

        const lightFolder = this.gui.addFolder('Lights');
        lightFolder.add(this.topLight, 'intensity', 0, 3).name('Directional Light');
        lightFolder.add(this.ambientLight, 'intensity', 0, 3).name('Ambient Light');
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            this.options.modelPath,
            (gltf) => {
                this.object = gltf.scene;
                this.scene.add(this.object);
                
                const scale = this.options.modelScale;
                this.object.scale.set(scale, scale, scale);

                if (gltf.animations.length > 0) {
                    this.mixer = new THREE.AnimationMixer(this.object);
                    const action = this.mixer.clipAction(gltf.animations[0]);
                    action.play();
                }

                if (this.gui && this.object) {
                    const objectFolder = this.gui.addFolder('Object');
                    objectFolder.add(this.object.position, 'x', -10, 10).name('Position X');
                    objectFolder.add(this.object.position, 'y', -10, 10).name('Position Y');
                    objectFolder.add(this.object.position, 'z', -10, 10).name('Position Z');
                    objectFolder.add(this.object.scale, 'x', 0.1, 1000).name('Scale').onChange(v => {
                        this.object.scale.set(v, v, v);
                    });
                }

                this.onModelLoaded();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    }

    onModelLoaded() {
        // Override this method for custom behavior after model loads
    }

    setupResizeHandler() {
        const resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });
        resizeObserver.observe(this.container);
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        this.isAnimating = true;
        
        const clock = new THREE.Clock();
        
        const animateLoop = () => {
            if (!this.isAnimating) return;
            
            requestAnimationFrame(animateLoop);
            
            const delta = clock.getDelta();
            if (this.mixer) {
                this.mixer.update(delta);
            }
            
            if (this.controls) {
                this.controls.update();
            }
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animateLoop();
    }

    animateEntry() {
        if (this.object) {
            gsap.from(this.object.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: "back.out(1.7)"
            });
        }
    }

    destroy() {
        this.isAnimating = false;
        
        if (this.gui) {
            this.gui.destroy();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}