import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function Locations () {
	const prismaLocation = prisma.location;
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
	};
	const location = new Proxy(prismaLocation, {
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
	return location;
}
export default Locations;