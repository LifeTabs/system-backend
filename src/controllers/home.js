const view = (req, res) => {
	res.send("OK");
};

const middlewares = [
	(req, res, next) => {
		next();
	},

];
export default {
	view,
	middlewares
};