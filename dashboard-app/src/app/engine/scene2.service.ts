import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {Colors} from '../core/constants/colors';
import {QueryUtils} from '../utils';
import {SCENE} from '../constants';

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
    const levelCount = this.getConfigValue('levels', SCENE.LEVELS);
    this.levels = Array.from({length: levelCount}, (v, i) => i);
  }

  buildScene(): THREE.Group {
    const buildingModel = this.loadBuilding();
    this.site.add(buildingModel);
    return this.site;
  }

  addLevel(levelNumber: number): THREE.Group {
    const level = new THREE.Group();
    const n = this.getConfigValue('n', SCENE.N);
    const m = this.getConfigValue('m', SCENE.M);
    this.constructGridLevel(level, levelNumber, n, m);
    return level;
  }

  addLevelFromShape(levelNumber: number): THREE.Group {
    const level = new THREE.Group();
    this.constructShape(level, levelNumber);
    return level;
  }

  constructShape(
    level: THREE.Group,
    levelNumber: number,
  ): void {
    level.name = `level-${levelNumber}`;
    const color = levelNumber % 2 ? Colors.orange : Colors.default;

    const points = [];
    points.push( new THREE.Vector2( 0, 0 ));
    points.push( new THREE.Vector2( 0, 18 ));
    points.push( new THREE.Vector2( 12, 18 ));
    points.push( new THREE.Vector2( 18, 11 ));
    points.push( new THREE.Vector2( 10, 3 ));
    points.push( new THREE.Vector2( 7, 6 ));
    points.push( new THREE.Vector2( 12, 11 ));
    points.push( new THREE.Vector2( 9, 14 ));
    points.push( new THREE.Vector2( 4, 14 ));
    points.push( new THREE.Vector2( 4, 0 ));
    points.push( new THREE.Vector2( 0, 0 ));

    const geometry = new THREE.ExtrudeBufferGeometry( new THREE.Shape( points ), {depth: 2, bevelEnabled: false} );
    const material = new THREE.MeshLambertMaterial({color: color});
    const volume = new THREE.Mesh(geometry, material);
    volume.position.y = levelNumber * 2;
    volume.rotation.x = Math.PI / 2;
    level.add(volume);
  }

  loadBuilding(): THREE.Group {
    const building = new THREE.Group();
    this.levels.forEach((levelId, index) => {
      // const level = this.addLevel(index);
      const level = this.addLevelFromShape(index);
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

  getConfigValue(key: string, fallback: number): number {
    return parseInt(QueryUtils.getParams().get(key), 10) || fallback;
  }
}
