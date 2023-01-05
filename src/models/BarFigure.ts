import { IBar, IPosition } from 'src/types/types';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';

enum EColor {
	RED = 0x22ab94,
	GREEN = 0xf23645,
}

interface IBarFigure {
	mesh: Mesh<BoxGeometry, MeshStandardMaterial>[];
	bar: IBar;
}

export class BarFigure implements IBarFigure {
	private _bar: IBar;
	private _position: IPosition;
	private _depth: number = 1;
	private _mesh: Mesh<BoxGeometry, MeshStandardMaterial>[] = [];

	constructor(bar: IBar, position: IPosition, depth: number) {
		this._bar = { ...bar };
		this._position = { ...position };
		this._depth = depth;
		this._createBar();
	}

	get mesh() {
		return this._mesh;
	}

	get bar() {
		return this._bar;
	}

	set bar(bar: IBar) {
		this._bar = { ...bar };
		this._applyBarHeight();
	}

	private _createBar() {
		const bottomHeight = this._bodyBottom - this._bar.low;
		const topHeight = this._bar.high - this._bodyTop;
		const topWick = this._createWick(topHeight);
		const cube = this._createCube(this._depth, this._bodyHeight);
		const bottomWick = this._createWick(bottomHeight);

		cube.translateY(bottomHeight);
		topWick.translateY(bottomHeight + this._bodyHeight);

		this._mesh = [topWick, cube, bottomWick];
	}

	private _applyBarHeight() {
		const [topWick, cube, bottomWick] = this._mesh;
		const bottomHeight = this._bodyBottom - this._bar.low;
		const topHeight = this._bar.high - this._bodyTop;

		this._setScale(topWick, topHeight);
		this._setScale(cube, this._bodyHeight);
		this._setScale(bottomWick, bottomHeight);

		cube.translateY(bottomHeight);
		topWick.translateY(bottomHeight + this._bodyHeight);
	}

	private _setScale(cube: Mesh<BoxGeometry, MeshStandardMaterial>, height: number) {
		cube.position.set(this._position.x, this._position.y + height / 2, this._position.z);
		cube.scale.set(1, height, 1);
	}

	private _createWick(height: number) {
		return this._createCube(0.1, height);
	}

	private _createCube(width: number, height: number) {
		const geometry = new BoxGeometry(width, 1, width);
		const material = new MeshStandardMaterial({ color: this._color, roughness: 0.7, metalness: 0.0 });
		const cube = new Mesh(geometry, material);
		cube.position.set(this._position.x, this._position.y + height / 2, this._position.z);
		cube.scale.set(1, height, 1);

		return cube;
	}

	private get _bodyTop() {
		return Math.max(this._bar.open, this._bar.close);
	}

	private get _bodyBottom() {
		return Math.min(this._bar.open, this._bar.close);
	}

	private get _bodyHeight() {
		return Math.abs(this._bar.close - this._bar.open);
	}

	private get _color() {
		return this._bar.open >= this._bar.close ? EColor.GREEN : EColor.RED;
	}
}
