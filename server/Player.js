import THREE from "three";

export default class Player {
  constructor(position = { x: 5, y: 5, z: 5 }) {
    this.position = new THREE.Vector3(position.x, position.y, position.z);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.vec = new THREE.Vector3();

    this.inputs = [];
    this.processedInputs = [];
  }
}
