const path = require("path");

const cwd = process.cwd();

const getProjectPath = (...filePath) => {
	return path.join(cwd, ...filePath);
};

module.exports = getProjectPath;
