import adapterWeatherAPI from "#util/request/weatherapi.com.js";
import adapterOpenWeatherMap from "#util/request/openweathermap.org.js";
class Weather {
	q;
	lat;
	lon;
	currentWeather = {};
	airQuality = {};
	currentAstronomy = {};
	forecastData = {};
	locationData = {};
	params;
	constructor ({ q,...params }) {
		this.q = q;
		this.params = params;
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
					if(!Object.keys(this.currentWeather?.current?.air_quality ?? {}).length) {
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
	setCurrentAstronomy(params = {}) {
		return new Promise((solver) => {
			adapterWeatherAPI.get("/astronomy.json", {
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
					this.currentAstronomy = result;
					solver(result);
				});
		});
	}
	setForecast(params = {}) {
		return new Promise((solver) => {
			adapterWeatherAPI.get("/forecast.json", {
				params: {
					q: this.q,
					...params
				},
			})
				.then(({ data }) => {
					return data;
				})
				.then((result) => {
					this.forecastData = result;
					solver(result);
				});
		});
	}
	setLocationSearch(params = {}) {
		return new Promise((solver) => {
			adapterWeatherAPI.get("/search.json", {
				params: {
					q: this.q,
					...params
				},
			})
				.then(({ data }) => {
					return data;
				})
				.then((result) => {
					this.locationData = result;
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
			this.setCurrentWeather(this.params).then(() => {
				solver(this.currentWeather);
			});
		});
	}
	getCurrentAstronomy() {
		return new Promise((solver) => {
			if(Object.keys(this.currentAstronomy).length) {
				solver(this.currentAstronomy);
				return;
			}
			this.setCurrentAstronomy(this.params).then(() => {
				solver(this.currentAstronomy);
			});
		});
	}
	getForecast() {
		return new Promise((solver) => {
			if(Object.keys(this.forecastData).length) {
				solver(this.forecastData);
				return;
			}
			this.setForecast(this.params).then(() => {
				solver(this.forecastData);
			});
		});
	}
	getLocations() {
		return new Promise((solver) => {
			if(Object.keys(this.locationData).length) {
				solver(this.locationData);
				return;
			}
			this.setLocationSearch(this.params).then(() => {
				solver(this.locationData);
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