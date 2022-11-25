import * as request from "#request";
import response from "#response";
import { onlyUser } from "#authentication";
import Events from "#root/Model/Event.js";
import { canModify } from "#root/src/middlewares/Event.js";

const view = (req, res) => {
	const eventModel = new Events();
	eventModel.findMany(
		{
			where: {
				OR: [
					{
						userId: req.user.id
					},
					{
						userId: null
					}
				]
			}
		}
	)
		.then((events) => {
			res.send(response.send_success(events));
		});
};

const create = (req, res) => {
	const eventModel = new Events();
	const required = request.require(req, ["name","full_date", "date", "type_time", "schedule"]);
	const only = request.only(req, ["description"]);
	const defaultParams = {
		country: "vi",
  	priority: 0,
  	userId: req.user.id
	};
	if(!required) {
		res.status(422).send(response.send_error("Thiếu params"));
		return;
	}
	const params = {...required, ...only, ...defaultParams};
	eventModel.create({
		data: params,
	})
		.then((event) => {
			res.send(response.send_success(event));
		});
};

const update = async (req, res) => {
	const params  = request.only(req, ["name","full_date", "date", "type_time", "schedule", "description"]);
	const eventModel = new Events();
	eventModel.update({
		where: {
			id: req.event.id,
		},
		data: params,
	})
		.then((event) => {
			res.send(response.send_success(event));
		});
};

const deleteEvent = (req, res) => {
	const eventModel = new Events();
	eventModel.delete({
		where: {
			id: req.event.id,
		},
	})
		.then((event) => {
			res.send(response.send_success(event));
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
		view: deleteEvent,
		middlewares: middlewaresModify,
	},
};