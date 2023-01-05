import './style.css';
import { App } from './App';
import { BarFigure } from './models/BarFigure';
import { AxesHelper } from 'three';
import { startBinanceWebSocket } from './api/api';
import { IBar } from './types/types';

const BAR_DEPTH = 1;
const barFigures: BarFigure[] = [];

init();

function init() {
	const app = new App();
	const axesHelper = new AxesHelper(5);
	app.setLight({ x: 4, y: 6, z: 2 });
	app.setLight({ x: -4, y: 6, z: -2 });
	app.scene.add(axesHelper);

	const socketListener = initSocketListener(app);
	startBinanceWebSocket(socketListener);
}

function initSocketListener(app: App) {
	return (bar: IBar) => {
		const lastBarFigure = barFigures[barFigures.length - 1];
		if (bar.time === lastBarFigure?.bar?.time) {
			lastBarFigure.bar = bar;
			return;
		}

		const firstBarLow = barFigures[0]?.bar?.low || 0;
		const index = barFigures.length - 1;
		const barFigure = new BarFigure(
			bar,
			{ x: index * (BAR_DEPTH + 0.1), y: bar.low - firstBarLow, z: 0 },
			BAR_DEPTH
		);
		app.scene.add(...barFigure.mesh);
		barFigures.push(barFigure);
	};
}
