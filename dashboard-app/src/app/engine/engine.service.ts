import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private ambient: THREE.AmbientLight;
  private light: THREE.PointLight;

  private frameId: number = null;
  private radius: number;
  private theta: number;
  private onMouseDownTheta: number;
  private onMouseDownPhi: number;
  private phi: number;
  private onMouseDownPosition: THREE.Vector2;

  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
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
    this.camera.position.z = 25;
    this.scene.add(this.camera);

    // soft white light
    this.ambient = new THREE.AmbientLight(0x404040);
    this.ambient.position.z = 10;

    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(20, 50, 10);
    this.scene.add(this.ambient);
    this.scene.add(this.light);
    // this.cube.cursor = 'pointer';
    // cube.on('click', function(ev) {});
    /*
    const geometry = new THREE.PlaneGeometry( 30, 30, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.rotateZ(45);
    this.scene.add( plane );
    */

    this.radius = 25;
    this.theta = 0;
    this.onMouseDownTheta = 0;
    this.phi = 0;
    this.onMouseDownPhi = 0;
    this.onMouseDownPosition = new THREE.Vector2();

    const mainBuilding = this.createBuilding(11);
    this.scene.add(mainBuilding);
    const sideBuilding = this.createBuilding(5);
    sideBuilding.translateX(6);
    this.scene.add(sideBuilding);
    const sideBuilding2 = this.createBuilding(15);
    sideBuilding2.translateX(-5);
    sideBuilding2.translateZ(0);
    sideBuilding2.translateY(-5);
    this.scene.add(sideBuilding2);
  }

  addFloor(color = 0x000000): THREE.Mesh {
    const dimensions = {width: 3, height: 1, depth: 3};
    const geometry = new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
    const material = new THREE.MeshBasicMaterial({color: color});
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = Math.PI / 4;
    cube.rotation.y = Math.PI / 4;
    return cube;
  }

  createBuilding(floors = 1): THREE.Group {
    const building = new THREE.Group();
    for (let i = 0; i < floors; i++) {
      const color = i % 2 === 0 ? 0x000000 : 0x394a6d;
      const floor = this.addFloor(color);
      floor.translateY(i);
      building.add(floor);
    }
    return building;
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

  onDocumentMouseWheel( event ): void  {
    const movement = event.wheelDeltaY / 50;

    if ( (this.radius - movement <= 20) || (this.radius - movement >= 60) ) {
      return;
    }

    this.radius -= movement;

    this.camera.position.x = this.radius * Math.sin( this.theta * Math.PI / 360 ) * Math.cos( this.phi * Math.PI / 360 );
    this.camera.position.y = this.radius * Math.sin( this.phi * Math.PI / 360 );
    this.camera.position.z = this.radius * Math.cos( this.theta * Math.PI / 360 ) * Math.cos( this.phi * Math.PI / 360 );
    this.camera.updateMatrix();

    this.render();
  }
}
