import Locations from "#root/Model/Locations.js";
import * as request from "#request";
import { send_error } from "#response";
const canModify = (req, res, next) => {
	const params = request.require(req, ["id"]);
	if(!params) {
		res.status(422).send(send_error("Thiếu params"));
		return;
	}
	const userId = req.user.id;
	const LocationsModel = new Locations();
	LocationsModel.findUnique({
		where: {
			isOwner: {
				id: parseInt(params.id),
				userId,
			}
		}
	})
		.then((_) => {
			if(!_) return res.status(403).send(send_error("Không đủ quyền vào tài nguyên này"));
			req.location = _;
			next();
		});
};

export {
	canModify
};