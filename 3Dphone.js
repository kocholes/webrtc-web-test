import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const HEIGHT = 300;
const WIDTH = 500;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( WIDTH, HEIGHT );

var phone;
    
// SkyBox
var skyboxGeometry = new THREE.BoxGeometry(100, 100, 100);
var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// top light
var topLight = new THREE.PointLight(0xffffff);
topLight.position.set(-4, 0, 5);
scene.add(topLight);
// bottom light
var bottomLight = new THREE.PointLight(0xeeeeff);
bottomLight.position.set(-4, 0, -5);
scene.add(bottomLight);

// Camera
const camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT);

export async function init(element) {

    // Phone
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load( './smartphone.glb', function ( gltf ) {
            phone = gltf.scene;
            scene.add( phone );
            element.appendChild( renderer.domElement );
            resolve()
        }, undefined, function ( error ) {
            console.error( error );
            reject(error)
        } );
    });
}

export function render(rotation = [0, 0, 0], cameraPos = [0, 0, 0]) {
    if(phone) {
        phone.rotation.x = -rotation[0];
        phone.rotation.y = rotation[1];
        phone.rotation.z = rotation[2];

        camera.position.x = cameraPos[0];
        camera.position.y = cameraPos[1];
        camera.position.z = cameraPos[2];
        camera.lookAt(phone.position);
        camera.rotation.x = Math.PI / 2
        renderer.render( scene, camera );
    }
}

// function animate() {
//     requestAnimationFrame( animate );

//     cube.rotation.y += 0.01;

//     renderer.render( scene, camera );
// };

// animate();