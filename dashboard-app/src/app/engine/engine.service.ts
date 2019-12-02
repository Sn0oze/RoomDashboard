import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {Colors} from '../core/constants/colors';
import {FloorUserData} from '../core/models/floor-user-data.model';
import {BehaviorSubject} from 'rxjs';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass';
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
  private raycaster: THREE.Raycaster;
  private INTERSECTED = null;

  private constructionSite: THREE.Group;
  private plane: THREE.Mesh;

  floorClicked: BehaviorSubject<FloorUserData> = new BehaviorSubject(null);
  // private composer: EffectComposer;
  // private outlinePass: OutlinePass;
  // private renderPass: RenderPass;

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

    this.light = new THREE.PointLight(0xf9ffb5, 1);
    this.light.position.set(25, 25, 0);
    // this.light.castShadow = true;
    this.scene.add(this.light);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));


    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    // Center scene to construction site
    this.constructionSite = this.sceneService.buildScene();
    new THREE.Box3().setFromObject( this.constructionSite ).getCenter( this.constructionSite.position ).multiplyScalar( - 1 );
    this.scene.add(this.constructionSite);

    // Ground plane
    const planeGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 1 );
    const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xdddddd, side: THREE.DoubleSide} );
    this.plane = new THREE.Mesh( planeGeometry, planeMaterial );
    this.plane.position.y =  this.constructionSite.position.y;
    this.plane.rotation.x = - Math.PI / 2;
    // this.plane.receiveShadow = true;
    this.scene.add(this.plane);


    // controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = initialCameraDistance;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2;

    /*
    this.composer = new EffectComposer( this.renderer );
    this.renderPass = new RenderPass( this.scene, this.camera );
    this.composer.addPass( this.renderPass );
    this.outlinePass = new OutlinePass( new THREE.Vector2( this.container.offsetWidth, window.innerHeight ), this.scene, this.camera );
    this.outlinePass.edgeStrength = 3;
    this.outlinePass.edgeThickness = 1;
    this.outlinePass.visibleEdgeColor.set('#000000');
    this.outlinePass.hiddenEdgeColor.set('#190a05');
    this.composer.addPass( this.outlinePass );
     */
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
    // this.composer.setSize( width, height );
  }

  getIntersection(event): THREE.Intersection[] {
    const canvasBounds = this.renderer.getContext().canvas.getBoundingClientRect();
    this.mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
    this.mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

    this.raycaster.setFromCamera( this.mouse, this.camera );
    return this.raycaster.intersectObjects( this.constructionSite.children, true );
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
        console.log(this.INTERSECTED, this.constructionSite);
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
