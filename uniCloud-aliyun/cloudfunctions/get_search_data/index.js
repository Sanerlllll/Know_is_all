'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const {searchVal} = event;
	const list =await db.collection('article')
	.aggregate()
	.match({title:new RegExp(searchVal)})//根据article的title属性进行模糊查询
	.project({
		content:0,//不需要返回文章详情，即返回结果去除content
	})
	.end();
	
	
	//返回数据给客户端
	return {
		code:0,
		data:{
			articleList:list.data
		}
	}
};
