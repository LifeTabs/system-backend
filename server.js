import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import moment from "moment";
import routers from "./router/router.js";
import rateLimitRequest from "./util/rateLimitRequest.js";
import response from "#response";
dotenv.config();
const app = express();
const PORT_SERVER = 3000;
const MAX_AGE_CACHE = 60*60*24*30; // 1 month = 2592000 s

/**
 * //TODO Using libraries for expressjs
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimitRequest);
app.use(cors()); // Enable cors for all origins
app.use(express.static("storage",{
	setHeaders: function(res) {
		res.set("Pragma", "public");
		res.set("Cache-Control", `max-age=${MAX_AGE_CACHE}`);
		res.set("Expires", moment(new Date().getTime() + MAX_AGE_CACHE *1000).format("ddd, DD MMM YYYY HH:mm:ss")+" GMT");
	}
}));

/**
 // TODO Dynamic router, middleware
 * Author: Ily1606
 */
routers.forEach((router) => {
	app[router.method](router.path, ...router.controller.middlewares, router.controller.view);
});

/**
 * // TODO Try catch errors from expressjs
 */

// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
	console.error(err);
	res.status(500).send(response.send_error("Something went wrong!")).end();
});

app.listen(PORT_SERVER, () => {
	console.log("Server is running!");
});