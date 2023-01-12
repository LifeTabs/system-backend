import { boots as BbJobs, buildTheDataSocket } from "#root/Model/BackgroundJobs.js";
import { sendToWorkerBgJob } from "./websocket.js";

BbJobs.up()
	.then((jobs) => {
		for (const job of jobs) {
			sendToWorkerBgJob(buildTheDataSocket(job));
		}
	});