<template>
	<view>
		<uni-popup ref="popup" :mask-click="false" type="bottom">
			<!-- 内容区域 -->
			<view class="popup-wrapper">
				<view class="popup-header">
					<view class="popup-header-item" @click="closeCommentMasker">
						取消
					</view>
					<view class="popup-header-item" @click="sendCommentData">
						发布
					</view>
				</view>
				<view class="popup-content">
					<textarea class="popup-content-textarea" v-model.trim="commentVal" placeholder="请输入评论内容" maxlength="200" />
					<view class="popup-content-count">
						{{commentVal.length}} / 200
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"CommentMasker",
		props:{
			showPopup:Boolean
		},
		mounted(){
			// this.$refs.popup.open();
		},
		watch:{
			showPopup(newVal){
				newVal ? this.$refs.popup.open():this.$refs.popup.close();			
			}
		},
		data() {
			return {
				commentVal:"",
			};
		},
		methods:{
			// 关闭弹窗
			closeCommentMasker(){
				this.$emit('closeCommentMasker',false);
			},
			// 通知父组件进行评论的发布
			sendCommentData(){
				if(!this.commentVal){
					uni.showToast({
						title:"请输入评论内容",
						icon:"none"
					});
					return;
				};
				this.$emit('sendCommentData',this.commentVal);
				this.commentVal = '';
			}
		}
	}
</script>

<style lang="scss">
.popup-wrapper {
  background-color: #ffffff;
  .popup-header {
    @include flex();
    font-size: 28rpx;
    color: #666;
    border-bottom: 1px #f5f5f5 solid;
    .popup-header-item {
      height: 100rpx;
      line-height: 100rpx;
      padding: 0 30rpx;
    }
  }
  .popup-content {
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    .popup-content-textarea {
      height: 400rpx;
      width: 100%;
    }
    .popup-content-count {
      @include flex(flex-end);
      font-size: 24rpx;
      color: $c-9;
    }
  }
}
</style>