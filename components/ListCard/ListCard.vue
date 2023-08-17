<template>
	<!-- 文章内容卡片  有三种不同结构 -->
	<view>
		<!-- 基础卡片 -->
		<view class="list-card" v-if="item.mode === 'base'" @click="goArticleDetail">
			<view class="list-card-img">
				<image :src="item.cover[0] ? item.cover[0]:'/static/img/logo.webp'" mode="aspectFill"></image>
			</view>
			<view class="list-card-content">
				<view class="list-card-content-title">
					<text>{{item.title}}</text>
					<!-- 点赞组件 -->
					<SaveLikes :articleId="item._id"></SaveLikes>
				</view>
				<view class="list-card-content-desc">
					<view class="articel-type">
						{{item.classify}}
					</view>
					<view class="brows-number">
						{{item.browse_count}}
					</view>
				</view>
			</view>
		</view>
		<!-- 多图卡片 -->
		<view class="list-card mode-column" v-if="item.mode === 'column'" @click="goArticleDetail">
			<view class="list-card-top">
					<text>{{item.title}}</text>
					<!-- 点赞组件 -->
					<SaveLikes :articleId="item._id"></SaveLikes>
			</view>
			<view class="list-card-middle">
				<view class="image-container" v-for="(img,index) in item.cover.slice(0,3)" :key="index">
					<image :src="img?img:'/static/img/logo.webp'" mode="aspectFill"></image>
				</view>
			</view>
			<view class="list-card-content-desc list-card-bottom">
				<view class="articel-type">
					{{item.classify}}
				</view>
				<view class="brows-number">
					{{item.browse_count}}
				</view>
			</view>
		</view>
		<!-- 大图卡片 -->
		<view class="list-card mode-image" v-if="item.mode === 'image'" @click="goArticleDetail">
			<view class="list-card-top">
				<view class="image-container">
					<image :src="item.cover[0]"></image>
				</view>
			</view>
			<view class="list-card-middle">
					<text>{{item.title}}</text>
					<!-- 点赞组件 -->
					<SaveLikes :articleId="item._id"></SaveLikes>
			</view>
			<view class="list-card-content-desc list-card-bottom">
				<view class="articel-type">
					{{item.classify}}
				</view>
				<view class="brows-number">
					{{item.browse_count}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"ListCard",
		props:{
			item:Object
		},
		data() {
			return {
				
			};
		},
		methods:{
			goArticleDetail(){
				// console.log(this.item);
				const {_id,title,author,create_time,thumbs_up_count,browse_count} = this.item;
				const params = {_id,title,author,create_time,thumbs_up_count,browse_count};//定义为参数对象
				
				// 跳转到详情界面 将params作为地址栏参数传递给articleDeatil
				// uni.navigateTo({
				// 	url:`/pages/articleDetail/articleDetail?params=${JSON.stringify(params)}`,
					
				// });
				// 使用第三方插件形式跳转  避免应查询不到文章id而跳转出错或渲染其他文章内容的问题
				this.$Router.push({
					path:'/pages/articleDetail/articleDetail',
					query:params
				});
				// 向上传递事件
				this.$emit('saveSearchHistory')
			}
		}
	}
</script>

<style lang="scss">
	@import './css/ListCard.scss'
</style>