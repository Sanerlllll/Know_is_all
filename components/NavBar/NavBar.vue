<template>
	<view class="nav-bar">
		<view class="nav-bar-top">
			<!-- 专门处理小程序自带导航栏高度 添加一个垫片-->
			<view :style="{height:statusHeight+'rpx'}"></view>
			
			<!-- 当组件应用与搜索界面时，展示回退按钮 -->
			<view @click="returnArticleList" class="return-icon" v-if="isSearch" :style="{top:statusHeight+4+'rpx'}">
				<uni-icons type="back" size="22" color="#fff"></uni-icons>
			</view>
			
			<view @click="getSearchPage" class="nav-bar-content" :style="{marginRight:marginRight+'rpx',marginLeft:isSearch? '20rpx':''}">
				<uni-icons type="search" color="#999" size="22" class="icon"></uni-icons>
				<view class="nav-bar-search-txt" v-if="!isSearch">输入文章标题进行搜索</view>
				<input v-else v-model.trim="searchVal" type="text" class="nav-bar-search-txt" placeholder="输入文章标题进行搜索" confirm-type="search" @confirm="changeInput" />
			</view>
		</view>
		<!-- 底部的垫片 -->
		<view :style="{height:statusHeight+90+'rpx'}"></view>
	</view>
</template>

<script>
	export default {
		name:"NavBar",//方便devtools进行组件查找
		props:{
			isSearch:{//是否为搜索界面
				type:Boolean,
				default:false
			},
			parentValue:{
				type:String,
			}
		},
		computed:{
			searchVal:{
				get(){
					return this.parentValue
				},
				set(val){//val为input框输入的内容
				// 使父组件与子组件的input输入框内容实现联动
					this.$emit('updateVal',val);
					if(!val){
						// 当输入框没有值时通知父组件处理
						this.$emit('sendSearchData')
					}
				}
			}
		},
		data() {
			return {
				statusHeight:20,
				marginRight:0
			};
		},
		created(){
			this.getSystemInfo();
		},
		methods:{
			getSystemInfo(){
				// 获取微信小程序状态栏高度api
				const systemInfo = uni.getSystemInfoSync();
				systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2.5);
				// console.log(systemInfo);
				// #ifdef MP-WEIXIN
				// 获取微信小程序胶囊位置信息
				  let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				  this.statusHeight = menuButtonInfo.top * 2.5;
				  this.marginRight = menuButtonInfo.width * 2.5;
				// #endif
			},
			getSearchPage(){
				if(this.isSearch) return;//如果已经在搜索界面则无需跳转
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			// 返回文章列表界面
			returnArticleList(){
				// #ifdef H5
					uni.switchTab({
						url:"/pages/index/index"
					})
				// #endif
				// #ifndef H5
					uni.navigateBack();
				// #endif
				
			},
			// 通知父组件进行搜索内容的搜索
			changeInput(){
				this.$emit('sendSearchData')
			}
		}
	}
</script>

<style scoped lang="scss">
	@import './css/NavBar.scss'
</style>