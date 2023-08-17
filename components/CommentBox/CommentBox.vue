<template>
	<view class="comment-box">
		<!-- 评论的头部信息 -->
		<view class="comment-header">
			<view class="comment-header-logo">
				<image :src="commentData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comment-header-info">
				<view class="title" v-if="!commentData.is_reply">
					{{commentData.author.author_name}}
				</view>
				<view class="title" v-else>
					{{commentData.author.author_name}}
					<text class="reply-text">回复给</text>
					{{commentData.to}}
				</view>
				<view class="">
					<uni-dateformat :date="commentData.create_time" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
				</view>
			</view>
		</view>
		<!-- 评论内容 -->
		<view class="comment-content">
			<view class="">
				{{commentData.comment_content}}
			</view>
			<view class="comment-info">
				<view class="comment-button" @click="commentReply({comment:commentData,isReply})">
					回复
				</view>
			</view>
			
			<!-- 回复评论的展示区域 -->
			<view class="comment-reply-list" v-for="item in commentData.replyArr" :key="item.comment_id">
				<CommentBox :isReply="true" :commentData="item" @commentReply="commentReply"></CommentBox>
			</view> 
		</view>
		
	</view>
</template>

<script>
	// 组件内部自己调用自己必须要注册声明组件，必须指定组件的name属性
	import CommentBox from '@/components/CommentBox/CommentBox.vue'
	export default {
		name:"CommentBox",
		components:{
			CommentBox
		},
		props:{
			commentData:Object,
			isReply:{//是否是子回复，即对回复进行回复
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			// 回复事件的处理
			commentReply(data){
				// console.log(data);
				// 当为true是针对指定评论中的回复进行回复
				if(data.isReply){
					data.comment.reply_id = data.comment.comment_id;//针对当前评论中评论回复里面的某一id
					data.comment.comment_id = this.commentData.comment_id;//针对当前评论中的某一评论id
				};
				console.log(data);
				// 向article中发送时只执行一次
				this.$emit('commentReply',data);
			}
		}
	}
</script>

<style lang="scss">
@import './css/CommentBox.scss'
</style>