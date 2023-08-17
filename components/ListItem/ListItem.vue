<template>
	<view class="list-scroll-container">
		<scroll-view scroll-y="true" class="list-scroll" @scrolltolower="loadMore">
			<view>
				<!-- 单个内容组件 -->
				<ListCard @saveSearchHistory="$emit('saveSearchHistory');" :item="item" v-for="(item,index) in articleList" :key="item._id"></ListCard>
			</view>
			<uni-load-more  v-if="(isShowLoadMore&&articleList&&articleList.length===0)||(isShowLoadMore&&articleList&&articleList.length>7)" :status="loadData.loading || 'loading'"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"ListItem",
		props:{
			articleList:{
				type:Array
			},
			loadData:{
				type:Object,
				default(){
					return {
						loading:"loading"
					}
				}
			},
			//在index首页显示loading效果，在搜索关键字页面不显示，因为搜索页面不做分页，可以直接全部显示出来
			isShowLoadMore:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
			};
		},
		methods:{
			loadMore(){
				this.$emit('loadMore');
			},
		}
		
	}
</script>

<style lang="scss">
	.list-scroll-container{
		height: 100%;
		.list-scroll{
			height: 100%;
			overflow: hidden;
			box-sizing: border-box;
		}
	}
</style>