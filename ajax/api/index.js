const requireApi = require.context('.',true,/.js$/);//参数：相对路径  是否检查子文件  匹配文件类型的正则表达式
let module = {};
// console.log(requireApi.keys());

// requireApi.keys:找到requireApi里面的所有文件
requireApi.keys().forEach((key,index)=>{
	if(key == './index.js') return;
	// console.log(requireApi(key));//通过require.context收集到的请求函数
	Object.assign(module,requireApi(key));//将两个参数中的内容混合到一起，后者覆盖前者
});

export default module;