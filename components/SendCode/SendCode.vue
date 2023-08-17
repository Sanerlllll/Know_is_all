<template>
	<view class="code-container">
		<view class="vCode-btn" @click="getForm">
			{{runTime ? `${time}秒后重新获取`: "获取验证码"}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"SendCode",
		// props:{小程序不支持refs的渲染机制 此时的form没有值
		// 	form:Object
		// },
		data() {
			return {
				runTime:false,
				timer:null,
				time:60
			};
		},
		methods:{
			getForm(){
				this.$emit('getForm',this._sendCode);
			},
			async _sendCode(form){
				// 为true意味着正在获取验证码，不需要重复获取，避免产生多个定时器
				if(this.runTime) return;
				const {phone} = await form.validateField(['phone']);
				// 创建定时器
				this.runTime = true;
				this.timeRunning();
				// 发送数据请求云函数 获取验证码
				const resCode =await this.$http.get_code({phone});
				// console.log(resCode);
				this.$emit('setCurrentCode',resCode);
			},
			timeRunning(){				
				this.timer = setInterval(()=>{
					if(this.time === 1){
						clearInterval(this.timer);
						this.timer = null;
						this.runTime = false;
						this.time = 60;
						return;
					};
					this.time--;
				},1000);
			}
		},
		// 组件销毁之前，即离开该组件时销毁定时器，避免页面跳转后定时器仍然在计时且有多个定时器
		beforeDestroy(){
			clearInterval(this.timer);
			this.timer = null;
			this.runTime = false;
			this.time = 60;
		}
	}
</script>

<style lang="scss">
	.code-container{
		flex-shrink: 0;
		margin-right:20rpx;
		.vCode-btn{
			background-color: $base-color;
			color:#fff;
			padding: 20rpx;
			border-radius: 10rpx;
			opacity: .8;
		}
	}

</style>