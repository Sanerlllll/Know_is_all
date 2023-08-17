'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const {articleId,pageSize=10,page=1} = event;
	const listArr =await db.collection('article').aggregate()
	.match({_id:articleId})
	.unwind("$comments")  //按照字段名对数据进行拆分
	.project({ //不返回_id属性
		_id:0,
		comments:1
	})
	.replaceRoot({ //以comments为新的根节点输出 
		newRoot:'$comments'
	})
	.skip(pageSize * (page-1)) //跳过对应数量，输出剩下的内容
	.limit(pageSize)  //限制输出数量
	.end();
	//返回数据给客户端
	return {
		code:0,
		data:listArr.data
	}
};
