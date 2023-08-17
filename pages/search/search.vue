<template>
	<view class="search-container">
		<!-- 引入搜索导航组件 -->
		<NavBar :isSearch="isSearch" @sendSearchData="_sendSearchData" @updateVal="parentValue=$event" :parentValue="parentValue"></NavBar>
		<!-- 搜索容器 -->
		<!-- 没有进行搜索操作 -->
		<view v-if="isShowHistory" class="search-wrapper">
			<view class="search-history-container">
				 <!-- 头部 -->
				 <view class="search-header">
					 <text class="history-text">搜索历史</text>
					 <text class="history-clear" @click="clearHistory">清空</text>
				 </view>
				 <!-- 内容 -->
				 <view v-if="historyList.length" class="search-history-content">
					 <view @click="openHistory(item)" class="history-content-item" v-for="(item,index) in historyList" :key="index">
						 {{item}}
					 </view>
				 </view>
				 <!-- 没有内容 -->
				<view v-else class="no-data">
					当前没有搜索历史
				</view>
			</view>
		</view>
		<!-- 开始进行搜索操作 -->
		<view v-else class="search-list-container">
			<ListItem @saveSearchHistory="saveSearchHistory" v-if="searchList.length" :articleList="searchList" :isShowLoadMore="false"></ListItem>
			<view v-else class="no-data">
				没有搜索到相关数据
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from "vuex"
	export default {
		data() {
			return {
				isSearch:true,
				searchList:[],
				parentValue:'',
				isShowHistory:true,//当前是否没有进行搜索
			}
		},
		computed:{
			...mapState(['historyList']),
		},
		methods: {
			async _sendSearchData(){
				this.isShowHistory = false;//当前正在进行搜索
				// 当搜索内容为空时不向后端发送请求
				if(!this.parentValue){
					this.searchList = [];
					this.isShowHistory = true;
					return;
				};
				const {articleList} =await this.$http.get_search_data({
					searchVal:this.parentValue
				});
				this.searchList = articleList;
				// console.log(articleList);
			},
			...mapMutations(['setHistory','clearHistory']),
			// 添加搜索历史
			saveSearchHistory(){
				this.setHistory(this.parentValue);
			},
			// 通过点击搜索历史进行搜索
			openHistory(val){
				this.parentValue = val;
				this._sendSearchData();
			}
		}
	}
</script>

<style lang="scss">
@import './css/search.scss'
</style>
