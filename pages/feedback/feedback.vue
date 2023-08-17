<template>
	<view>
		<view class="feedback-title">
			意见反馈
		</view>
		<view class="feedback-content">
			<textarea class="feedback-textarea" v-model="content" placeholder="请输入您要反馈的问题" />
		</view>
		
		<view class="feedback-title">
			反馈图片：
		</view>
		<view class="feedback-image-box">
			<view class="feedback-image-item" v-for="(item,index) in imageList" :key="index">
				<view class="close-icon">
					<uni-icons type="closeempty" size="18" color="#fff" @click="delImage(index)"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
			<!-- 添加图片的按钮展示 -->
			<view v-if="imageList.length < 5" class="feedback-image-item" @click="_addImage">
				<view class="image-box">
					<uni-icons type="plusempty" size="18" color="#eee"></uni-icons>
				</view>
			</view>
		</view>
		<button class="feedback-button" type="warn" @click="_submitFeedBack">提交反馈意见</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:"",
				imageList:[],
			}
		},
		methods: {
			// 添加图片
			async _addImage(){
				const count = 5 - this.imageList.length;
				uni.chooseImage({
					count,
					success:(res)=> {
						const tempFilePaths = res.tempFilePaths;//选择的图片地址
						tempFilePaths.forEach((url,index)=>{
							if(index < count){
								this.imageList.push({
									url,
									name:res.tempFiles[index].name
								})
							}
						})
					}
				})
			},
			// 发送意见反馈的内容
			async _submitFeedBack(){
				if(!this.content){
					uni.showToast({
						title:"文本内容不能为空",
						icon:"none"
					});
					return;
				};
				// 获取图片的上传地址
				uni.showLoading();
				const feedbackImageList = await Promise.all(this.getFiledId());
				uni.hideLoading();
				console.log(feedbackImageList);
				// 提交反馈意见
				const {msg} = await this.$http.update_feedback({
					content:this.content,
					userId:this.userInfo._id,
					feedbackImageList
				});
				uni.showToast({
					title:msg,
					icon:"none"
				});
				setTimeout(()=>{
					uni.switchTab({
						url:"/pages/self/self"
					})
				},1500)
			},
			// 删除要上传图片
			delImage(index){
				this.imageList.splice(index,1);
			},
			// 获取上传的图片地址，上传到云存储
			getFiledId(){
				return this.imageList.map(item=>{
					return new Promise(async resolve =>{
						const result = await uniCloud.uploadFile({
							filePath:item.url,//图片路径
							cloudPath:item.name,//云存储的图片名
						});
						console.log(result);
						resolve(result.fileID);//fileID完整的可访问的图片地址
					})
				})
			}
		}
	}
</script>

<style lang="scss">
@import './css/feedback.scss'
</style>
