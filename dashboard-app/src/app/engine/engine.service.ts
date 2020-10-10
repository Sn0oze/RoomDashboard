import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {Colors} from '../core/constants/colors';
import {FloorUserData} from '../core/models/floor-user-data.model';
import {BehaviorSubject} from 'rxjs';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {SceneService} from './scene.service';


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
  private mouse: THREE.Vector2;
  private rayCaster: THREE.Raycaster;
  private INTERSECTED = null;

  private constructionSite: THREE.Group;

  floorClicked: BehaviorSubject<FloorUserData> = new BehaviorSubject(null);

  public constructor(private ngZone: NgZone, private sceneService: SceneService) {
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>, container: ElementRef<HTMLDivElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    const initialCameraDistance = 35;
    this.canvas = canvas.nativeElement;
    this.container = container.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(this.container.offsetWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, this.container.offsetWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set( -16, 20, 24);
    this.scene.add(this.camera);

    this.light = new THREE.PointLight(0xffffff, 1);
    this.light.position.set(25, 25, 0);
    // this.light.castShadow = true;
    this.scene.add(this.light);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));


    this.mouse = new THREE.Vector2();
    this.rayCaster = new THREE.Raycaster();

    // Center scene to construction site
    this.constructionSite = this.sceneService.buildScene();
    new THREE.Box3().setFromObject( this.constructionSite ).getCenter( this.constructionSite.position ).multiplyScalar( - 1 );
    this.scene.add(this.constructionSite);

    const boundingBox = new THREE.Box3().setFromObject(this.constructionSite);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const gridSize = size.z * 1.5;
    const gridDivisions = 10;

    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
    gridHelper.position.y = this.constructionSite.position.y;
    this.scene.add( gridHelper );

    const loader = new THREE.FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',  ( font ) => {
      const labels = this.sceneService.setLabels(this.constructionSite, font);
      this.scene.add(labels);
    });


    // controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = initialCameraDistance;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2;

    const position = new THREE.Vector3();
    this.constructionSite.children.forEach(building => {
      building.children.forEach((mesh: THREE.Mesh) => {
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const contour = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
        mesh.getWorldPosition(position);
        contour.setRotationFromQuaternion(building.quaternion);
        contour.position.set(position.x, position.y, position.z);
        this.scene.add(contour);
      });
    });
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
      window.addEventListener('mousedown', (event) => {
        if (event.target === this.canvas) {
          this.getSelection(event);
        }
      });
      window.addEventListener('touchstart', (event) => {
        const element = event.targetTouches[0];
        if (element.target === this.canvas) {
          this.getSelection(element);
        }
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
    const width = this.container.offsetWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  getIntersection(event): THREE.Intersection[] {
    const canvasBounds = this.renderer.getContext().canvas.getBoundingClientRect();
    this.mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
    this.mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

    this.rayCaster.setFromCamera( this.mouse, this.camera );
    return this.rayCaster.intersectObjects( this.constructionSite.children, true );
  }

  getSelection(event): void {
    const intersects = this.getIntersection(event);
    if (intersects.length) {
      // Cast to any required because the the type of the intersect objects is forced to object3D
      // which does not have an material and color property.
      // const block = intersects[0] as any;
      // block.object.material.color.setHex(Colors.active);
      if ( this.INTERSECTED !== intersects[ 0 ].object) {
        if ( this.INTERSECTED ) {
          this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
        }
        this.INTERSECTED = intersects[ 0 ].object;
        this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
        this.INTERSECTED.material.color.setHex( Colors.active );
        // this.outlinePass.selectedObjects = [this.INTERSECTED];
        const floorData = this.INTERSECTED.userData as FloorUserData;
        this.floorClicked.next(floorData);
      }
    } else {
      if ( this.INTERSECTED) {
        /*
        this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
        this.outlinePass.selectedObjects = [];
        this.floorClicked.next(null);
         */

      }
      // this.INTERSECTED = null;
    }
  }
}
