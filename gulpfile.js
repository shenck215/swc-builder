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

const { baseUrl, es, lib, style, ts, typeRoots: propsTypeRoots } = config;

const esOutput = checkType(es) === "String" ? es : "./es";
const libOutput = checkType(lib) === "String" ? lib : "./lib";
const tsOutput = checkType(ts) === "String" ? ts : "./types";

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
		.pipe(swc(getSwcOptions(type)))
		.on("error", () => {})
		.pipe(gulp.dest(type === "es" ? esOutput : libOutput))
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
	del.sync([esOutput, libOutput, tsOutput]);
	done();
});

gulp.task("swc:es", (done) => {
	build("es", done);
});

gulp.task("swc:lib", (done) => {
	build("lib", done);
});

gulp.task("tsc", (done) => {
	console.log(chalk.yellow("Start generating type file..."));
	const start = process.hrtime();
	gulp
		.src([`${baseUrl}/**/*.tsx`, `${baseUrl}/**/*.ts`])
		.pipe(
			tsc(
				getTsCompilerOptions({
					typeRoots,
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

if (style) {
	tasks.push("less");
}

if (ts) {
	tasks.push("tsc");
}

const series = gulp.series(["clean", ...tasks, "art"]);

gulp.task("default", series);
