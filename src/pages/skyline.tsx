"use client"
import Image from 'next/image';
import { Inter } from '@next/font/google';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import styles from '../app/page.module.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';
import axios from 'axios';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const inter = Inter({ subsets: ['latin'] })


// Fetch Data from Twitter API
export async function getServerSideProps(context) {
  // Fetch data from external API
  const url = `https://api.twitter.com/1.1/trends/place.json?id=`+context["query"]["id"]
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_BEARER}`
    }
  });

  // Pass data to the page via props
  return {
    props: {
      trends: res.data[0].trends,
      country: context["query"]["country"].replace("_"," ")
    }}
}


// Global variables
let scene,
camera,
floor,
renderer,
controls,
clickMouse,
moveMouse,
raycaster,
draggableObject,
composer,
objectClicked;


const width_floor = 50 * (5 + 1) // 7 bc days in a week
const depth_floor = 50 * (40 + 1) // 52 bc weeks in a year
var trends_twitter;

// Create Scene and lights
function init() {
  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0a2d);

  // CAMERA
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    3500
  );
  camera.position.set(1100, 250, 100);
  camera.zoom = 0.7;
  camera.updateProjectionMatrix();


  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // UNREAL BLOOM PASS
  const renderScene = new RenderPass(scene, camera);
  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.6, 
    0.6,
    0.6
  );
  composer.addPass(bloomPass);

  // CAMERA MOVEMENT CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set( 0, 0.5, 0 )
  controls.enableDamping = true;
  controls.update();

  // LIGHTS
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  let directionalLight_2 = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position.set(-30, 50, 150);
  directionalLight.position.set(0.3, 0.5, 0.3);
  directionalLight_2.position.set(-0.3, 0.5, 0.3);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(directionalLight_2);

  // RAYCASTING (mouse functionality)
  raycaster = new THREE.Raycaster();
  clickMouse = new THREE.Vector2();
  moveMouse = new THREE.Vector2();
  objectClicked = new THREE.Vector2();

  // FLOOR
  floor = new THREE.Mesh(
    new THREE.BoxBufferGeometry(width_floor, 150, depth_floor),
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
    new THREE.BoxGeometry(x, y, 50),
    new THREE.MeshPhongMaterial({ color: color })
  );
  object.position.set(pos.x, pos.y, pos.z);
  scene.add(object);
}

/**
* Adding a clickable object in the scene
*
* @param {number} radius of the object
* @param {Object} pos object containing position data { x: number, y: number, z: number }
* @param {Color} color hex code for color of object
*/
function addClickableObject(x, y, pos, color, item) {
  let object = new THREE.Mesh(
    new THREE.BoxGeometry(x, y, 50),
    new THREE.MeshPhongMaterial({ color: color })
  );
  object.position.set(pos.x, pos.y, pos.z);
  object.userData = item;
  scene.add(object);}

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

  // ReDirect user
  window.addEventListener("click", (event) => {
    objectClicked.x = (event.clientX / window.innerWidth) * 2 - 1;
    objectClicked.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(objectClicked , camera);
    const found = raycaster.intersectObjects(scene.children, true);
    if (found.length && found[0].object.userData.url) {
      console.log(found[0].object.userData);
      window.open(found[0].object.userData.url);
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
    // renderer.render(scene, camera);
    composer.render();
    requestAnimationFrame(animate);
  }

  // Start the program
  (function () {
    init();
    // Adding multiple objects
    let width_building = 10;
    let depth_building = 10;
    var max_count = trends_twitter.length;
    for (var row = -(depth_floor/2)+50; row < (depth_floor/2)-depth_building; row += 75) {
      for (var col = -(width_floor/2)+50; col <= (width_floor/2)-width_building; col += 75) {
        if (Math.random() > 0.45 || max_count==0) {
          addObject(50, 0, { x: col, y: 75, z: row }, "#000000");
        } else {
          // let rand_num = Math.floor(Math.random() * 1000) * 0.5;
          let rand_num = trends_twitter[max_count-1]["volume"]*20000;
          let blue_colors = ["#126ca3", '#1DA1F2']
          let rand_color = Math.floor(Math.random()*2)
          addClickableObject(50, rand_num, { x: col, y: rand_num/2+75, z: row }, blue_colors[rand_color], trends_twitter[max_count-1]);
          max_count--;
        }
      }
    }    
    
    animate();
  })();
}

const normalizeData = (trends) => {
  let max = 0.0;
  trends.forEach((trend) => max = Math.max(max, trend.tweet_volume));
  const normalizedData = trends.map((trend) => {
    return {
      name: trend.name,
      volume: Math.min((trend.tweet_volume / max) || Math.random() * 0.01, 0.01 + Math.random() * 0.005),
      url: trend.url,
    }
  });
  return normalizedData
}

export default function Home({ trends, country }) {
  trends_twitter = normalizeData(trends);
  useEffect(makeDraggable);
  return (
    <div>
      <Container  sx={{
          my: 5,
          mx: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'fixed'
        }}>
         
          <Typography variant="h4" component="h1" gutterBottom sx={{color: 'white'}}>
            {country}
          </Typography>
      </Container>
    </div>
  )
}
