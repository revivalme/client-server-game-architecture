import * as THREE from "three";
import MyPlayer from "./MyPlayer";

export default class Game {
  constructor(channel) {
    this.channel = channel;
    this.myPlayer = null;
  }

  init(playerPos) {
    this.clock = new THREE.Clock();
    this.physicsClock = new THREE.Clock();

    this.createScene();
    this.createCamera();
    this.createLights();
    this.addGridHelper();
    this.createRenderer();

    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.myPlayer = new MyPlayer(this, playerPos);
    this.myPlayer.awake();

    // Start a physics loop at a fixed frequency
    setInterval(() => this.physicsLoop(), 15);

    this.update();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x8fbcd4);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 0, 0);
    this.activeCamera = this.camera;
  }

  createLights() {
    const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 3);
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(10, 50, 10);
    this.scene.add(ambientLight, mainLight);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.gammaFactor = 2.2;
    this.renderer.gammaOutput = true;
    this.renderer.physicallyCorrectLights = true;

    document.body.appendChild(this.renderer.domElement);
  }

  addGridHelper() {
    const size = 50;

    const gridHelperX = new THREE.GridHelper(size, size);
    const gridHelperY = new THREE.GridHelper(size, size);
    const gridHelperZ = new THREE.GridHelper(size, size);

    gridHelperY.rotateX(Math.PI / 2);
    gridHelperZ.rotateZ(Math.PI / 2);
    this.scene.add(gridHelperX, gridHelperY, gridHelperZ);
  }

  onWindowResize() {
    // set the aspect ratio to match the new browser window aspect ratio
    this.activeCamera.aspect = window.innerWidth / window.innerHeight;

    // update the camera's frustum
    this.activeCamera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onServerUpdate(payload) {
    this.myPlayer.responses.push(...payload);
  }

  physicsLoop() {
    const delta = this.physicsClock.getDelta();

    if (this.myPlayer) {
      this.myPlayer.physicsTick(delta);
    }
  }

  update() {
    const delta = this.clock.getDelta();

    if (this.myPlayer) {
      this.myPlayer.update(delta);
    }

    this.renderer.render(this.scene, this.activeCamera);

    // Invoke on next frame
    requestAnimationFrame(() => this.update());
  }
}
