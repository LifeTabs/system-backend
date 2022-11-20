// import * as request from "#request";
import response from "#response";
import { onlyUser } from "#authentication";
import Events from "#root/Model/Event.js";
import { canModify } from "#root/src/middlewares/Shortcut.js";

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

const create = () => {
	
};

const update = async () => {
};

const deleteEvent = () => {
	
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