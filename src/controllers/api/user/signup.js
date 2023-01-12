import Users from "#users";
import response from "#response";
import { onlyGuess } from "#authentication";
import * as request from "#util/request.js";
import md5 from "md5";

const view = (req, res) => {
	const data = {};
	const params = request.only(req, ["email", "password", "subscription"]);
	if(params.email) data.email = params.email;
	if(params.password) data.password = md5(params.password);
	if(params.subscription) data.Subscribers = {
		create: {
			uri_notification: JSON.stringify(params.subscription)
		}
	};
	const newUser = new Users();
	newUser.createUser(data)
		.then((user) => {
			const data = {
				user
			};
			res.send(response.send_success(data));
		});
};

const middlewares = [
	onlyGuess,
];


export default {
	view,
	middlewares,
};