import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {Colors} from '../core/constants/colors';
import buildingData from '../../data/buildingDataV2.json';
import {FloorUserData} from '../core/models/floor-user-data.model';
// import fontD from '../../fonts/Roboto_Regular.json';


/*
interface Building {
  coords: {
    x: number;
    y: number;
    z: number;
    rotation: number;
  };
  data: Object;
}

 */

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  constructor() { }

  // scene generation
  buildScene(): THREE.Group {
    const site = new THREE.Group();

    Object.entries(buildingData).forEach((([buildingName, building]) => {
      const floors = building.data;
      const coords = building.coords;

      const buildingModel = this.createBuilding(floors, buildingName);
      buildingModel.position.set(coords.x, coords.y, coords.z);
      buildingModel.rotateY(coords.rotation);
      site.add(buildingModel);
    }));

    return site;
  }

  addFloor(color = 0x000000): THREE.Mesh {
    const dimensions = {width: 7, height: 2, depth: 14};
    const geometry = new THREE.BoxBufferGeometry(dimensions.width, dimensions.height, dimensions.depth);
    // const material = new THREE.MeshStandardMaterial({color: color, metalness: 0, roughness: 1});
    const material = new THREE.MeshLambertMaterial({color: color});
    return new THREE.Mesh(geometry, material);
  }

  createBuilding(floors, buildingName = 'None'): THREE.Group {
    const building = new THREE.Group();
    Object.entries(floors).forEach(([floorName, zones], index) => {
      const color = index % 2 === 0 ? 0x252a3d : Colors.default;
      const floor = this.addFloor(color);
      floor.userData = {
        floor: floorName,
        building: buildingName,
        data: zones
      } as FloorUserData;
      floor.translateY(1 + (index * 2));
      building.add(floor);
    });
    return building;
  }

  // adding labels

  setLabels(scene: THREE.Group, font: THREE.Font): THREE.Group {
    const labels = new THREE.Group();

    Object.values(scene.children).forEach((building) => {
      const floors = Object.values(building.children);
      const top = floors[floors.length - 1];
      const data = top.userData as FloorUserData;

      const textGeo = new THREE.TextBufferGeometry( data.building, {font: font, size: 2, height: .1, });
      const textMaterial = new THREE.MeshBasicMaterial( { color: 0x313131 } );
      const label = new THREE.Mesh( textGeo, textMaterial );
      label.translateY(8);
      const center = this.getCenterPoint(top);
      label.position.x = center.x;
      label.position.z = center.z;
      label.position.y = center.y + 3;
      label.geometry.center();
      // console.log(top, center);
      labels.add(label);
    });
    return labels;
  }
  getCenterPoint(mesh) {
    const geometry = mesh.geometry;
    geometry.computeBoundingBox();
    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    mesh.localToWorld( center );
    return center;
  }
}
