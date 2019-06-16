import app from "./app";

/*
Firing up express server
*/

const server = app.listen(app.get("port"), () => {
	console.log("App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
	console.log("Press Ctrl+C to stop the server");
});

export default server;