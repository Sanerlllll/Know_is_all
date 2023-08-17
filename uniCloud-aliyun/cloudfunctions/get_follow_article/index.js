'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;
exports.main = async (event, context) => {
	const {userId} = event;
	const user = await db.collection('user').doc(userId).get();
	const articleLikes = user.data[0].article_likes_ids;//所有收藏的文章id数组
	
	const articleList = await db.collection('article').aggregate()
	.addFields({
		is_like:$.in(['$_id',articleLikes])//判断_id值在不在获得收藏的文章列表中
	})
	.project({
		content:0
	}).match({
		is_like:true
	}).end();
	
	//返回数据给客户端
	return {
		code:0,
		msg:"获取数据成功",
		data:articleList.data
	}
};
