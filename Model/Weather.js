import adapterWeatherAPI from "#util/request/weatherapi.com.js";
import adapterOpenWeatherMap from "#util/request/openweathermap.org.js";
class Weather {
	q;
	lat;
	lon;
	currentWeather = {};
	airQuality = {};
	constructor ({ q }) {
		this.q = q;
		const [ lat, lon ] = this.q.split(",");
		this.lat = lat;
		this.lon = lon;
	}
	setCurrentWeather(params = {}) {
		return new Promise((solver) => {
			adapterWeatherAPI.get("/current.json", {
				params: {
					aqi: "yes",
					q: this.q,
					...params
				},
			})
				.then(({ data }) => {
					return data;
				})
				.then((result) => {
					this.currentWeather = result;
					if(!Object.keys(this.currentWeather?.current?.air_quality).length) {
						this.fetchAirQuality()
							.then(() => {
								solver(result);
							});
						return;
					}
					solver(result);
				});
		});
	}
	getCurrentWeather() {
		return new Promise((solver) => {
			if(Object.keys(this.currentWeather).length) {
				solver(this.currentWeather);
				return;
			}
			this.setCurrentWeather().then(() => {
				solver(this.currentWeather);
			});
		});
	}
	fetchAirQuality (params = {}) {
		return adapterOpenWeatherMap.get("/air_pollution", {
			params: {
				lat: this.lat,
				lon: this.lon,
				...params,
			}
		})
			.then(({ data }) => {
				return data;
			})
			.then((result) => {
				const air_quality = this.airQuality = this.currentWeather.current.air_quality = this.#convertAQIObject(result);
				return air_quality;
			});
	}
	#convertAQIObject (resultOpenWeatherMap) {
		const aqiData = {...resultOpenWeatherMap.list[0].components};
		aqiData["us-epa-index"] = resultOpenWeatherMap.list[0].main.aqi;
		return aqiData;
	}
}
export default Weather;