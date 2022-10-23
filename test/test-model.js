import Users from "../Model/Users.js";
const user = new Users();
user.test.create_user()
	.then(async () => {
		const data = await user.test.createUser();
		console.log(data);
	});
