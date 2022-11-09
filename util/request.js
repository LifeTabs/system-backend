const only = (req, params = []) => {
	const data = {};
	params.forEach((param) => {
		data[param] = req.param(param);
	});
	return data;
};

const require = (req, params = []) => {
	const data = {};
	let t = true;
	for(let param of params) {
		const _ = req.param(param);
		if(_) data[param] = _;
		else {
			t = false;
			break;
		}
	}
	if(t) return data;
	return null;
};

export {
	only,
	require
};