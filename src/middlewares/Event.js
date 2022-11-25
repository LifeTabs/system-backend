import Event from "#root/Model/Event.js";
import * as request from "#request";
import { send_error } from "#response";
const canModify = (req, res, next) => {
	const params = request.require(req, ["id"]);
	if(!params) {
		res.status(422).send(send_error("Thiếu params"));
		return;
	}
	const userId = req.user.id;
	const eventsModel = new Event();
	eventsModel.findUnique({
		where: {
			isOwner: {
				id: parseInt(params.id),
				userId,
			}
		}
	})
		.then((_) => {
			if(!_) return res.status(403).send(send_error("Không đủ quyền vào tài nguyên này"));
			req.event = _;
			next();
		});
};

export {
	canModify
};