
/// <reference types="vite/client" />

declare module 'three/addons/webxr/VRButton.js';
declare module 'three/addons/controls/OrbitControls.js' {
	class OrbitControls {
		constructor(camera: any, domElement: HTMLCanvasElement) {}
		update() {}
	}
}
