const getSwcOptions = ({ type, coreJs }) => ({
	env: {
		targets: "> 0.25%, last 2 versions",
		mode: "usage",
		...(coreJs ? { coreJs } : {}),
	},
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
	},
	module: {
		type: type === "es" ? "es6" : "commonjs",
		// These are defaults.
		strict: false,
		strictMode: true,
		lazy: false,
		noInterop: false,
	},

	// minify: true,
});

module.exports = getSwcOptions;
