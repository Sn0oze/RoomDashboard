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
    // const levelCount = this.getConfigValue('levels', SCENE.LEVELS);
    const levelCount = coords.length;
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
    const color = 0xdddddd; // levelNumber % 2 ? Colors.orange : Colors.default;
    coords[levelNumber].volumes.forEach(volumeCoords => {
      const height = 3;
      const points = volumeCoords.map(([x, y]) => new THREE.Vector2( x / 10, y / 10 ));
      const geometry = new THREE.ExtrudeBufferGeometry(new THREE.Shape(points), {depth: height, bevelEnabled: false});
      const material = new THREE.MeshLambertMaterial({color: color});
      const volume = new THREE.Mesh(geometry, material);
      volume.position.y = levelNumber * height;
      volume.rotation.x = Math.PI / 2;
      level.add(volume);
    });
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

export const coords = [
  {
    id: 1,
    elevation: 2,
    height: 3,
    volumes: [
      [
        [50, 340], [560, 200], [705, 420], [750, 520], [440, 750], [200, 560],
        [270, 470], [440, 610], [615, 485], [510, 330], [80, 450], [50, 340]
      ],
    ]
  },
  {
    id: 2,
    elevation: 2,
    height: 3,
    volumes: [
      [
        [50, 340], [560, 200], [705, 420], [750, 520], [440, 750], [200, 560],
        [270, 470], [440, 610], [615, 485], [510, 330], [80, 450], [50, 340]
      ],
    ]
  },
  {
    id: 3,
    elevation: 2,
    height: 3,
    volumes: [
      [
        [50, 340], [560, 200], [705, 420], [750, 520], [440, 750], [200, 560],
        [270, 470], [440, 610], [615, 485], [510, 330], [80, 450], [50, 340]
      ],
    ]
  },
  {
    id: 4,
    elevation: 2,
    height: 3,
    volumes: [
      [
        [321.8, 265.385], [560, 200], [643.539, 326.750], [546.452, 383.811],
        [500, 315], [432.5, 335], [425, 321.5], [345, 335], [321.8, 265.385]
      ],
      [
        [374.650, 698.264], [440, 610], [615, 485], [709.782, 430.626],
        [750, 520], [440, 750], [374.650, 698.264]
      ]
    ]
  },
  {
    id: 5,
    elevation: 2,
    height: 3,
    volumes: [
      [
        [321.8, 265.385], [560, 200], [643.539, 326.750], [546.452, 383.811],
        [500, 315], [432.5, 335], [425, 321.5], [345, 335], [321.8, 265.385]
      ],
      [
        [455.994, 598.576], [615, 485], [709.782, 430.626],
        [750, 520], [521.349, 689.644], [455.994, 598.576]
      ]
    ]
  },
  {
    id: 6,
    elevation: 2,
    height: 3,
    volumes: [
      [
        [321.8, 265.385], [560, 200], [643.539, 326.750], [546.452, 383.811],
        [500, 315], [432.5, 335], [425, 321.5], [345, 335], [321.8, 265.385]
      ],
      [
        [519.436, 553.262], [615, 485], [709.782, 430.626],
        [750, 520], [584.299, 642.939], [519.436, 553.262]
      ]
    ]
  }
];
