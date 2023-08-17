<template>
	<view class="article-detail-container">
		<!-- 标题 -->
		<view class="detail-title">
			{{articleData.title}}
		</view>
		<!-- 头部 -->
		<view class="detail-header">
			<view class="detail-logo">
				<image src="../../static/img/authorAvavar.webp" mode="aspectFill"></image>
			</view>
			<view class="detail-header-content">
				<view class="detail-header-content-title">
					{{articleData.author.author_name}}
				</view>
				<view class="detail-header-content-info">
					<text>{{articleData.create_time}}</text>
					<text>{{articleData.browse_count}}浏览</text>
					<text>{{articleData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header-button" @click="_followAuthor">
				{{isFollowAuthor ? '取消关注':'关注'}}
			</button>
		</view>
		<!-- 内容 -->
		<view class="detail-content-container">
			<view class="detail-html">
				<!-- 第三方插件 markdown文本解析组件 -->
				<u-parse :content="content" ></u-parse>
			</view>
			
			<!-- 展示评论内容 -->
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content-container" v-for="item in commentList" :key="item.comment_id">
					<CommentBox :commentData="item" @commentReply="commentReply"></CommentBox>
				</view>
				<view v-if="haveNoComment" class="no-data">
					暂无评论
				</view>
			</view>
		</view>
		
		<!-- 评论输入组件 -->
		<view class="detail-bottom">
			<view class="input-container" @click="openCommentMasker">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom-icons">
				<!-- 评论 -->
				<view class="detail-bottom-icon-box" @click="goCommentPage">
					<uni-icons type="chat"  size="22" color="#f07373"></uni-icons>
				</view>
				<!-- 点赞 -->
				<SaveLikes class="detail-bottom-icon-box" size="22" :articleId="articleData._id"></SaveLikes>
				<!-- 收藏 -->
				<view class="detail-bottom-icon-box">
					<uni-icons @click="_updateCompliments" :type="isCompliments ? 'hand-up-filled':'hand-up'"  size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 点击后弹出的评论组件 -->
		<CommentMasker :showPopup="showPopup" @sendCommentData="_sendCommentData" @closeCommentMasker="showPopup=$event"></CommentMasker>
	</view>
</template>

<script>
	// uParse为第三方组件，需要注册
	import uParse from '@/components/u-parse/u-parse.vue'
	// 渲染markdown
	import {marked} from 'marked'
	export default {
		onLoad(...options){
			// options为点击ListCard传递过来的文章详情数据
			// 通过地址栏参数取得相关文章详情数据来做预渲染
			// console.log(this.$Router);
			// this.articleData = JSON.parse(options[0].params);
			this.articleData = this.$Router.currentRoute.query;
			// console.log(this.articleData);
			// 获取文章内容
			this._getrticleDetail();
			// 初始化获取评论列表
			this._getCommentList();
		},
		data() {
			return {
				articleData:null,//文章详情相关数据
				showPopup:false,//是否显示评论组件
				commentList:[],//评论内容列表
				replyData:{},//评论回复相关数据
				haveNoComment:false,//是否没有评论
			}
		},
		components: {
		    uParse
		},
		computed:{
			// 处理marked组件的报错问题
			content(){
				try{
					return marked(this.articleData.content);
				}catch(e){
					return null;
				}
			},
			// 是否关注作者
			// 在小程序端当this.userInfo不存在时依旧强行解析&&后的代码，因此需要做容错处理
			isFollowAuthor(){
				try{
					// let res = this.userInfo&&this.userInfo.author_likes_ids.includes(this.articleData.author.id);
					// console.log(res);
					return this.userInfo&&this.userInfo.author_likes_ids.includes(this.articleData.author.id);
				}catch(e){
					return false;
				}
			},
			// 是否点赞
			isCompliments(){
				try{
					return this.userInfo&&this.userInfo.thumbs_up_article_ids.includes(this.articleData._id);
				}catch(e){
					return false;
				}
			}
		},
		methods: {
			// 获取文章详情页内容
			async _getrticleDetail(){
				const data =await this.$http.get_article_detail({
					article_id:this.articleData._id
				});
				this.articleData = data;
			},
			// 显示评论组件
			async openCommentMasker(){
				// 判断用户是否登录 登录则执行后续代码 显示评论组件
				await this.checkedLogin();
				this.showPopup = true;
			},
			// 发送评论内容给后端
			async _sendCommentData(comment){
				const {msg} = await this.$http.update_comment({
					userId:this.userInfo._id,
					articleId:this.articleData._id,
					comment,
					...this.replyData
				});
				uni.showToast({
					title:msg,
					icon:"success"
				});
				// 发布评论后评论组件关闭
				this.showPopup = false;
				// 回复成功后将此次恢复数据清空,且刷新评论列表
				this.replyData = {};
				this._getCommentList();
			},
			// 获取文章评论列表
			async _getCommentList(){
				const res = await this.$http.get_comment({
					articleId:this.articleData._id
				});
				if(res.length){
					this.haveNoComment = false;
				}else{
					this.haveNoComment = true;
				};
				this.commentList = res;
				// console.log(res,this.haveNoComment);
			},
			// 处理回复事件函数
			async commentReply(data){
				this.replyData = {
					comment_id:data.comment.comment_id,
					is_reply:data.isReply,//是否是子回复
				};
				data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id);
				this.openCommentMasker();
			},
			// 是否对文章进行收藏
			async _followAuthor(){
				// 先判断是否登录
				await this.checkedLogin();
				const {msg} =await this.$http.update_follow_author({
					authorId:this.articleData.author.id,//作者id
					userId:this.userInfo._id
				});
				uni.showToast({
					title:msg,
					icon:"none"
				});
				// 改变store中用户关注作者的状态
				let followIds = [...this.userInfo.author_likes_ids];
				if(followIds.includes(this.articleData.author.id)){
					// 原关注列表有该作者则删除
					followIds = followIds.filter(item=>item !== this.articleData.author.id);
				}else{
					// 没有则添加
					followIds.push(this.articleData.author.id);
				};
				this.updateUserInfo({
					...this.userInfo,
					author_likes_ids:followIds
				});
				uni.$emit('updateAuthor');//触发全局自定义事件，将事件传递给父组件follow.vue
			},
			// 是否对文章进行点赞
			async _updateCompliments(){
				await this.checkedLogin();
				const {msg} =await this.$http.update_compliments({
					articleId:this.articleData._id,
					userId:this.userInfo._id
				});
				uni.showToast({
					title:msg,
					icon:"none"
				});
				// 改变store中用户点赞的数据
				let complimentsIds = [...this.userInfo.thumbs_up_article_ids];
				if(complimentsIds.includes(this.articleData._id)){
					// 原点赞数组中有该文章则删除
					complimentsIds = complimentsIds.filter(item=>item !== this.articleData._id);
					//同步页面中显示的点赞数量（因为只有初始化时会给articleData赋值，其余变动需手动更新
					this.articleData.thumbs_up_count -=1;
				}else{
					// 没有则添加
					complimentsIds.push(this.articleData._id);
					this.articleData.thumbs_up_count +=1;
				};
				this.updateUserInfo({
					...this.userInfo,
					thumbs_up_article_ids:complimentsIds
				})
			},
			// 跳转到评论页面
			goCommentPage(){
				uni.navigateTo({
					url:`/pages/commentList/commentList?id=${this.articleData._id}`,
					
				})
			}
		}
	}
</script>

<style lang="scss">
@import './css/articleDetail.scss'
</style>
