import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {Colors} from '../core/constants/colors';
import {FloorUserData} from '../core/models/floor-user-data.model';
import {BehaviorSubject} from 'rxjs';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.PointLight;
  private controls: OrbitControls;

  private frameId: number = null;
  private mouse: THREE.Vector2;
  private raycaster: THREE.Raycaster;
  private INTERSECTED = null;

  floorClicked: BehaviorSubject<string> = new BehaviorSubject('');

  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    const initialCameraDistance = 35;
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set( -16, 20, 24);
    this.scene.add(this.camera);

    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(0, 100, 0);

    this.scene.add(this.light);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    const mainBuilding = this.createBuilding(10);
    this.scene.add(mainBuilding);

    // controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = initialCameraDistance;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  addFloor(color = 0x000000): THREE.Mesh {
    const dimensions = {width: 7, height: 1, depth: 14};
    const geometry = new THREE.BoxBufferGeometry(dimensions.width, dimensions.height, dimensions.depth);
    const material = new THREE.MeshBasicMaterial({color: color});
    // const wireframe_material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
    const cube = new THREE.Mesh(geometry, material);
    // cube.rotation.x = Math.PI / 4;
    // cube.rotation.y = Math.PI / 4;
    return cube;
  }

  createBuilding(floors = 1): THREE.Group {
    const building = new THREE.Group();
    for (let i = 0; i < floors; i++) {
      const color = i % 2 === 0 ? 0x000000 : Colors.default;
      const floor = this.addFloor(color);
      floor.userData.floor = this.formatFloorId(i);
      floor.translateY(i * 1.5);
      building.add(floor);
    }
    return building;
  }

  formatFloorId(floorNumber: number): string {
    return `floor_${floorNumber}`;
  }

  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('DOMContentLoaded', () => {
        this.render();
      });

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
  }

  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  getSelection(event): void {
    const intersects = this.getIntersection(event);
    if (intersects.length) {
      // Cast to any required because the the type of the intersect objects is forced to object3D
      // which does not have an material and color property.
      // const block = intersects[0] as any;
      // block.object.material.color.setHex(Colors.active);
      if ( this.INTERSECTED !== intersects[ 0 ].object ) {
        if ( this.INTERSECTED ) {
          this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
        }
        this.INTERSECTED = intersects[ 0 ].object;
        this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
        this.INTERSECTED.material.color.setHex( Colors.active );
        const floorData = this.INTERSECTED.userData as FloorUserData;
        this.floorClicked.next(floorData.floor);
      }
    } else {
      if ( this.INTERSECTED ) {
        this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
        this.floorClicked.next('');

      }
      this.INTERSECTED = null;
    }
  }

  getIntersection(event): THREE.Intersection[] {
    this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;

    this.raycaster.setFromCamera( this.mouse, this.camera );
    return this.raycaster.intersectObjects( this.scene.children, true );
  }
}
