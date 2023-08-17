<template>
	<view class="tab">
		<!-- 滚动区域 -->
		<scroll-view class="tab-scroll" scroll-x="true" scroll-with-animation="true" :scroll-into-view="currentIndex">
			<view class="tab-scroll-box">
				<view 
				:id="`item${index}`"
				@click="changeActiveIndex(index)" 
				:class="{active:activeIndex === index}" 
				class="tab-scroll-item" 
				v-for="(item,index) in labelList" :key="index">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<!-- 图标部分 -->
		<view class="tab-icon" @click="goLabelAdmin">
			<uni-icons type="gear" size="26"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name:"TabBar",
		props:{
			labelList:Array,
			activeIndex:Number
		},
		data() {
			return {
				currentIndex:"item0"
			};
		},
		watch:{
			activeIndex(index){
				this.currentIndex = `item${index}`
			}
		},
		methods:{
			changeActiveIndex(index){
				this.$emit('changeActiveIndex',index);
			},
			// 点击是跳转到nav的标签管理页面
			async goLabelAdmin(){
				await this.checkedLogin();
				uni.navigateTo({
					url:"/pages/labelAdmin/labelAdmin"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './css/TabBar.scss'
</style>