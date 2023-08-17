'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const {userId,filePath} = event;
	
	const user = await db.collection('user').doc(userId).get();
	const oldAvatar = user.data[0].avatar;
	// 判断旧用户头像是否包含在云存储里，如果是则将其删除
	try{
		await uniCloud.deleteFile({
		    fileList: [oldAvatar]
		})
	}catch(e){
		// console.log(e);
		return false;
	};
	// 更新用户头像操作
	await db.collection('user').doc(userId).update({
		avatar:filePath
	});
	// 更新文章作者头像操作
	const id = user.data[0].id;//作者id
	await db.collection('article').where({
		'author.id':id
	}).update({
		'author.avatar':filePath
	});
	
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:"修改头像成功"
		}
	}
};
