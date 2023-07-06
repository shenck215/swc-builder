const fs = require("fs");
const getProjectPath = require("./getProjectPath");

const getConfig = () => {
	const config = require("../bpoBuild.config");
	const configPath = getProjectPath("bpoBuild.config.js");
	if (fs.existsSync(configPath)) {
		const propsConfig = require(configPath);
		console.log(propsConfig)
		return {
			...config,
			...propsConfig,
		};
	}

	return config;
};
module.exports = getConfig;
