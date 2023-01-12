import * as request from "#request";
import response from "#response";
import { onlyUser } from "#authentication";
import Subscribers from "#root/Model/Subscribers.js";
const create = (req, res) => {
	const subscribersModel = new Subscribers();
	const params = request.require(req, ["uri_notification"]);
	if(!params) {
		res.status(422).send(response.send_error("Thiếu params"));
		return;
	}
	const userId = req.user.id;
	subscribersModel.create({
		data: {
			userId,
			...params
		},
	})
		.then((subscription) => {
			res.send(response.send_success(subscription));
		});
};



const middlewares = [
	onlyUser,
]; 

export default {
	create: {
		view: create,
		middlewares
	},
};