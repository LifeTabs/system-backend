
import response from "#response";
import { onlyUser } from "#authentication";
import Locations from "#root/Model/Locations.js";
const view = (req, res) => {
	const locationModel = new Locations();
	const userId = req.user.id;
	const handlers = [];
	handlers.push(locationModel.findMany({
		where: {
			userId,
		}
	}));
	handlers.push(locationModel.findFirst({
		where: {
			userId,
			isActivating: true,
		}
	}));
	Promise.all(handlers)
		.then(([locations, current_setting]) => {
			res.send(response.send_success({
				locations,
				current_setting,
			}));
		});
};

const middlewares = [
	onlyUser,
]; 

export default {
	view,
	middlewares
};