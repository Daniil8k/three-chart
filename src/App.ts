import { PerspectiveCamera, Scene, WebGLRenderer, Color, DirectionalLight, DirectionalLightHelper } from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { IPosition } from './types/types';

interface IApp {
	handleWindowResize: () => void;
}

export class App implements IApp {
	private _camera: PerspectiveCamera;
	private _scene: Scene;
	private _renderer: WebGLRenderer;
	private _controls: typeof OrbitControls;
	private _container: HTMLElement | null;

	constructor() {
		this._scene = new Scene();
		this._camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this._renderer = new WebGLRenderer({ antialias: true });
		this._controls = new OrbitControls(this._camera, this._renderer.domElement);
		this._container = document.getElementById('app');
		window.addEventListener('resize', this.handleWindowResize, { passive: true });

		this._setOptions();
		this._render();
	}

	get scene() {
		return this._scene;
	}

	public handleWindowResize() {
		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(window.innerWidth, window.innerHeight);
	}

	public setLight(position: IPosition) {
		const light = new DirectionalLight(0xffffff);
		light.position.set(position.x, position.y, position.z);
		light.castShadow = true;
		const lightHelp = new DirectionalLightHelper(light);
		this._scene.add(lightHelp);
		this._scene.add(light);
	}

	private _setOptions() {
		this._scene.background = new Color(0x808080);
		this._camera.position.set(5, 5, 10);

		this._renderer.setPixelRatio(window.devicePixelRatio);
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		this._renderer.shadowMap.enabled = true;
		this._renderer.xr.enabled = true;
	}

	private _render() {
		if (!this._container) {
			return;
		}

		this._container.appendChild(this._renderer.domElement);
		this._container.appendChild(VRButton.createButton(this._renderer));
		this._animate();
	}

	private _animate() {
		requestAnimationFrame(this._animate.bind(this));
		this._controls.update();
		this._renderer.render(this._scene, this._camera);
	}
}
