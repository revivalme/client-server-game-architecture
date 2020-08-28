import * as THREE from "three";

export default class PlayerBase {
  constructor(scene, position = { x: 5, y: 5, z: 5 }) {
    this.scene = scene;
    this.position = new THREE.Vector3(position.x, position.y, position.z);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.vec = new THREE.Vector3();

    this.meshGroup = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }

  createMesh() {
    this.meshGroup = new THREE.Group();

    this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    this.material = new THREE.MeshStandardMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.meshGroup.add(this.mesh);
    this.meshGroup.position.copy(this.position);

    return this.meshGroup;
  }

  addMeshToScene() {
    if (!this.meshGroup) {
      this.createMesh();
    }

    this.scene.add(this.meshGroup);
  }

  removeMeshFromScene() {
    this.scene.remove(this.meshGroup);

    this.geometry.dispose();
    this.material.dispose();
  }

  destroy() {
    this.removeMeshFromScene();
  }
}
