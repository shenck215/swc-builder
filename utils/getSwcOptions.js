const checkType = require("./checkType");

const moduleTypes = {
	es: "es6",
	lib: "commonjs",
	amd: "amd",
	umd: "umd",
};

const getAmdConfig = (type, moduleId) => {
	if (type === "amd" && moduleId) {
		return {
			moduleId,
		};
	}
	return {};
};

const getUmdConfig = (type, globals) => {
	if (type === "umd" && checkType(globals) === "Object") {
		return globals;
	}
	return {};
};

const getSwcOptions = ({ type, coreJs, moduleId, globals }) => ({
	...(coreJs
		? {
				env: {
					targets: "> 0.25%, last 2 versions",
					mode: "usage",
					coreJs,
				},
		  }
		: {}),
	jsc: {
		target: "es2015",
		parser: {
			syntax: "typescript",
			tsx: true,
		},
		transform: {
			react: {
				runtime: "automatic",
			},
		},
		minify: {
			compress: {
				unused: true,
			},
			mangle: true,
		},
	},
	module: {
		type: moduleTypes[type],
		...getAmdConfig(type, moduleId),
		...getUmdConfig(type, globals),
		// These are defaults.
		strict: false,
		strictMode: true,
		lazy: false,
		noInterop: false,
	},

	minify: true,
});

module.exports = getSwcOptions;
