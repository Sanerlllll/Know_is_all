'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const {userId,articleId,comment,comment_id="",reply_id="",is_reply=false} = event;
	// 获取该评论的用户信息
	let user =await db.collection('user').doc(userId).get();
	user = user.data[0];
	// 获取评论的文章信息,并对其中的评论进行数据的追加
	const article =await db.collection('article').doc(articleId).get();
	const comments = article.data[0].comments;//拿到该文章的所有评论
	
	let commentObj = {
		comment_id:generatedId(5),
		comment_content:comment,
		create_time:Date.now(),
		is_reply,//是否是子回复
		replyArr:[],
		author:{
			author_id:user._id,
			author_name:user.author_name,
			avatar:user.avatar,
			professional:user.professional,//职业
		}
	};
	// 根据有无回复评论的id来进行不同操作
	if(comment_id === ''){
		// 如果没有回复评论的id，即意味着没有回复
		commentObj.replyArr = [],
		commentObj = dbCmd.unshift(commentObj);//对commentObj重新赋值且转换为数组，将数据添加到首位
	}else{
		// 有回复,获取当前文章评论的集合，在集合中找到指定评论，其加入指定comment_id的replyArr中
		let commentAuthor = null;
		let commentIndex = comments.findIndex((item)=>item.comment_id === comment_id)
		
		// 如果是子回复，则是针对指定评论中的回复进行回复，如果不是，则是针对某一评论进行回复
		if(is_reply){
			console.log("指定评论下面的所有回复：",comments[commentIndex].replyArr);
			console.log("回复的id：",reply_id);
			// 找到指定评论中的回复评论，匹配id相等的用户名，将该条评论正确渲染
			commentAuthor = comments[commentIndex].replyArr.find(item => item.comment_id === reply_id).author.author_name;
		}else{
			console.log(111);
			commentAuthor = comments.find(item => item.comment_id === comment_id).author.author_name;
		}
		
		commentObj.to = commentAuthor;//回复的对象名
		commentObj = {
			// 修改comments中第commentIndex个commentObj的replyArr
			[commentIndex]:{
				replyArr:dbCmd.unshift(commentObj)
			}
		}
		
	}
	
	/*
	const obj={
		name:"",
		comments:[
			{replyArr:1},
			{replyArr:2}
		]
	};
	XXX.update({
		comments:{修改对象中的comments属性的第index个属性的值
			0:{
				replyArr:3
			}
		}
	})
	*/
	
	// updated对原有数据和新传入的数据进行合并
	await db.collection('article').doc(articleId).update({
		// 如果该文章有comment则对comment数据进行追加，如果没有则创建comment并赋值
		comments:commentObj
	});
	
	
	// 生产随机id
	function generatedId(num){//最终转换为由0-9和A-Z组成的36进制
		return Number(Math.random().toString().substr(3,num)+ Date.now()).toString(36);
	};
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:'评论成功'
		}
	}
};
