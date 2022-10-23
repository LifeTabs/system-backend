const send_success = (data, message) => {
	return {
		success: true,
		data,
		message: message || ""
	};
};

const send_error = (errors) => {
	return {
		success: false,
		errors,
	};
};

export default {
	send_success,
	send_error
};

export {
	send_success,
	send_error
};