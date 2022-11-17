import * as request from "#request";
import response from "#response";
import { onlyUser } from "#authentication";
import Shortcuts from "#root/Model/Shortcut.js";
import { canModify } from "#root/src/middlewares/Location.js";
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
	const fileName = `${userId}_${uuidFunc()}.png`;
	const pathDB = `/favicon/${fileName}`;
	const pathSave = `./storage${pathDB}`;
	sendRequest.get(process.env.URL_GET_FAVICON, {
		params: {
			domain: params.url,
			sz: 128,
		},
		responseType: "stream",
	})
		.then((result) => {
			result.data.pipe(fs.createWriteStream(pathSave));
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

const update = async () => {
	
};

const deleteShortcut = () => {
	
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