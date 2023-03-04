import { PrismaClient } from "@prisma/client";
import BackgroundJobs from "./BackgroundJobs.js";
// import { ws } from "#util/websocket.js";
const prisma = new PrismaClient();

function Events () {
	const prismaEvent = prisma.event;
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
				prismaEvent.create.apply(prismaEvent, args)
					.then((res) => {
						const BgJob = new BackgroundJobs();
						BgJob.create({
							data: {
								eventId: res.id,
								userId: res.userId,
							}
						});
						solver(res);
					})
					.catch((err) => reject(err));
			});
		},
		update(...args) {
			return new Promise((solver, reject) => {
				return prismaEvent.update.apply(prismaEvent, args)
					.then((res) => {
						const BgJob = new BackgroundJobs();
						BgJob.refresh(res)
							.then(() => {
								solver(res);
							});
					})
					.catch((err) => reject(err));
			});
		},
		delete(...args) {
			return new Promise((solver, reject) => {
				return prismaEvent.delete.apply(prismaEvent, args)
					.then((res) => {
						const BgJob = new BackgroundJobs();
						BgJob.refresh(res)
							.then(() => {
								solver(res);
							});
					})
					.catch((err) => reject(err));
			});
		},
	};
	const event = new Proxy(prismaEvent, {
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
export default Events;