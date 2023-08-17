<template>
	<view class="login-container">
		<image class="banner-bg" src="../../../static/img/login_bg.png" mode="aspectFill"></image>
		<!-- 导航 -->
		<view class="login-nav">
			<view class="nav-item" @click="changeLoginType('account')" :class="{'active':type === 'account'}">
				账号登录
			</view>
			<view class="nav-item" @click="changeLoginType('mobile')" :class="{'active':type !== 'account'}">
				手机登录
			</view>
		</view>
		<!-- 表单 -->
		<!-- 小程序不支持:rules的验证方式 -->
		<uni-forms class="form" ref="form" :modelValue="formData">
			<!-- 账号登录 -->
			<view class="" v-if="type === 'account'">
				<uni-forms-item label="账号" name="loginName">
					<uni-easyinput :inputBorder="false" placeholder-class="placeholder" class="form-input" type="text" placeholder="请输入账号" v-model="formData.loginName"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="密码" name="password">
					<uni-easyinput :inputBorder="false" type="password" placeholder-class="placeholder" class="form-input" v-model="formData.password" placeholder="请输入密码"></uni-easyinput>
				</uni-forms-item>
			</view>
			<!-- 手机登录 -->
			<view class="" v-else>
				<uni-forms-item label="手机号" name="phone">
					<uni-easyinput :inputBorder="false" placeholder-class="placeholder" class="form-input" type="number" placeholder="请输入手机号" v-model="formData.phone"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="验证码" name="vCode">
					<uni-easyinput :inputBorder="false" type="text" placeholder-class="placeholder" class="form-input" v-model="formData.vCode" placeholder="请输入验证码"></uni-easyinput>
					<SendCode @setCurrentCode="returnCode=$event" @getForm="getForm"></SendCode>
				</uni-forms-item>
			</view>
			<button class="login-btn"  @click="_userLoginSubmit">立即登录</button>
		</uni-forms>
		<view class="footer-select-container">
			<text>注册</text>
			<text>忘记密码</text>
		</view>
	</view>
</template>

<script>
	export default {
		onReady(){//页面首次渲染完成
			this.$refs.form.setRules(this.userRules);
		},
		data() {
			return {
				type:"account",
				formData:{
					loginName:"",
					password:"",
					phone:"",
					vCode:""
				},
				returnCode:null
			}
		},
		methods: {
			async _userLoginSubmit(){
				const res = await this.$refs.form.validate();
				//将数据发送到后端
				this._sendUserInfo({
					...res,
					type:this.type
				});
			},
			changeLoginType(type){
				this.type=type;
				this.$refs.form.clearValidate([]);//清空上一次的验证规则
			},
			async _sendUserInfo(data){
				const res = await this.$http.user_login(data);
				if(res){
					// 将后端返回的信息使用store进行存储 
					this.updateUserInfo(res);//通过commonMixin.js调用store中的方法，已经挂载到每个vue实例中
					uni.showToast({//交互反馈
						title:"登陆成功",
						icon:"none"
					});
					setTimeout(()=>{
						// #ifdef H5
						uni.switchTab({
							url:'/pages/index/index'
						});
						// #endif
						// #ifndef H5
						uni.navigateBack()
						// #endif
					},1500)
				}
			},
			getForm(_sendCode){
				_sendCode && _sendCode(this.$refs.form);
			},
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
</style>
<style scopde lang="scss">
	@import './css/login.scss'
</style>
