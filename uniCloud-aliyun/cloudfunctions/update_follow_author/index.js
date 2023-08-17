'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const{authorId,userId} = event;
	const user =await db.collection('user').doc(userId).get();
	const authorLikeIds = user.data[0].author_likes_ids;
	let returnMsg = '';
	let author_ids = null;
	
	if(authorLikeIds.includes(authorId)){
		// 取消关注
		author_ids = dbCmd.pull(authorId);
		returnMsg = '取消关注';
	}else{
		// 新增关注
		author_ids = dbCmd.addToSet(authorId);
		returnMsg = '关注成功';
	};
	
	await db.collection('user').doc(userId).update({
		// 在原有的数据上与新数据进行合并
		author_likes_ids:author_ids
	});
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:returnMsg
		}
	}
};
