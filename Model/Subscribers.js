import { PrismaClient } from "@prisma/client";
// import { sendToWorkerBgJob } from "#util/websocket.js";
const prisma = new PrismaClient();

function Subscribers () {
	const prismaSubscribers = prisma.Subscribers;
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
				prismaSubscribers.create.apply(prismaSubscribers, args)
					.then((res) => {
						prismaSubscribers.findFirst({
							where: {
								userId: res.userId,
								timeOut: {
									gt: new Date(),
								}
							},
							include: {
								Subscribers: {
									uri_notification: true,
								}
							},
							orderBy: {
								timeOut: "DESC",
							}
						})
							.then((res) => {
								solver();
								console.log(res);
								// sendToWorkerBgJob(res);
							});
					})
					.catch((err) => reject(err));
			});
		}
	};
	const event = new Proxy(prismaSubscribers, {
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
export default Subscribers;