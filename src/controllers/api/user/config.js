
import response from "#response";
import { onlyUser } from "#authentication";
import Locations from "#root/Model/Locations.js";
import Unit from "#root/Model/Unit.js";
const view = (req, res) => {
	const locationModel = new Locations();
	const unitModel = new Unit();
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
	handlers.push(unitModel.findUnique({
		where: {
			userId,
		},
	}));
	Promise.all(handlers)
		.then(([locations, current_setting, unitData]) => {
			const location = {};
			location.locations = locations;
			location.current_setting = current_setting;
			const unit = {};
			unit.current_setting = unitData;
			res.send(response.send_success({location,unit}));
		});
};

const middlewares = [
	onlyUser,
]; 

export default {
	view,
	middlewares
};