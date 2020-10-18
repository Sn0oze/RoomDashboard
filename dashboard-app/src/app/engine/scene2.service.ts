import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {Colors} from '../core/constants/colors';

@Injectable({
  providedIn: 'root'
})
export class Scene2Service {
  private site =  new THREE.Group();
  private levels = Array.from({length: 5}, (v, i) => i);
  public get buildingLevels(): number[] {
    return this.levels;
  }

  constructor() { }

  buildScene(): THREE.Group {
    const buildingModel = this.loadBuilding();
    // const coords = buildingModel.coords;
    this.site.add(buildingModel);
    return this.site;
  }

  addLevel(levelNumber: number): THREE.Group {
    const level = new THREE.Group();
    this.constructGridLevel(level, levelNumber);
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
        const rowColor = row % 2 ? 0x252a3d : Colors.default;
        const colColor = col % 2 ? rowColor : row % 2 ? Colors.default : 0x252a3d;
        const color = levelNumber % 2 ? (colColor === Colors.default ? 0x252a3d : Colors.default) : colColor;
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
}
