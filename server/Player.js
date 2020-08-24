import THREE from "three";

export default class Player {
  constructor(position = { x: 0, y: 0, z: 0 }) {
    this.position = new THREE.Vector3(position.x, position.y, position.z);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.vec = new THREE.Vector3();

    this.inputs = [];
    this.processedInputs = [];
  }
}
