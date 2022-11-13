import { onlyUser } from "#authentication";
import * as request from "#request";
import { send_success, send_error } from "#response";
import Weather from "#weather";
import { toNonAccentVietnamese } from "#util/string.js";

const view = (req, res) => {
	const params = request.require(req, ["q"]);
	if(!params) {
		res.status(422).send(send_error("Thiếu params"));
		return;
	}
	params.q = toNonAccentVietnamese(params.q);
	const weather = new Weather(params);
	weather.getLocations()
		.then((result) => {
			res.send(send_success(result));
		});
};

const middlewares = [
	onlyUser
];

export default {
	view,
	middlewares
};