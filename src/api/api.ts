import { IBar } from 'src/types/types';

export interface Kline {
	t: number; // Kline start time
	T: number; // Kline close time
	s: string; // Symbol
	i: string; // Interval
	f: number; // First trade ID
	L: number; // Last trade ID
	o: string; // Open price
	c: string; // Close price
	h: string; // High price
	l: string; // Low price
	v: string; // Base asset volume
	n: number; // Number of trades
	x: boolean; // Is this kline closed?
	q: string; // Quote asset volume
	V: string; // Taker buy base asset volume
	Q: string; // Taker buy quote asset volume
	B: string; // Ignore
}

export interface KlineMessage {
	e: string; // Event type
	E: number; // Event time
	s: string; // Symbol
	k: Kline; // Kline
}

function onopen() {
	console.log('[open] Соединение установлено');
}

function onclose(event: CloseEvent) {
	if (event.wasClean) {
		console.log(`[close] Соединение закрыто, код=${event.code} причина=${event.reason}`);
	} else {
		console.log('[close] Соединение прервано');
	}
}

function onerror(error: Event) {
	console.log(`[error] ${JSON.stringify(error)}`);
}

function initTicker(callback: (bar: IBar) => void) {
	return (event: MessageEvent<string>) => {
		const msg = JSON.parse(event.data) as KlineMessage;
		const bar = {
			close: +msg.k.c,
			open: +msg.k.o,
			high: +msg.k.h,
			low: +msg.k.l,
			time: msg.k.T,
		} as IBar;

		callback(bar);
	};
}

export function startBinanceWebSocket(callback: (bar: IBar) => void) {
	const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');
	socket.onopen = onopen;
	socket.onmessage = initTicker(callback);
	socket.onclose = onclose;
	socket.onerror = onerror;
}
