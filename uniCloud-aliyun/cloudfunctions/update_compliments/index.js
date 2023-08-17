'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const {articleId,userId} = event;
	const user =await db.collection('user').doc(userId).get();
	const thumbUpIds = user.data[0].thumbs_up_article_ids;//数据表中该用户所有点赞的文章
	let returnMsg = '';
	let compliments_ids = null;//初始化一个用户点赞的文章数组
	let thumbsNumber = null;//初始化一个文章点赞量
	
	if(thumbUpIds.includes(articleId)){
		// 取消关注
		compliments_ids = dbCmd.pull(articleId);
		thumbsNumber= -1;
		returnMsg = '取消点赞';
		
	}else{
		// 新增关注
		compliments_ids = dbCmd.addToSet(articleId);
		thumbsNumber=1;
		returnMsg = '点赞成功';
	};
	// 处理点赞文章id的重新插入
	await db.collection('user').doc(userId).update({
		// 在原有的数据上与新数据进行合并
		thumbs_up_article_ids:compliments_ids
	});
	// 处理点赞文章数量的修改
	await db.collection('article').doc(userId).update({
		thumbs_up_count:dbCmd.inc(thumbsNumber)
	});
	
	return {
		code:0,
		data:{
			msg:returnMsg
		}
	}
};
