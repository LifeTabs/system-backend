import * as request from "#request";
import response from "#response";
import { onlyUser } from "#authentication";
import Locations from "#root/Model/Locations.js";
import { canModify } from "#root/src/middlewares/Location.js";
const create = (req, res) => {
	const locationModel = new Locations();
	const params = request.require(req, ["location"]);
	if(!params) {
		res.status(422).send(response.send_error("Thiếu params"));
		return;
	}
	const userId = req.user.id;
	locationModel.create({
		data: {
			userId,
			...params
		},
	})
		.then((location) => {
			res.send(response.send_success(location));
		});
};

const update = async (req, res) => {
	const params = request.only(req, ["id", "location", "isActivating"]);
	const locationModel = new Locations();
	if(params.isActivating) {
		await locationModel.updateMany({
			where: {
				userId: req.location.userId,
				isActivating: true
			},
			data: {
				isActivating: false,
			}
		});
	}
	locationModel.update({
		where: {
			id: parseInt(params.id),
		},
		data: {
			isActivating: params.isActivating,
			location: params.location,
		}    
	})
		.then((location) => {
			res.send(response.send_success(location));
		});
};

const deleteLocation = (req, res) => {
	const params = request.only(req, ["id"]);
	const locationModel = new Locations();
	locationModel.delete({
		where: {
			id: parseInt(params.id),
		},
	})
		.then((location) => {
			res.send(response.send_success(location));
		});
};

const resetLocation = (req, res) => {
	const locationModel = new Locations();
	locationModel.updateMany({
		where: {
			userId: parseInt(req.user.id),
			isActivating: true,
		},
		data: {
			isActivating: false,
		}
	})
		.then((location) => {
			res.send(response.send_success(location));
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
	create: {
		view: create,
		middlewares
	},
	update: {
		view: update,
		middlewares: middlewaresModify,
	},
	delete: {
		view: deleteLocation,
		middlewares: middlewaresModify,
	},
	reset: {
		view: resetLocation,
		middlewares,
	},
};