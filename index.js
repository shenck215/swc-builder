const gulp = require("gulp");

require("./gulpfile");

// Start glup task
function runTask(toRun) {
	const taskInstance = gulp.task(toRun);
	try {
		taskInstance.apply(gulp);
	} catch (err) {
		console.log(err);
	}
}

runTask("default");
