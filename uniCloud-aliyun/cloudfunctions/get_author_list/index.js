'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;
exports.main = async (event, context) => {
	const {userId} = event;
	const user = await db.collection('user').doc(userId).get();
	const authorLikes = user.data[0].author_likes_ids;//所有喜欢的作者id数组
	
	const authorList = await db.collection('user').aggregate()
	.addFields({
		is_like:$.in(['$id',authorLikes])//判断作者id值在不在获得关注的列表中
	})
	.project({
		loginName:false,
		password:false,
		phone:false,
		vCode:false
	})
	.match({
		is_like:true
	}).end();
	
	//返回数据给客户端
	return {
		code:0,
		msg:"获取数据成功",
		data:authorList.data
	}
};
