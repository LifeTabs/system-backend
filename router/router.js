import home from "../src/controllers/home.js";
import signup from "../src/controllers/api/user/signup.js";
import login from "../src/controllers/api/user/login.js";
import updateUser from "../src/controllers/api/user/update.js";
import UserInfo from "../src/controllers/api/user/info.js";
import ShareToday from "../src/controllers/api/share/today.js";
import currentWeather from "../src/controllers/api/weather/current-weather.js";
import currentAstronomy from "../src/controllers/api/weather/current-astronomy.js";
import forecast from "../src/controllers/api/weather/forecast.js";
import locationSearch from "../src/controllers/api/weather/location-search.js";

const routers = [
	{
		method: "get",
		path: "/",
		controller: home
	},
	{
		method: "post",
		path: "/api/user/signup",
		controller: signup
	},
	{
		method: "post",
		path: "/api/user/login",
		controller: login
	},
	{
		method: "patch",
		path: "/api/user",
		controller: updateUser
	},
	{
		method: "get",
		path: "/api/user",
		controller: UserInfo
	},
	{
		method: "get",
		path: "/api/share/today",
		controller: ShareToday
	},
	{
		method: "get",
		path: "/api/weather/current",
		controller: currentWeather
	},
	{
		method: "get",
		path: "/api/weather/astronomy",
		controller: currentAstronomy
	},
	{
		method: "get",
		path: "/api/weather/forecast",
		controller: forecast
	},
	{
		method: "get",
		path: "/api/weather/location-search",
		controller: locationSearch
	},
];
export default routers;