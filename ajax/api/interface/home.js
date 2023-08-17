// 文章相关请求

import ajax from '../../http.js'

// 获取滑动框内容
export const get_label_list = (data)=>{
	return ajax({
		name:'get_label_list',
		data
	})
}

// 获取文章列表
export const get_article_list = data=> ajax({
	name:'get_article_list',
	data
})

// 添加/取消文章点赞
export const update_save_like = data => ajax({
	name:"update_save_like",
	data
})

// 根据搜索关键字搜索文章
export const get_search_data = data=>ajax({
	name:'get_search_data',
	data
})

// 修改用户已选择的标签
export const update_label_ids = data => ajax({
	name:'update_label_ids',
	data
})

// 获取文章详情页面的文章内容
export const get_article_detail = data => ajax({
	name:"get_article_detail",
	data
})

// 修改对文章的评论
export const update_comment = data=>ajax({
	name:'update_comment',
	data
})

// 获取文章评论列表
export const get_comment = data=>ajax({
	name:'get_comment',
	data
})