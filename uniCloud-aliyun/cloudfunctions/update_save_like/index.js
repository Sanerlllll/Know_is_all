'use strict';
const db = uniCloud.database();
//定义修改指令
const dbCmd = db.command;
exports.main = async (event, context) => {
	const {articleId,userId} = event;
	const userInfo =await db.collection('user').doc(userId).get();//获取user表中指定id的数据集合
	const articleIds = userInfo.data[0].article_likes_ids;//该用户点赞的文章数组
	// console.log(article_likes_ids);
	let articleArr = null;
	let msg = null;
	// 判断指定id的用户是否收藏了该篇文章
	if(articleIds.includes(articleId)){
		// 从数组中删除  
		articleArr = dbCmd.pull(articleId);
		msg='取消收藏'
	}else{
		// 添加到数组
		articleArr = dbCmd.addToSet(articleId);
		msg='收藏成功'
	};
	// 根据删除、添加收藏操作对数据表进行更新
	await db.collection('user').doc(userId).update({
		article_likes_ids:articleArr,
	});
	// 返回新的数据表数据
	const updateUser = await db.collection('user').doc(userId).get();
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg,
			newUserInfo:updateUser.data[0]
		}
	}
};
