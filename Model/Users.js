import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import md5 from "md5";
import Unit from "./Unit.js";
// import Model from "./Model.js"
const prisma = new PrismaClient();

function Users () {
	const prismaUser = prisma.user;
	const cast2Hash = [
		"password"
	];
	const createHash = (params) => {
		cast2Hash.forEach(hash => {
			if(Object.getOwnPropertyNames.call(params, hash)){
				params[hash] = md5(params[hash]);
			}
		});
		return params;
	};
	const createUnit = (user) => {
		const unitModel = new Unit();
		return unitModel.create({
			data: {
				userId: user.id,
				unit: {
					temp: "c",
					windy: "kph",
					pressure: "in",
					precip: "mm",
				},
			}
		});
	};
	const boots = [
		createUnit
	];
	const callbacks = {
		update (params) {
			const res = createHash(params.data);
			params.data = res;
			return params;
		},
		findMany(params) {
			const res = createHash(params.where);
			params.where = res;
			return params;
		}
	};
	const overWrites = {
		createUser (params = {}) {
			const handler = new Promise((solver) => {
				prismaUser.create({
					data: {
						uuid: uuid(),
						...params
					}
				})
					.then((user) => {
						const handlers = [];
						boots.forEach(boot => {
							handlers.push(boot(user));
						});
						Promise.all(handlers)
							.then(() => {
								solver(user);
							});
						return user;
					});
			});
			return handler;
		}
	};
	const user = new Proxy(prismaUser, {
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
	return user;
}
export default Users;