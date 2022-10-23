import Users from "#users";
import response from "#response";
import * as request from "#request";
import { encode as jwt_encode } from "#jwt";
import { onlyGuess } from "../../../middlewares/Authentication.js";

const params = [
	"email",
	"password"
];

const handlerLoginFailed = ({ res }) => {
	res.status(405).send(response.send_error("Sai thông tin đăng nhập!"));
};

const loginAsToken = (req, res) => {
	const user = Users();
	const uuid = req.param("uuid");
	user.findUnique({
		where: {
			uuid
		}
	})
		.then((user) => {
			if(user) {
				const token = jwt_encode(user);
				const data = {
					user,
					token
				};
				res.send(response.send_success(data));
				return;
			}
			handlerLoginFailed({res});
		});
};


const loginAsCredential = (req, res) => {
	const user = Users();
	const onlyParams = request.only(req, params);
	user.findMany({
		where: onlyParams,
	})
		.then((users) => {
			const user = users[0];
			if(user){
				const token = jwt_encode(user);
				const data = {
					user,
					token
				};
				res.send(response.send_success(data));
				return;
			}
			handlerLoginFailed({res});
		});
};

const view = (req, res) => {
	if(req.param("uuid")) {
		loginAsToken(req, res);
	}
	else {
		loginAsCredential(req, res);
	}
};

const middlewares = [
	onlyGuess,
];


export default {
	view,
	middlewares,
};