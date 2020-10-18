import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {Colors} from '../core/constants/colors';

@Injectable({
  providedIn: 'root'
})
export class Scene2Service {
  private site =  new THREE.Group();
  private levels: number[];
  public get buildingLevels(): number[] {
    return this.levels;
  }

  constructor() {
    const levelCount = this.getStorageValue('levelCount', 5);
    this.levels = Array.from({length: levelCount}, (v, i) => i);
  }

  buildScene(): THREE.Group {
    const buildingModel = this.loadBuilding();
    // const coords = buildingModel.coords;
    this.site.add(buildingModel);
    return this.site;
  }

  addLevel(levelNumber: number): THREE.Group {
    const level = new THREE.Group();
    const n = this.getStorageValue('n', 2);
    const m = this.getStorageValue('m', 3);
    this.constructGridLevel(level, levelNumber, n, m);
    return level;
  }

  loadBuilding(): THREE.Group {
    const building = new THREE.Group();
    this.levels.forEach((levelId, index) => {
      const level = this.addLevel(index);
      building.add(level);
    });
    return building;
  }

  setLevelCut(cut: number): void {
    const meshes = this.site.children[0].children;
    meshes.forEach((mesh, index) => mesh.visible = index <= cut);
  }

  constructGridLevel(
    level: THREE.Group,
    levelNumber: number,
    n = 5,
    m = 5,
    dimensions = {width: 5, height: 2, depth: 5},
  ): void {
    level.name = `level-${levelNumber}`;
    for (let col = 1; col <= n; col++) {
      for (let row = 1; row <= m; row++) {
        const rowColor = row % 2 ? Colors.orange : Colors.default;
        const colColor = col % 2 ? rowColor : row % 2 ? Colors.default : Colors.orange;
        const color = levelNumber % 2 ? (colColor === Colors.default ? Colors.orange : Colors.default) : colColor;
        const geometry = new THREE.BoxBufferGeometry(dimensions.width, dimensions.height, dimensions.depth );
        const material = new THREE.MeshLambertMaterial({color: color});
        const volume = new THREE.Mesh(geometry, material);
        volume.position.x = dimensions.width * row;
        volume.position.z = dimensions.depth * col;
        volume.position.y = dimensions.height * levelNumber;
        level.add(volume);
      }
    }
  }
  getStorageValue(key: string, fallback: number): number {
    return  parseInt(localStorage.getItem(key), 10) || fallback;
  }
}
