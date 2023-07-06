const getDiffTime = (start) => {
	const diff = process.hrtime(start);
	let milliseconds = diff[0] * 1e3 + diff[1] / 1e6;
	if (milliseconds > 1000) {
		let seconds = milliseconds / 1000;
		return `${seconds.toFixed(2)}s`;
	}
	return `${milliseconds.toFixed(2)}ms`;
};

module.exports = getDiffTime;
