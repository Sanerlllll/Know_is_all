<template>
	<!-- 文章列表容器  滑动屏 -->
	<swiper class="swiper-container" :current="activeIndex" @change="changeActiveIndex">
		<swiper-item v-for="(item,index) in labelList" :key="item._id">
			<view class="swiper-item">
				<!-- 文章内容区 -->
				<ListItem :loadData="loadData[index]" :articleList="articleData[index]" @loadMore="loadMoreData"></ListItem>
			</view>
		</swiper-item>
	</swiper>
	
</template>

<script>
	export default {
		name:"ArticleList",
		props:{
			labelList:Array,
			activeIndex:Number,
		},
		data() {
			return {
				articleData:{},//索引的文章数据
				loadData:{},//保存不同分类加载的文章数据、页数等信息
				page:1,//第几页
				pageSize:6,//每页显示几条
			};
		},
		created(){
			// labelList有值时请求数据 如果没有值请求数据会报错
			this.labelList.length&&this._getArticleList(this.activeIndex);
		},
		watch:{
			// 当labelList改变时，文章数据重新渲染
			// labelList的变动依赖userInfo，当userInfo发生改变时，labelList也会重新计算一次
			// 依次可以使用JSON.stringify来判断新值和旧值是否一致，一致则不重新计算labelList
			labelList(newValue,oldValue){
				if(JSON.stringify(newValue) === JSON.stringify(oldValue)) return;
				// 重新渲染时对下面数据重新赋值，避免保存之前的数据导致页面渲染时出错
				this.articleData = {},
				this.loadData = {},
				this._getArticleList(this.activeIndex);
			}
		},
		methods:{
			changeActiveIndex({detail}){
				// 子组件向父子间抛出事件
				const index = detail.current;
				this.$emit('changeActiveIndex',index);
				// 如果articleData对象中没有该项或为空，则重新请求数据，有则不用
				if(!this.articleData[index]||!this.articleData[index].length){
					// 当页面滑动时文章类型也应该发生改变，因此需要重新请求数据
					this._getArticleList(index);
				}
				
			},
			// 数据的请求
			async _getArticleList(index){
				// 指定每一个分类里的页数信息
				if(!this.loadData[index]){
					this.loadData[index]={
						page:1,
						loading:'loading',
						total:0
					}
				};
				const {articleList,total}=await this.$http.get_article_list({
					classify:this.labelList[index].name,
					page:this.loadData[index].page,
					pageSize:this.pageSize
				});
				//追加每一次的请求数据结果
				let oldList = this.articleData[index] || [];
				oldList.push(...articleList);
				//使新添加到articleData中的数据仍保持响应式，使用$set方法
				// 参数：准备添加属性的对象或数组  索引或属性名  添加值
				this.$set(this.articleData,index,oldList);
				this.loadData[index].total = total;
				// 根据索引存放不同页面类型的数据进行存放，避免重复请求
				this.articleData[index] = oldList;
				// console.log(oldList);
			},
			// 触底加载更多数据
			loadMoreData(){
				if(this.loadData[this.activeIndex].total === this.articleData[this.activeIndex].length){
					this.loadData[this.activeIndex] = {
						...this.loadData[this.activeIndex],
						...{loading:'noMore'}
					};
					// 改变对象某一个属性时不会引起对象的重新渲染，因此需要强制刷新
					this.$forceUpdate();
					return;
				};
				this.loadData[this.activeIndex].page++;
				this._getArticleList(this.activeIndex);
			}
		}
	}
</script>

<style lang="scss">
.swiper-container{
	height:100vh;
	.swiper-item{
		height: 100%;
		overflow: hidden;
	}
}
</style>