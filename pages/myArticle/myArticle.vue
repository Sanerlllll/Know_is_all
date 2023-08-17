<template>
	<view>
		<ListCard :item="item" v-for="item in articleList" :key="item._id"></ListCard>
		<view v-if="noArticle" class="no-data">您还没有发布过文章</view>
	</view>
</template>

<script>
	export default {
		onLoad(){
			this._getMyArticle();
		},
		data() {
			return {
				articleList:[],
				noArticle:false
			}
		},
		methods: {
			async _getMyArticle(){
				const list = await this.$http.get_my_article({
					userId:this.userInfo._id
				});
				if(!list.length){
					this.noArticle = true
				};
				this.articleList = list;
				
			}
		}
	}
</script>

<style lang="scss">
	.no-data{
		width:100%;
		hieght:400rpx;
		line-height: 400rpx;
		text-align: center;
		color:#666;
		font-size:28rpx;
		
	}

</style>
