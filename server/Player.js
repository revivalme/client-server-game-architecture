import THREE from "three";

const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const SPACE = 32;
const SHIFT = 16;

export default class Player {
  constructor(position = { x: 5, y: 5, z: 5 }) {
    this.position = new THREE.Vector3(position.x, position.y, position.z);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.vec = new THREE.Vector3();

    this.speed = 100;

    this.keyState = Object.fromEntries(
      [KEY_W, KEY_S, KEY_A, KEY_D, SPACE, SHIFT].map((KEY_CODE) => [
        KEY_CODE,
        // isPressed
        false,
      ])
    );

    this.inputs = [];
    this.processedInputs = [];
  }

  handleKey(key, isPressed) {
    // if keyState includes keyCode - send data to server and update keyState
    if (this.keyState[key] !== undefined) {
      // update keyState
      this.keyState[key] = isPressed;
    }
  }

  movementHandler(delta, payload) {
    const { key, isPressed, camera } = payload.details;

    this.handleKey(key, isPressed);

    this.velocity.z -= this.velocity.z * 7 * delta;
    this.velocity.x -= this.velocity.x * 7 * delta;
    this.velocity.y -= this.velocity.y * 7 * delta;

    this.direction.z = +this.keyState[KEY_W] - +this.keyState[KEY_S];
    this.direction.x = +this.keyState[KEY_D] - +this.keyState[KEY_A];
    this.direction.y = +this.keyState[SPACE] - +this.keyState[SHIFT];

    this.direction.normalize();

    if (this.keyState[KEY_W] || this.keyState[KEY_S])
      this.velocity.z -= this.direction.z * this.speed * delta;
    if (this.keyState[KEY_A] || this.keyState[KEY_D])
      this.velocity.x -= this.direction.x * this.speed * delta;
    if (this.keyState[SPACE] || this.keyState[SHIFT])
      this.velocity.y -= this.direction.y * this.speed * delta;

    this.moveForward(camera.vector, camera.up, -this.velocity.z * delta);
    this.moveRight(camera.vector, -this.velocity.x * delta);
    this.moveUp(-this.velocity.y * delta);

    this.processedInputs.push({
      reqSeqNumber: payload.reqSeqNumber,
      type: "movement",
      position: this.position,
      isPressed,
    });
  }

  moveForward(vector, cameraUp, distance) {
    this.vec.copy(vector);

    this.vec.crossVectors(cameraUp, this.vec);

    this.position.addScaledVector(this.vec, distance);
  }

  moveRight(vector, distance) {
    this.vec.copy(vector);

    this.position.addScaledVector(this.vec, distance);
  }

  moveUp(distance) {
    this.position.y += distance;
  }

  physicsTick(delta) {
    if (!this.inputs.length) return;

    this.inputs.forEach((payload) => {
      if (payload.type === "movement") {
        this.movementHandler(delta, payload);
      }
    });

    this.inputs = [];
  }
}
