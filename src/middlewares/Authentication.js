import response from "#response";
import Users from "#users";
import { decode as jwt_decode } from "#jwt";
const isAuthenticated = async (req) => {
	if(req.get("Authorization")) {
		const currentAuth = req.get("Authorization");
		const token = currentAuth.split("Bearer ")[1];
		const res =  jwt_decode(token);
		if(res) {
			const userId = res.id;
			const UserModel = new Users();
			const user = await UserModel.findUnique({
				where: {
					id: userId
				}
			});
			if(user){
				req.user = {
					token,
					...user
				};
				return true;
			}
		}
		return false;
	}
	return false;
};

const Authentication = async (req, res, next) => {
	if(!await isAuthenticated(req, res, next)) {
		res.send(401, response.send_error("Vui lòng đăng nhập"));
		return;
	}
	next();
};

const onlyGuess = async (req, res, next) => {
	if(await isAuthenticated(req, res, next)) {
		res.send(405, response.send_error("Chỉ dành cho khách!"));
		return;
	}
	next();
};

const onlyUser = async (req, res, next) => {
	if(!await isAuthenticated(req, res, next)) {
		res.send(401, response.send_error("Vui lòng đăng nhập!"));
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