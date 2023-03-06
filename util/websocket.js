import WebSocket from "ws";

const ws = new WebSocket(`${process.env.WORKER_WEBSOCKET_ENDPOINT}/system-backend`, {
	headers: {
		"X-BACKEND-KEY-PAIR": process.env.KEY_PAIR_WORKER
	}
});

let isReady = false;

const onReady = () => {
	return new Promise((solver) => {
		ws.on("open", () =>{
			isReady = true;
			solver();
		});
	});
};

const sendToWorkerBgJob = (json) => {
	console.log(json);
	const send = (json) => ws.send(JSON.stringify(json));
	if(isReady)
		send(json);
	else
		onReady().then(() => {
			send(json);
		});
};

onReady(); // Init connection

export {
	sendToWorkerBgJob,
	onReady,
	ws,
};