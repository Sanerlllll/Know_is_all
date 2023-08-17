'use strict';

const { resolve } = require("dns");

const db = uniCloud.database();
exports.main = async (event, context) => {
	const {phone} = event;//客户端传过来的数据
	const {affectedDocs,data} =await db.collection('user').aggregate().match({phone}).end();
	
	console.log(data[0].vCode);
	//返回数据给客户端
	return affectedDocs ? {
		code:0,
		data:data[0].vCode
	}:{
		code:1,
		msg:"验证码获取失败"
	}
};
