import * as request from "#request";
import response from "#response";
import { onlyUser } from "#authentication";
import Shortcuts from "#root/Model/Shortcut.js";
import { canModify } from "#root/src/middlewares/Shortcut.js";
import workerAPI from "#util/request/worker.js";
import fs from "fs";

const view = (req, res) => {
	const shortcutModel = new Shortcuts();
	shortcutModel.findMany(
		{
			where: {
				userId: req.user.id
			}
		}
	)
		.then((shortcut) => {
			res.send(response.send_success(shortcut));
		});
};

const create = (req, res) => {
	const shortcutModel = new Shortcuts();
	const params = request.require(req, ["url", "name"]);
	const userId = req.user.id;
	if(!params) {
		res.status(422).send(response.send_error("Thiếu params"));
		return;
	}
	getFavicon(params.url, userId)
		.then(({pathDB}) => {
			shortcutModel.create({
				data: {
					userId,
					imageUrl: pathDB,
					...params
				},
			})
				.then((shortcut) => {
					res.send(response.send_success(shortcut));
				});
		});
};

const update = async (req,res) => {
	const shortcutModel = new Shortcuts();
	const params = request.require(req, ["url", "name"]);
	const paramsOption = request.only(req, ["isPin"]);
	const userId = req.shortcut.userId;
	if(!params) {
		if(paramsOption.isPin !== null) {
			shortcutModel.update({
				where: {
					id: req.shortcut.id,
				},
				data: {
					...paramsOption,
				}    
			})
				.then((location) => {
					res.send(response.send_success(location));
				});
			return;
		}
		res.status(422).send(response.send_error("Thiếu params"));
		return;
	}
	fs.unlinkSync(`./storage${req.shortcut.imageUrl}`);
	getFavicon(params.url, userId)
		.then(({ pathDB }) => {
			return shortcutModel.update({
				where: {
					id: req.shortcut.id,
				},
				data: {
					imageUrl: pathDB,
					...params,
					...paramsOption,
				}    
			});
		})
		.then(async (shortcut) => {
			await workerAPI.delete("/favicon", {
				params: {
					id: req.shortcut.imageUrl
				}
			});
			return shortcut;
		})
		.then((shortcut) => {
			res.send(response.send_success(shortcut));
		});
};

const deleteShortcut = (req, res) => {
	const shortcutModel = new Shortcuts();
	shortcutModel.delete({
		where: {
			id: req.shortcut.id,
		}   
	})
		.then(async (shortcut) => {
			await workerAPI.delete("/favicon", {
				params: {
					id: shortcut.imageUrl
				}
			});
			return shortcut;
		})
		.then((shortcut) => {
			res.send(response.send_success(shortcut));
		});
};

const getFavicon = (url) => {
	return new Promise((resolve, reject) => {
		const createURL = (urlStr) => {
			const url = new URL(process.env.URL_GET_FAVICON);
			url.search = new URLSearchParams({
				domain: urlStr,
				sz: 128,
			}).toString();
			return url.href;
		};
		workerAPI.post("/favicon/", {
			url: createURL(url)
		})
			.then((result) => {
				if(result.data.status) {
					resolve({pathDB: result.data.data.id});
				}
				else {
					reject(result.data);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};


const middlewares = [
	onlyUser,
]; 

const middlewaresModify = [
	...middlewares,
	canModify,
];
export default {
	view: {
		view,
		middlewares,
	},
	create: {
		view: create,
		middlewares
	},
	update: {
		view: update,
		middlewares: middlewaresModify,
	},
	delete: {
		view: deleteShortcut,
		middlewares: middlewaresModify,
	},
};