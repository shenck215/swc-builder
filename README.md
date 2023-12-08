### bpoBuilder

—————————

#### 用于构建基于 React、typescript、less 开发的公共库

- 工具库
- 组件库

#### Get Started

1. 安装依赖 `npm i @jy-bpo/builder`
2. 新增 `bpoBuild.config.js` 配置文件
3. 执行打包命令 `bpoBuilder`

配置文件 `bpoBuild.config.js` 例子：

```js
module.exports = {
  // 打包入口，默认 ./src
  baseUrl: "./src",
  // 是否输出 ES Module，值为字符串，则覆盖默认文件夹名(es)，默认 true
  es: true,
  // 是否输出 commonjs，值为字符串，则覆盖默认文件夹名(lib)，默认 false
  lib: true,
  // 是否对 less 文件进行处理，并输入出到 es/lib 文件夹下，默认 false
  style: false,
  // 是否输出 .d.ts，值为字符串，则覆盖默认文件夹名(types)，默认 false
  ts: true,
  // ts 打包配置
  tsConfig: {
    // 额外指定用于 TypeScript 编译器在查找全局类型定义文件（也就是 .d.ts 文件）时应该搜索的目录，
    // 默认已指定了当前项目及往上两层的 node_modules/@types
    typeRoots: ['./typings'],
    // 辅助 ts 找到对应文件，默认为 {}
    paths: {
      "react": ["node_modules/react"]
    }
  }
  // 是否开启core-js，完善打包参数兼容性，开启时需指定core-js版本，并在项目中自行添加core-js依赖，默认false
  coreJs: '3.31.0'
};
```
