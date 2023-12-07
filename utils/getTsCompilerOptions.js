const getProjectPath = require("./getProjectPath");

const getTsCompilerOptions = ({ typeRoots: propsTypeRoots }) => {
	const typeRoots = propsTypeRoots.map((item) => getProjectPath(item));

	return {
		strict: true, // 启用所有的严格类型检查选项
		declaration: true, // 生成 .d.ts 类型声明文件
		target: "ES5", // 指定编译后的 JavaScript 版本为 ES5
		module: "ESNext", // 指定生成的模块使用 ESNext 格式
		preserveConstEnums: true, // 保留 const enum 声明
		moduleResolution: "NodeNext", // 模块解析策略为 Node.js 风格
		experimentalDecorators: false, // 不启用实验性的装饰器特性
		noImplicitAny: false, // 允许隐式的 any 类型
		allowSyntheticDefaultImports: true, // 允许从没有默认导出的模块中导入默认成员
		noUnusedLocals: true, // 报告未使用的局部变量
		noUnusedParameters: true, // 报告未使用的函数参数
		jsx: "react-jsx", // 设置 JSX 语法的处理方式为 React JSX
		allowJs: true, // 允许编译 JavaScript 文件
		esModuleInterop: true, // 实现更好的 CommonJS 和 ES Modules 之间的互操作性
		resolveJsonModule: true, // 允许导入 JSON 模块
		skipLibCheck: true, // 跳过类型声明文件（.d.ts 文件）的类型检查
		typeRoots,
	};
};

module.exports = getTsCompilerOptions;
