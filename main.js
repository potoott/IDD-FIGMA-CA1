
import * as THREE from 'https://esm.sh/three@0.153.0';
import { OrbitControls } from 'https://esm.sh/three@0.153.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://esm.sh/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'https://esm.sh/three@0.153.0/examples/jsm/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(5, 5, 5); // Set initial camera position

let object;
let controls;
let objToRender = 'assets';

const loader = new GLTFLoader();
console.log("objToRender =", objToRender);
loader.load(
    `public/assets/scene.gltf`,
    function (gltf) {
        object = gltf.scene;
        scene.add(object);
        const scale = 30;
        object.scale.set(scale, scale, scale);
        
        // Add object controls to GUI after loading
        if (gui && object) {
            const objectFolder = gui.addFolder('Object');
            objectFolder.add(object.position, 'x', -10, 10).name('Position X');
            objectFolder.add(object.position, 'y', -10, 10).name('Position Y');
            objectFolder.add(object.position, 'z', -10, 10).name('Position Z');
            objectFolder.add(object.scale, 'x', 0.1, 100).name('Scale').onChange(v => {
                object.scale.set(v, v, v);
            });
        }
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error(error);
    }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

// Light the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1);
const offset = 5;
topLight.position.set(offset, offset, offset);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);
controls.enableRotate = true;
controls.enableZoom = true;

// Inspector GUI
const gui = new GUI();

// Camera Controls
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x', -20, 20).name('Position X');
cameraFolder.add(camera.position, 'y', -20, 20).name('Position Y');
cameraFolder.add(camera.position, 'z', -20, 20).name('Position Z');
cameraFolder.add(camera, 'fov', 20, 120).onChange(() => {
    camera.updateProjectionMatrix();
}).name('Field of View');

// Light Controls
const lightFolder = gui.addFolder('Lights');
lightFolder.add(topLight, 'intensity', 0, 3).name('Directional Light');
lightFolder.add(ambientLight, 'intensity', 0, 3).name('Ambient Light');
lightFolder.addColor({ color: 0xffffff }, 'color').onChange(v => {
    topLight.color.setHex(v);
}).name('Light Color');

// Scene Controls
const sceneFolder = gui.addFolder('Scene');
sceneFolder.addColor({ bgColor: 0x000000 }, 'bgColor').onChange(v => {
    scene.background = new THREE.Color(v);
}).name('Background');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Fixed: lowercase 'u'
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}