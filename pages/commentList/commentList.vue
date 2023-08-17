<template>
	<view>
		<view class="comment-content-container" v-for="item in commentList" :key="item.comment_id">
			<CommentBox :commentData="item" @commentReply="commentReply"></CommentBox>
		</view>
		<!-- 加载更多 -->
		<uni-load-more  v-if="commentList.length===0||commentList.length>5" 
		:status="loading"
		:contentText="{
			contentdown:'上拉显示更多',
			contentrefresh:'正在加载...',
			contentnomore:'没有更多评论了'
		}"
		></uni-load-more>
		
		<!-- 评论组件 -->
		<CommentMasker :showPopup="showPopup" @sendCommentData="_sendCommentData" @closeCommentMasker="showPopup=$event"></CommentMasker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleId:'',
				commentList:[],//文章评论列表
				page:1,
				pageSize:5,
				loading:'loading',
				showPopup:false,
				replyData:{},
			}
		},
		onLoad(props){
			this.articleId = props.id;
			this._getCommentList();
			
		},
		// 页面下拉到底时触发
		onReachBottom(){
			if(this.loading === 'noMore') return;
			this.page++;
			this._getCommentList();
		},
		methods: {
			async _getCommentList(){
				const list = await this.$http.get_comment({
					articleId:this.articleId,
					pageSize:this.pageSize,
					page:this.page
				});
				if(list.length === 0){
					this.loading="noMore";
					return
				};
				// console.log(this.commentList);
				// 加载更多数据后将之前的数据和新加载的数据继续合并显示
				let oldList = JSON.parse(JSON.stringify(this.commentList));
				oldList.push(...list);
				this.commentList = oldList;
			},
			commentReply(data){
				this.replyData = {
					comment_id:data.comment.comment_id,
					is_reply:data.isReply,//是否是子回复
				};
				data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id);
				this.openCommentMasker();
			},
			// 显示评论组件
			async openCommentMasker(){
				// 判断用户是否登录 登录则执行后续代码 显示评论组件
				await this.checkedLogin();
				this.showPopup = true;
			},
			async _sendCommentData(comment){
				const {msg} = await this.$http.update_comment({
					userId:this.userInfo._id,
					articleId:this.articleId,
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
				this.page=1;
				this.commentList=[];
				this.loading='loading';
				this._getCommentList();
			}
		}
	}
</script>

<style lang="scss">
	.comment-content-container{
		padding:0 30rpx;
		border-bottom: 1px sloid #eee;
	}

</style>
