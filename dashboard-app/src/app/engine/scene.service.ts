import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {Colors} from '../core/constants/colors';
import buildingData from '../../data/buildingDataV2.json';
import {FloorUserData} from '../core/models/floor-user-data.model';

interface Building {
  coords: {
    x: number;
    y: number;
    z: number;
    rotation: number;
  };
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  constructor() { }

  buildScene(): THREE.Group {
    const site = new THREE.Group();

    Object.entries(buildingData).forEach((([buildingName, building]) => {
      const floors = building.data;
      const coords = building.coords;

      Object.entries(floors).forEach(([floor, zones], index) => {
        const buildingModel = this.createBuilding(floors, buildingName);
        buildingModel.position.set(coords.x, coords.y, coords.z);
        buildingModel.rotateY(coords.rotation);
        site.add(buildingModel);
      });
    }));
    return site;
  }

  private addFloor(color = 0x000000): THREE.Mesh {
    const dimensions = {width: 7, height: 1, depth: 14};
    const geometry = new THREE.BoxBufferGeometry(dimensions.width, dimensions.height, dimensions.depth);
    const material = new THREE.MeshLambertMaterial({color: color});
    // const wireframe_material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
    // const floor = new THREE.Mesh(geometry, material);
    // floor.castShadow = true;
    // floor.receiveShadow = true;
    // return floor;
    return new THREE.Mesh(geometry, material);
  }

  private createBuilding(floors, buildingName = 'None'): THREE.Group {
    const building = new THREE.Group();
    Object.entries(floors).forEach(([floorName, zones], index) => {
      const color = index % 2 === 0 ? 0x252a3d : Colors.default;
      const floor = this.addFloor(color);
      floor.userData = {
        floor: floorName,
        building: buildingName,
        data: zones
      } as FloorUserData;
      floor.translateY(1 + (index));
      building.add(floor);
    });
    return building;
  }
}
