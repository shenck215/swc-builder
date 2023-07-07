const checkType = (data) => {
	const type = Object.prototype.toString.call(data);
	return type.substring(8, type.length - 1);
};

module.exports = checkType;
