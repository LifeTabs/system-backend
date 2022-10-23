import jwt from "jsonwebtoken";
const encode = (payload) => {
	const SECRET = process.env.JWT_KEY_SECRET;
	const expiresIn = 1000 * 60 * 60 * 24 * 30; // Expire in 1 month
	const token = jwt.sign(payload, SECRET, {
		expiresIn,
	});
	return token;
};

const decode = (token) => {
	const SECRET = process.env.JWT_KEY_SECRET;
	try{
		const data = jwt.verify(token, SECRET);
		return data;
	}
	catch(e) {
		return false;
	}
};

export {
	encode,
	decode
};