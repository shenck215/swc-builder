const gulp = require("gulp");
const chalk = require("chalk");
const del = require("del");
const swc = require("gulp-swc");
const tsc = require("gulp-typescript");
const postcss = require("gulp-postcss");
const less = require("postcss-less");
const autoprefixer = require("autoprefixer");
const checkType = require("./utils/checkType");
const getConfig = require("./utils/getConfig");
const getDiffTime = require("./utils/getDiffTime");
const getSwcOptions = require("./utils/getSwcOptions");
const getTsCompilerOptions = require("./utils/getTsCompilerOptions");

const config = getConfig();

const {
	baseUrl,
	es,
	lib,
	amd,
	moduleId,
	umd,
	globals,
	style,
	ts,
	tsConfig,
	coreJs,
} = config;

const esOutput = checkType(es) === "String" ? es : "./es";
const libOutput = checkType(lib) === "String" ? lib : "./lib";
const amdOutput = checkType(amd) === "String" ? amd : "./amd";
const umdOutput = checkType(umd) === "String" ? umd : "./umd";
const tsOutput = checkType(ts) === "String" ? ts : "./types";

const outputs = {
	es: esOutput,
	lib: libOutput,
	amd: amdOutput,
	umd: umdOutput,
	ts: tsOutput,
};

const {
	typeRoots: propsTypeRoots,
	paths,
} = tsConfig

const typeRoots = [
	"node_modules/@types",
	"../node_modules/@types",
	"../../node_modules/@types",
];

if (propsTypeRoots && checkType(propsTypeRoots) === "Array") {
	propsTypeRoots.forEach((item) => {
		typeRoots.push(item);
	});
}

let startTime = 0;

const build = (type, cb) => {
	console.log(chalk.yellow(`Start building ${type}...`));
	const start = process.hrtime();
	gulp
		.src([
			`${baseUrl}/**/*.jsx`,
			`${baseUrl}/**/*.js`,
			`${baseUrl}/**/*.tsx`,
			`${baseUrl}/**/*.ts`,
			`!${baseUrl}/**/*.d.ts`,
		])
		.pipe(swc(getSwcOptions({ type, coreJs, moduleId, globals })))
		.on("error", () => {})
		.pipe(gulp.dest(outputs[type]))
		.on("end", () => {
			cb();
			const times = getDiffTime(start);
			console.log(
				chalk.blueBright(`Build ${type} completed`),
				chalk.magenta(`(${times})`)
			);
		});
};

gulp.task("clean", (done) => {
	startTime = process.hrtime();
	del.sync(Object.values(outputs));
	done();
});

gulp.task("swc:es", (done) => {
	build("es", done);
});

gulp.task("swc:lib", (done) => {
	build("lib", done);
});

gulp.task("swc:amd", (done) => {
	build("amd", done);
});

gulp.task("swc:umd", (done) => {
	build("umd", done);
});

gulp.task("tsc", (done) => {
	console.log(chalk.yellow("Start generating type file..."));
	const start = process.hrtime();
	gulp
		.src([`${baseUrl}/**/*.tsx`, `${baseUrl}/**/*.ts`, `!${baseUrl}/**/*.style.ts`])
		.pipe(
			tsc(
				getTsCompilerOptions({
					typeRoots,
					paths,
				})
			)
		)
		.on("error", () => {})
		.dts.pipe(gulp.dest(tsOutput))
		.on("end", () => {
			done();
			const times = getDiffTime(start);
			console.log(
				chalk.blueBright("Generate type file completed"),
				chalk.magenta(`(${times})`)
			);
		});
});

gulp.task("less", (done) => {
	console.log(chalk.yellow("Start handling less..."));
	const start = process.hrtime();
	gulp
		.src(`${baseUrl}/**/*.less`)
		.pipe(
			postcss([autoprefixer()], {
				parser: less,
			})
		)
		.on("error", () => {})
		.pipe(gulp.dest(esOutput))
		.pipe(gulp.dest(libOutput))
		.on("end", () => {
			done();
			const times = getDiffTime(start);
			console.log(
				chalk.blueBright("Handle less completed"),
				chalk.magenta(`(${times})`)
			);
		});
});

gulp.task("art", (done) => {
	del.sync([`${esOutput}/**/interface.js`, `${libOutput}/**/interface.js`]);
	done();
	const times = getDiffTime(startTime);
	console.log(chalk.green(`Finish packing, time ${times}`));
});

const tasks = ["clean"];

if (es) {
	tasks.push("swc:es");
}

if (lib) {
	tasks.push("swc:lib");
}

if (amd) {
	tasks.push("swc:amd");
}

if (umd) {
	tasks.push("swc:umd");
}

if (style) {
	tasks.push("less");
}

if (ts) {
	tasks.push("tsc");
}

const series = gulp.series(["clean", ...tasks, "art"]);

gulp.task("default", series);
