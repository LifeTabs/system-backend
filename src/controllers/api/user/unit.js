import * as request from "#request";
import response from "#response";
import { onlyUser } from "#authentication";
import Unit from "#root/Model/Unit.js";

const update = async (req, res) => {
	const params = request.only(req, ["unit"]);
	const unitModel = new Unit();
	const unitSetting = await unitModel.findUnique({
		where: {
			userId: req.user.id
		}
	});
	if(unitSetting){
		const result = await unitModel.update({
			where: {
				userId: req.user.id,
			},
			data: {
				...params
			}
		});
		res.send(response.send_success(result));
		return;
	}
	const result = await unitModel.create({
		data: {
			...params,
			userId: req.user.id,
		}
	});
	res.send(response.send_success(result));
};


const middlewares = [
	onlyUser,
]; 

export default {
	update: {
		view: update,
		middlewares,
	},
};