import { onlyUser } from "#authentication";
import sendRequest from "#sendRequest";
import { send_success } from "#response";

const view = (req, res) => {
	const BASE_URL_SHARE = "https://api.vietstock.vn/finance/toptrading";
	const request= sendRequest.get(BASE_URL_SHARE, {
		params: {
			type: 7,
			catID: 1
		},
		headers: {
			Referer: "https://finance.vietstock.vn/"
		}
	});
	request
		.then(({ data }) => {
			const result = data.map((share) => {
				return {
					code: share.StockCode,
					price: share.ClosePrice,
					change: share.Change,
					perChange: share.PerChange
				};
			});
			return result;
		})
		.then((result) => {
			res.send(send_success(result));
		});
};

const middlewares = [
	onlyUser
];

export default {
	view,
	middlewares
};