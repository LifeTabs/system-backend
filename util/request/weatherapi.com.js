import axios from "axios";

const sendRequest = axios.create({
	baseURL: "http://api.weatherapi.com/v1"
});

sendRequest.interceptors.request.use(function (config) {
	// Do something before request is sent
	const API_KEY = process.env.WEATHERAPI_API_KEY;
	config.params.key = API_KEY;
	config.params.lang = "vi";
	return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});


// Add a response interceptor
sendRequest.interceptors.response.use(function (response) {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	return response;
}, function (error) {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error
	return Promise.reject(error);
});

export default sendRequest;