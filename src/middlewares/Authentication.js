import response from "#response";
import { decode as jwt_decode } from "#jwt";
const isAuthenticated = (req) => {
	if(req.get("Authorization")) {
		const currentAuth = req.get("Authorization");
		const token = currentAuth.split("Bearer ")[1];
		const res =  jwt_decode(token);
		if(res) {
			req.user = {
				token,
				...res
			};
		}
		return res ? true : false;
	}
	return false;
};

const Authentication = (req, res, next) => {
	if(!isAuthenticated(req, res, next)) {
		res.send(401, response.send_error("Vui lòng đăng nhập"));
		return;
	}
	next();
};

const onlyGuess = (req, res, next) => {
	if(isAuthenticated(req, res, next)) {
		res.send(405, response.send_error("Chỉ dành cho khách!"));
		return;
	}
	next();
};

const onlyUser = (req, res, next) => {
	if(!isAuthenticated(req, res, next)) {
		res.send(405, response.send_error("Vui lòng đăng nhập!"));
		return;
	}
	next();
};


export default isAuthenticated;

export {
	isAuthenticated,
	Authentication,
	onlyGuess,
	onlyUser
};