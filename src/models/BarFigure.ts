import { IBar, IPosition } from 'src/types/types';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';

enum EColor {
	RED = 0x22ab94,
	GREEN = 0xf23645,
}

interface IBarFigure {
	create: () => Mesh<BoxGeometry, MeshStandardMaterial>[];
}

export class BarFigure implements IBarFigure {
	private _bar: IBar;
	private _position: IPosition;
	private _depth: number = 1;

	constructor(bar: IBar, position: IPosition, depth: number) {
		this._bar = { ...bar };
		this._position = { ...position };
		this._depth = depth;
	}

	create() {
		const topWick = this._createWick(this._bar.high - this._bodyTop, this._bodyHeight / 2);
		const cube = this._createCube(this._depth, this._bodyHeight, this._position);
		const bottomWick = this._createWick(this._bodyBottom - this._bar.low, -this._bodyHeight / 2);
		
		return [topWick, cube, bottomWick];
	}

	private _createWick(height: number, y: number) {
		return this._createCube(0.1, height, {
			x: this._position.x,
			y: this._position.y + y,
			z: this._position.z,
		});
	}

	private _createCube(width: number, height: number, position: IPosition) {
		const geometry = new BoxGeometry(width, height, width);
		const material = new MeshStandardMaterial({ color: this._color, roughness: 0.7, metalness: 0.0 });
		const cube = new Mesh(geometry, material);
		cube.position.set(position.x, position.y, position.z);

		return cube;
	}

	get _bodyTop() {
		return Math.max(this._bar.open, this._bar.close);
	}

	get _bodyBottom() {
		return Math.min(this._bar.open, this._bar.close);
	}

	get _bodyHeight() {
		return Math.abs(this._bar.close - this._bar.open);
	}

	get _color() {
		return this._bar.open >= this._bar.close ? EColor.GREEN : EColor.RED;
	}

	set bar(bar: IBar) {
		this._bar = { ...bar };
	}
}
