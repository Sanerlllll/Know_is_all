<template>
	<view class="home-container">
		<!-- 导航搜索栏 -->
		<NavBar></NavBar>
		<!-- 选项卡 -->
		<TabBar :labelList="labelList" :activeIndex="activeIndex" @changeActiveIndex="changeActiveIndex"></TabBar>
		<!-- 文章列表 -->
		<ArticleList class="list-container" 
		:labelList="labelList" 
		:activeIndex="activeIndex"
		@changeActiveIndex="changeActiveIndex"
		></ArticleList>
	</view>
</template>

<script>
	import {mapState,mapMutations} from "vuex"
	export default {
		onLoad() {
			this._initLabelList();
		},
		data() {
			return {
				// labelList:[],
				activeIndex:0
			}
		},	
		computed:{
			// labelList的变动依赖userInfo，当userInfo发生改变时，labelList也会重新计算一次
			// 依次可以使用JSON.stringify来判断新值和旧值是否一致，一致则不重新计算labelList
			labelList(){
				// 如果是登录状态 则根据用户自己选择的标签进行渲染，并将activeIndex归0，避免报错
				if(this.userInfo){
					this.activeIndex = 0;
					// console.log(this.userInfo);
					return [...this.$store.state.labelList.slice(0,1),
					// 在labelList中留下用户选择的标签 并将该标签返回
					...this.$store.state.labelList.filter(item => this
					.userInfo.label_ids.includes(item._id))]
				}else{
					return this.$store.state.labelList
				}
			}
		},
		methods: {
			...mapMutations(['setLabelList']),
			async _initLabelList(){
				// 如果labelList有值则什么也不做
					if(this.labelList.length) return;
					const res =await this.$http.get_label_list();
					this.setLabelList([{name:"全部"},...res]);
				},
			changeActiveIndex(index){
				this.activeIndex = index;
			},
		}
			
	}
</script>

<style scoped lang="scss">
	page{
		display: flex;
		height: 100%;
	}
	.home-container{
		flex:1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start,column);
		align-items:inherit;
		.list-container{
			flex:1;
			box-sizing: border-box;
		}
	}
	
	
</style>
