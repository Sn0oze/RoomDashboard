import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {FloorUserData} from '../core/models/floor-user-data.model';
import {BehaviorSubject} from 'rxjs';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Scene2Service} from './scene2.service';


@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.PointLight;
  private controls: OrbitControls;
  private frameId: number = null;

  private model: THREE.Group;

  floorClicked: BehaviorSubject<FloorUserData> = new BehaviorSubject(null);

  public constructor(private ngZone: NgZone, private sceneService: Scene2Service) {}

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(
    canvas: ElementRef<HTMLCanvasElement>,
    container: ElementRef<HTMLDivElement>,
    withContours = false
  ): void {
    // The first step is to get the reference of the canvas element from our HTML document
    const initialCameraDistance = 35;
    this.canvas = canvas.nativeElement;
    this.container = container.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance',
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, this.container.offsetWidth / window.innerHeight, 1, 2000
    );
    this.camera.position.set(-50, 50, 50);
    this.scene.add(this.camera);
    // const cameraHelper = new THREE.CameraHelper(this.camera);
    // this.scene.add(cameraHelper);

    this.light = new THREE.PointLight(0xffffff, 1);
    this.light.position.set(-25, 25, 15);
    this.scene.add(this.light);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));

    /*const pointLightHelper = new THREE.PointLightHelper(this.light, 5, 0x000000);
    this.scene.add(pointLightHelper);*/

    // Center scene to construction site
    this.model = this.sceneService.buildScene();
    new THREE.Box3().setFromObject( this.model ).getCenter( this.model.position ).multiplyScalar( - 1 );
    this.scene.add(this.model);
    console.log(this.model);

    const boundingBox = new THREE.Box3().setFromObject(this.model);
    const sceneDimensions = new THREE.Vector3();
    boundingBox.getSize(sceneDimensions);
    const gridSize = sceneDimensions.z * 5;
    const gridDivisions = 10;

    const grid = new THREE.GridHelper(gridSize, gridDivisions);
    grid.position.y = boundingBox.min.y + .001;
    this.scene.add(grid);

    // controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.screenSpacePanning = false;
    this.controls.enablePan = false;
    this.controls.minDistance = initialCameraDistance;
    this.controls.maxDistance = 1000;
    // this.controls.maxPolarAngle = Math.PI / 2;

    // draw contours
    if (withContours) {
      const position = new THREE.Vector3();
      this.model.children.forEach(building => {
        building.children.forEach((level: THREE.Group) => {
          level.children.forEach((volume: THREE.Mesh) => {
            const edges = new THREE.EdgesGeometry(volume.geometry);
            const contour = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( {color: 0x000000}));
            volume.getWorldPosition(position);
            contour.setRotationFromQuaternion(building.quaternion);
            contour.position.set(position.x, position.y, position.z);
            this.scene.add(contour);
          });
        });
      });
    }
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
    this.frameId = requestAnimationFrame(() => this.render());
    this.updateFrame();
  }

  updateFrame(): void {
    this.renderer.render(this.scene, this.camera);
  }

  resize(): void {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
