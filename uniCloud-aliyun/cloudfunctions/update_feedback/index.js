'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const {content,userId,feedbackImageList} = event;
	// 如果没有feedback表则会自动创建
	await db.collection('feedback').add({
		user_id:userId,
		content,
		feedbackImageList
	});
	return {
		code:0,
		data:{
			msg:"反馈成功"
		}
	}
};
