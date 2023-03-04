import app from "./server.js";

const PORT_SERVER = process.env.PORT || 3000;

app.listen(PORT_SERVER, () => {
	console.log("Server is running!");
});