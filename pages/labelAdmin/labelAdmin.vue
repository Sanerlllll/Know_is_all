<template>
	<view class="label-container">
	<!-- 上半部分 -->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					我的标签
				</view>
				<view class="label-edit" @click="changeEditStatus">{{isEdit?'完成':'编辑'}}</view>
			</view>
			<view class="label-content">
				<view class="label-content-item" v-for="(item,index) in selfLabelList" :key="item._id">
					{{item.name}}
					<uni-icons @click="deleteLabelItem(item)" v-if="isEdit" class="icon-close" type="clear" size="20" color="red"></uni-icons>
				</view>
				<view v-if="!selfLabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		
	<!-- 下半部分 ：标签推荐-->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					标签推荐
				</view>
			</view>
			<view class="label-content">
				<view @click="changeSelfLabelList(item)" class="label-content-item" v-for="(item,index) in recommondLabelList" :key="item._id">
					{{item.name}}
				</view>
				<view v-if="!recommondLabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from "vuex"
	export default {
		data() {
			return {
				isEdit:false,
				labelIds:[],//所有已经选择的标签
			}
		},
		watch:{
			userInfo:{//通过commonMixin将userInfo挂载到全局 
				immediate:true,//初始化时调用一次监听的数据
				handler(newVlaue,oldVal){
					this.labelIds = this.userInfo.label_ids;
					// console.log(this.labelIds);
					// console.log(this.labelList);
				}
			},
		},
		computed:{
			...mapState(['labelList']),
			selfLabelList(){//“我的标签”数组
				
				return this.labelList.filter((item)=>this.labelIds.includes(item._id));
			},
			recommondLabelList(){//“标签推荐”数组
				return this.labelList.filter((item)=>!this.labelIds.includes(item._id) && item._id);
			}
		},
		methods: {
			// ...mapMutations(['setLabelList']),
			// 修改目前的编辑状态
			changeEditStatus(){
				this.isEdit && this._updateLabel();
				this.isEdit = !this.isEdit;
			},
			// 更新已选择的标签数据
			async _updateLabel(){
				// 已经选择的标签的id数组
				const label_ids = this.selfLabelList.map((item)=>item._id);
				const {msg} =await this.$http.update_label_ids({
					userId:this.userInfo._id,
					label_ids
				});
				uni.showToast({
					title:msg,
					icon:"none"
				});
				this.updateUserInfo({...this.userInfo,label_ids})
			},
			// 通过修改labelIds（已选中的标签）来改变“我的标签”和“标签推荐”的渲染
			changeSelfLabelList(item){
				if(!this.isEdit) return;//如果不在编辑状态则直接返回
				this.labelIds.push(item._id);
			},
			// 通过点击图标删除标签来重新对labelIds赋值
			deleteLabelItem(item){
				this.labelIds = this.labelIds.filter((id)=>id !== item._id);
			}
		}
	}
</script>

<style lang="scss">
@import './css/labelAdmin.scss'
</style>
