import './style.css';
import { App } from './App';
import { BarFigure } from './models/BarFigure';
import { IBar } from './types/types';

const BAR_DEPTH = 1;
const bar = {
	open: 7,
	close: 9,
	high: 12,
	low: 5,
	time: 2022,
} as IBar;

const bar1 = {
	open: 9,
	close: 12,
	high: 14,
	low: 7,
	time: 2022,
} as IBar;

const bar2 = {
	open: 9,
	close: 4,
	high: 11,
	low: 3,
	time: 2022,
} as IBar;

init()

function init() {
	const app = new App();
	app.setLight({ x: 4, y: 6, z: 2 });
	app.setLight({ x: -4, y: 6, z: -2 });
	
	const barFigure = new BarFigure(bar, { x: 0, y: 0, z: 0 }, BAR_DEPTH);
	const barFigure1 = new BarFigure(bar1, { x: BAR_DEPTH + 0.1, y: bar1.low - bar.low, z: 0 }, BAR_DEPTH);
	const barFigure2= new BarFigure(bar2, { x: 2 * (BAR_DEPTH + 0.1), y: bar2.low - bar.low, z: 0 }, BAR_DEPTH);

	app.scene.add(...barFigure.create(), ...barFigure1.create(), ...barFigure2.create());
	
	window.addEventListener('resize', app.handleWindowResize);
}


