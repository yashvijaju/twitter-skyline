"use client"
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from './page.module.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';



const inter = Inter({ subsets: ['latin'] })

// Global variables
let scene,
camera,
renderer,
controls,
clickMouse,
moveMouse,
raycaster,
draggableObject;


const width_floor = 50 * (7 + 1) // 7 bc days in a week
const depth_floor = 50 * (52 + 1) // 52 bc weeks in a year

// Create Scene and lights
function init() {
  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  // CAMERA
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.set(-80, 100, 200);

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // CAMERA MOVEMENT CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 55, 0);
  controls.enableDamping = true;
  controls.update();

  // LIGHTS
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-30, 50, 150);
  scene.add(ambientLight);
  scene.add(directionalLight);

  // RAYCASTING (mouse functionality)
  raycaster = new THREE.Raycaster();
  clickMouse = new THREE.Vector2();
  moveMouse = new THREE.Vector2();

  // FLOOR
  let floor = new THREE.Mesh(
    new THREE.BoxBufferGeometry(width_floor, 100, depth_floor),
    new THREE.MeshPhongMaterial({ color: '#000000' })
  );
  floor.isDraggable = false;
  scene.add(floor);
}

/**
* Adding simple object in the scene
*
* @param {number} radius of the object
* @param {Object} pos object containing position data { x: number, y: number, z: number }
* @param {Color} color hex code for color of object
*/
function addObject(x, y, pos, color) {
  let object = new THREE.Mesh(
    new THREE.BoxGeometry(x, y, 100),
    new THREE.MeshPhongMaterial({ color: color })
  );
  object.position.set(pos.x, pos.y, pos.z);
  scene.add(object);
}

/**
* Checks if the user is 'holding' an object.
* If true, function updates object's location based on mouse postion
* If false, function does nothing
*/
function dragObject() {
  // If 'holding' an object, move the object
  if (draggableObject) {
    raycaster.setFromCamera(moveMouse, camera);
    // `found` is the metadata of the objects, not the objetcs themsevles
    const found = raycaster.intersectObjects(scene.children);
    if (found.length) {
      for (let obj3d of found) {
        if (!obj3d.object.isDraggablee) {
          draggableObject.position.x = obj3d.point.x;
          draggableObject.position.z = obj3d.point.z;
          break;
        }
      }
    }
  }
}

const makeDraggable = () => {
  // Allows user to pick up and drop objects on-click events
  window.addEventListener("click", (event) => {
    // If 'holding' object on-click, set container to <undefined> to 'drop' the object.
    if (draggableObject) {
      draggableObject = undefined;
      return;
    }

    // If NOT 'holding' object on-click, set container to <object> to 'pickup' the object.
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(clickMouse, camera);
    const found = raycaster.intersectObjects(scene.children, true);
    if (found.length && found[0].object.isDraggable) {
      draggableObject = found[0].object;
    }
  });

  // Constantly updates the mouse location for use in `dragObject()`
  window.addEventListener("mousemove", (event) => {
    dragObject(); // Updates the object's postion every time the mouse moves
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Recursive function to render the scene
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Start the program
  (function () {
    init();
    // Adding multiple objects
    let width_building = 10;
    let depth_building = 10;
    for (var row = -(depth_floor/2)+depth_building; row <= (depth_floor/2)-depth_building; row += 50) {
      for (var col = -(width_floor/2)+width_building; col <= (width_floor/2)-width_building; col += 50) {
        if (Math.random() > 0.3) {
          console.log('hi');
          addObject(50, 0, { x: col, y: 0, z: row }, "#1DA1F2");
        } else {
          let rand_num = Math.floor(Math.random() * 1000) * 0.5;
          let rand_color = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
          addObject(50, rand_num, { x: col, y: rand_num/2, z: row }, "#1DA1F2");
        }

      }
    }
    
    animate();
  })();
}

export default function Home() {
  useEffect(makeDraggable);
  return (
    <main className={styles.main}>
    </main>
  )
}
