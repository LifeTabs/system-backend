import * as request from "#request";
import response from "#response";
import { onlyUser } from "#authentication";
import Shortcuts from "#root/Model/Shortcut.js";
import { canModify } from "#root/src/middlewares/Shortcut.js";
import sendRequest from "#util/request/outbound.js";
import fs from "fs";
import { v4 as uuidFunc } from "uuid";

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
			shortcutModel.update({
				where: {
					id: req.shortcut.id,
				},
				data: {
					imageUrl: pathDB,
					...params,
					...paramsOption,
				}    
			})
				.then((location) => {
					res.send(response.send_success(location));
				});
		});
};

const deleteShortcut = (req, res) => {
	const shortcutModel = new Shortcuts();
	fs.unlinkSync(`./storage${req.shortcut.imageUrl}`);
	shortcutModel.delete({
		where: {
			id: req.shortcut.id,
		}   
	})
		.then((location) => {
			res.send(response.send_success(location));
		});
};

const getFavicon = (url, userId) => {
	return new Promise((resolve, reject) => {
		const fileName = `${userId}_${uuidFunc()}.png`;
		const pathDB = `/favicon/${fileName}`;
		const pathSave = `./storage${pathDB}`;
		sendRequest.get(process.env.URL_GET_FAVICON, {
			params: {
				domain: url,
				sz: 128,
			},
			responseType: "stream",
		})
			.then((result) => {
				result.data.pipe(fs.createWriteStream(pathSave));
				resolve({pathDB});
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