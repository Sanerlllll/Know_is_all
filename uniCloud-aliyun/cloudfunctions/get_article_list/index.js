'use strict';
// 获取数据库的引用
const db = uniCloud.database();
exports.main = async (event, context) => {
	let matchObj = {};
	//根据前端传递的值对数据进行分类
	const {classify,page=1,pageSize=10} = event;
	if(classify !== '全部'){
		matchObj = {classify}
	};
	// 获取数据表
	const collection = db.collection('article');
	// 获取数据表的全部数据
	// aggregate()为聚合操作，处理数据
	// project：对指定数据进行重置、排除等处理
	// match：条件查询
	const res =await collection.aggregate().match(matchObj).project({
		content:0//不需要返回文章详情给前端
	}).skip(pageSize * (page-1))//第一页数据是从0开始的
	.limit(pageSize)//每页返展示多少条数据
	.end();
	
	// 返回当前匹配的数据的个数
	const {total} =await db.collection('article').where(matchObj).count();
	//返回数据给客户端
	return {
		code:0,
		data:{
			articleList:res.data,
			total
		}
	}
};
