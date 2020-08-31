import * as THREE from "three";
import PlayerBase from "./PlayerBase";
import { keyboardCodes, PointerLockControls } from "./utils";

const { KEY_W, KEY_S, KEY_A, KEY_D, SPACE, SHIFT } = keyboardCodes;

export default class MyPlayer extends PlayerBase {
  constructor(game, position) {
    super(game.scene, position);

    this.game = game;

    this.reqSeqNumber = 0;
    this.inputs = [];
    this.inputsCopy = [];
    this.responses = [];

    this.speed = 100;

    this.keyState = Object.fromEntries(
      [KEY_W, KEY_S, KEY_A, KEY_D, SPACE, SHIFT].map((KEY_CODE) => [
        KEY_CODE,
        // isPressed
        false,
      ])
    );

    this.listeners = [
      { type: "keydown", callback: this.handleKey.bind(this) },
      { type: "keyup", callback: this.handleKey.bind(this) },
    ];
  }

  addEventListeners() {
    this.listeners.forEach(({ type, callback }) =>
      document.addEventListener(type, callback, false)
    );
  }

  removeEventListeners() {
    this.listeners.forEach(({ type, callback }) =>
      document.removeEventListener(type, callback, false)
    );
  }

  handleKey(event) {
    const isPressed = event.type === "keydown";

    // if keyState includes keyCode - send data to server and update keyState
    if (this.keyState[event.keyCode] !== undefined) {
      // send key to server
      this.sendKeyToServer(event.keyCode, isPressed);
      // update keyState
      this.keyState[event.keyCode] = isPressed;
    }
  }

  resetKeyState() {
    for (const key in this.keyState) {
      if (this.keyState[key]) {
        // send release keyState to server
        this.sendKeyToServer(Number(key), false);
      }
      this.keyState[key] = false;
    }
  }

  sendKeyToServer(KEY_CODE, isPressed) {
    this.reqSeqNumber++;

    const payload = {
      reqSeqNumber: this.reqSeqNumber,
      type: "movement",
      details: {
        key: KEY_CODE,
        isPressed,
        camera: {
          vector: this.vec.setFromMatrixColumn(this.camera.matrix, 0),
          up: this.camera.up,
        },
      },
    };

    this.inputs.push(payload);

    this.game.channel.emit("message", payload);
  }

  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.rotation.y = Math.PI;
    this.camera.position.copy(this.meshGroup.position);
    this.meshGroup.add(this.camera);

    this.game.activeCamera = this.camera;
    this.game.scene.add(this.camera);
  }

  addControls() {
    this.controls = new PointerLockControls(
      this.camera,
      this.game.renderer.domElement
    );

    document.addEventListener("click", () => {
      if (!this.controls.isLocked) {
        this.controls.lock();
      }
    });
    this.controls.addEventListener("lock", () => {
      this.resetKeyState();
      this.addEventListeners();
    });
    this.controls.addEventListener("unlock", () => {
      this.resetKeyState();
      this.removeEventListeners();
    });
  }

  moveForward(distance) {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);

    this.vec.crossVectors(this.camera.up, this.vec);

    this.meshGroup.position.addScaledVector(this.vec, distance);
  }

  moveSide(distance) {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);

    this.meshGroup.position.addScaledVector(this.vec, distance);
  }

  moveUp(distance) {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);

    this.meshGroup.position.y += distance;
  }

  awake() {
    this.addMeshToScene();
    this.addCamera();
    this.addControls();
  }

  physicsTick(delta) {
    if (this.responses.length) {
      // apply all changes of authoritative server state
      this.responses.forEach((payload) => {
        if (payload.type === "movement") {
          this.meshGroup.position.copy(payload.position);
          this.camera.position.copy(payload.position);
        }
      });
    }
  }

  update(delta) {
    // if (this.controls.isLocked) {
    //   this.velocity.z -= this.velocity.z * 7 * delta;
    //   this.velocity.x -= this.velocity.x * 7 * delta;
    //   this.velocity.y -= this.velocity.y * 7 * delta;
    //   this.direction.z = +this.keyState[KEY_W] - +this.keyState[KEY_S];
    //   this.direction.x = +this.keyState[KEY_D] - +this.keyState[KEY_A];
    //   this.direction.y = +this.keyState[SPACE] - +this.keyState[SHIFT];
    //   this.direction.normalize();
    //   if (this.keyState[KEY_W] || this.keyState[KEY_S])
    //     this.velocity.z -= this.direction.z * 100 * delta;
    //   if (this.keyState[KEY_A] || this.keyState[KEY_D])
    //     this.velocity.x -= this.direction.x * 100 * delta;
    //   if (this.keyState[SPACE] || this.keyState[SHIFT])
    //     this.velocity.y -= this.direction.y * 100 * delta;
    //   this.moveForward(-this.velocity.z * delta);
    //   this.moveSide(-this.velocity.x * delta);
    //   this.moveUp(-this.velocity.y * delta);
    //   this.camera.position.copy(this.meshGroup.position);
    // }
  }
}
