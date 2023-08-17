'use strict';
// 创建数据库引用
const db = uniCloud.database();
exports.main = async (event, context) => {
	// 获取数据表
	const collection = db.collection('label');
	// 获取数据表中所有数据
	const res =await collection.get();
	//event为客户端上传的参数
	//返回数据给客户端
	return {
		code:0,
		data:res.data
	}
};
