<template>
	<!-- 点赞组件  .stop阻止事件冒泡-->
	<view class="save-icons"  @click.stop="changeSaveStatus">
		<uni-icons color="#ff6600" :type="isSave ? 'heart-filled':'heart'" :size="size"></uni-icons>
	</view>
</template>

<script>
	export default {
		name:"SaveLikes",
		props:{
			articleId:String,
			size:{
				type:String,
				default:'25'
			}
		},
		data() {
			return {
			};
		},
		computed:{
			// icon图标的类型 分为收藏和没有收藏
			isSave:{
				get(){
					try{
						return this.userInfo && this.userInfo.article_likes_ids.includes(this.articleId);
					}catch(e){
						return false;
					}
				},
				set(){}//避免报错
			}
		},
		methods:{
			async changeSaveStatus(){
				// 判断用户是否登录，登录则是fullfill状态 才会执行后续代码
				await this.checkedLogin();
				// 已登录状态  则通过用户id和文章id来实现文章点赞操作
				// console.log(this.userInfo._id,this.articleId)
				this.isSave = true;
				const {msg,newUserInfo} =await this.$http.update_save_like({
					articleId:this.articleId,
					userId:this.userInfo._id
				});
				uni.showToast({
					title:msg,
					icon:"none"
				});
				// this.userInfo指的是state中原有的userInfo，newUserInfo更新收藏后的userInfo
				this.updateUserInfo({...this.userInfo,...newUserInfo});//将新的userInfo更新到本地存储的用户对象中去
				uni.$emit('updateArticle');//触发全局的自定义事件，将该事件传递给父组件follow.vue
			}
		}
	}
</script>

<style>

</style>