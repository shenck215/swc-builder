const fs = require("fs");
const getProjectPath = require("./getProjectPath");

const getConfig = () => {
	const config = require("../swcBuild.config");
	const configPath = getProjectPath("swcBuild.config.js");
	if (fs.existsSync(configPath)) {
		const propsConfig = require(configPath);
		
		return {
			...config,
			...propsConfig,
		};
	}

	return config;
};
module.exports = getConfig;
