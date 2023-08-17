import ajax from '../../http.js'


// 向后端发送账号密码等信息
export const user_login = data =>ajax({
	name:'user_login',
	data
})

// 向后端发送电话号码 获取验证码
export const get_code = data => ajax({
	name:"get_code",
	data
})

// 添加、删除用户关注的作者
export const update_follow_author = data=>ajax({
	name:"update_follow_author",
	data
})

// 点赞、取消点赞文章操作
export const update_compliments = data=>ajax({
	name:"update_compliments",
	data
})

// 获取收藏文章
export const get_follow_article = data=>ajax({
	name:"get_follow_article",
	data
})

// 获取点赞的作者集合
export const get_author_list = data=>ajax({
	name:"get_author_list",
	data
})

// 获取用户发布的文章
export const get_my_article = data=>ajax({
	name:"get_my_article",
	data
})

// 提交反馈意见
export const update_feedback = data=>ajax({
	name:"update_feedback",
	data
})

// 更改用户头像
export const update_user_avatar = data=>ajax({
	name:"update_user_avatar",
	data
})