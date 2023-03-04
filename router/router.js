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
import userConfig from "../src/controllers/api/user/config.js";
import location from "../src/controllers/api/user/location.js";
import unit from "../src/controllers/api/user/unit.js";
import shortcut from "../src/controllers/api/shortcut/shortcut.js";
import event from "../src/controllers/api/event/event.js";
import subscriber from "../src/controllers/api/user/subscriber.js";

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
	{
		method: "get",
		path: "/api/user/config",
		controller: userConfig
	},
	{
		method: "post",
		path: "/api/user/location",
		controller: location.create
	},
	{
		method: "patch",
		path: "/api/user/location",
		controller: location.update
	},
	{
		method: "delete",
		path: "/api/user/location",
		controller: location.delete
	},
	{
		method: "patch",
		path: "/api/user/reset-location",
		controller: location.reset
	},
	{
		method: "patch",
		path: "/api/user/unit",
		controller: unit.update
	},
	{
		method: "post",
		path: "/api/user/subscriber",
		controller: subscriber.create
	},
	{
		method: "get",
		path: "/api/shortcut",
		controller: shortcut.view
	},
	{
		method: "post",
		path: "/api/shortcut",
		controller: shortcut.create
	},
	{
		method: "patch",
		path: "/api/shortcut",
		controller: shortcut.update
	},
	{
		method: "delete",
		path: "/api/shortcut",
		controller: shortcut.delete
	},
	{
		method: "get",
		path: "/api/event",
		controller: event.view
	},
	{
		method: "post",
		path: "/api/event",
		controller: event.create
	},
	{
		method: "patch",
		path: "/api/event",
		controller: event.update
	},
	{
		method: "delete",
		path: "/api/event",
		controller: event.delete
	},
];
export default routers;