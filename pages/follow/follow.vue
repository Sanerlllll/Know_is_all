<template>
	<view class="follow-container">
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab-item" :class="{active:currentIndex===0}" @click="currentIndex=0">
					文章
				</view>
				<view class="follow-tab-item" :class="{active:currentIndex===1}" @click="currentIndex=1">
					作者
				</view>
			</view>
		</view>
		<!-- 内容区域 -->
		<view class="follow-list-container">
			<swiper class="follow-list-swiper" :current="currentIndex" @change="currentIndex=$event.detail.current">
				<swiper-item :class="{'no-data':!articleList.length}">
					<!-- 文章列表组件 -->
					{{!articleList.length ? '暂无收藏文章':'' }}
					<ListItem v-if="articleList.length" :isShowLoadMore="false" :articleList="articleList" ></ListItem>
					<!-- <view v-else class="no-data" >暂无收藏文章</view> -->
				</swiper-item>
				<swiper-item :class="{'no-data':!authorList.length}">
					{{!authorList.length ? '暂无关注作者':''}}
					<AuthorList v-if="authorList.length" :authorList="authorList"></AuthorList>
					<!-- <view v-else class="no-data" >暂无关注作者</view> -->
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			// 第三方插件uni-simple-router的路由跳转对tab页面的切换是无效的
			//因此tab页面切换需要单独处理 小程序中 如果用户没有登录点击关注tab页面时要先跳转到登录页
			// #ifdef MP-WEIXIN
			if(!this.userInfo){
				uni.redirectTo({
					url:"/pages/userInfo/login/login"
				});
				return
			};
			// #endif
			// 注册全局事件的监听  $on用来监听全局的自定义事件
			uni.$on('updateArticle',()=>{
				// 在点击收藏时重新获取收藏文章列表
				/*
				因为点击收藏图标时，saveLikes中的后端请求和follow中的监听请求都会向后端发送请求，
				都会有showToast的加载中效果，会导致效果重叠 没有显示完整就被覆盖了
				因此设置监听触发请求时不需要显示http.js中的showLoading效果
				避免http.js请求的showToast效果和收藏/取消收藏showToast效果冲撞
				*/
				this._getFollowArticle('noLoading');
			});
			uni.$on('updateAuthor',()=>{
				// 点击关注作者或取消关注时触发
				this._getAuthorList('noLoading');
			})
			this._getFollowArticle();
			this._getAuthorList();
		},
		
		
		data() {
			return {
				currentIndex:0,
				articleList:[],
				authorList:[],//作者列表
			}
		},
		methods: {
			// 获取收藏文章
			async _getFollowArticle(isLoading){
				const list = await this.$http.get_follow_article({
					userId:this.userInfo._id,
					isLoading
				});
				this.articleList = list
				// console.log(res);
			},
			// 获取关注的作者
			async _getAuthorList(isLoading){
				const list = await this.$http.get_author_list({
					userId:this.userInfo._id,
					isLoading
				});
				this.authorList = list;
			}
		}
	}
</script>

<style lang="scss">
@import './css/follow.scss'
</style>
