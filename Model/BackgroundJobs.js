import { PrismaClient } from "@prisma/client";
import { sendToWorkerBgJob } from "#util/websocket.js";
const prisma = new PrismaClient();

function BackgroundJobs () {
	const prismaBgJob = prisma.BackgroundJobs;
	const callbacks = {
		update (params) {
			// const res = createHash(params.data);
			// params.data = res;
			return params;
		},
		findMany(params) {
			// const res = createHash(params.where);
			// params.where = res;
			return params;
		}
	};
	const overWrites = {
		create(...args) {
			return new Promise((solver, reject) => {
				prismaBgJob.create.apply(prismaBgJob, args)
					.then((res) => {
						return prismaBgJob.findFirst({
							where: {
								Event: {
									full_date: {
										gt: new Date() 
									},
									userId: res.userId,
								}
							},
							include: {
								Event: {
									include:{
										User: {
											include: {
												Subscribers: true,
											}
										},
									},
								},
							},
							orderBy: {
								Event: {
									full_date: "asc"
								}
							},
							distinct: ["userId"]
						});
					})
					.then((event)=> {
						sendToWorkerBgJob(event);
					})
					.catch((err) => reject(err));
			});
		},
	};
	const event = new Proxy(prismaBgJob, {
		get (target, key) {
			/**
       * // TODO Binding new function
       * @param  {...any} args Get all args from function
       * @returns function
       */
			const handler = (...args) => {
				const func = overWrites[key] ? overWrites[key] : target[key];
				return func.apply(target, callbacks[key] ? [callbacks[key](...args)] : args);
			};
			return handler;
		}
	});
	return event;
}

const boots = {
	up () {
		const BackgroundJobsModel = new BackgroundJobs();
		return BackgroundJobsModel.findMany({
			where: {
				Event: {
					full_date: {
						gt: new Date() 
					}
				}
			},
			include: {
				Event: {
					include:{
						User: {
							include: {
								Subscribers: true,
							}
						},
					},
				},
			},
			orderBy: {
				Event: {
					full_date: "asc"
				}
			},
			distinct: ["userId"]
		});
	}
};

const buildTheDataSocket = (record) => {
	const { Event, Event: { User: Subscribers }, ...bgJob } = record;
	const res = {
		...bgJob,
		Event,
		Subscribers,
	};
	return res;
};

export { boots, buildTheDataSocket, };
export default BackgroundJobs;