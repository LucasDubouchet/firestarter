import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GridController from './Controllers/grid-controller';
import backEndHelper from './Helpers/back-end-helper';

async function main(){
  // Initialize Three.js scene and renderer
  const renderer = new THREE.WebGLRenderer({antialias: true});

  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setHex(0xa8edf5);
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


  renderer.setSize(window.innerWidth, window.innerHeight);
  const controls = new OrbitControls(camera, renderer.domElement)
  camera.position.set(0, 0, 10);
  controls.update();
  document.body.appendChild(renderer.domElement);


  // fetch back-end data 
  const width = await backEndHelper.fetchWidth();
  const height = await backEndHelper.fetchHeight();
  const fireProbability = await backEndHelper.fetchFireProbabilityPercentage();
  const initialFires = await backEndHelper.fetchInitialFirePositions()

  // create the forest grid and populate it
  const grid = new GridController(width,height,fireProbability, scene);
  grid.reset();
  grid.setupInitalFires(initialFires);

  
// handle window resize and buttons

  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  }

  // next step button function
  function nextStep(){
    // verify if the grid has ended its simulation (whether a new tree has caught fire or not)
    const newFire = grid.computeNextStep();
    if(!newFire) document.getElementById("nextstep").innerHTML = "Sim Ended";
  }
  const stepButton = document.getElementById("nextstep");
  stepButton.onclick = nextStep;

  // reset button
  async function reset() {
    grid.reset();
    grid.setupInitalFires(initialFires);
    stepButton.innerHTML = "Compute Next Step";
  }
  const resetButton = document.getElementById("reset");
  resetButton.onclick = reset;

  var automode = false;
  const automodeButton = document.getElementById("auto-mode");
  async function toggleAutoMode() {
      automode = !automode;
      automodeButton.innerHTML = automode? "Stop Automatic Mode" : "Automatic Mode";
    }
  automodeButton.onclick = toggleAutoMode;
 

  function animate() {
    requestAnimationFrame(animate);
    if(automode){
      const newFire = grid.computeNextStep();
      if(!newFire) toggleAutoMode();
    };
    grid.animate();
    render();
  }

  function render() {
    renderer.render(scene, camera)
  }
  animate();
}

await main();