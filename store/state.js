export default {
	userInfo:uni.getStorageSync('userInfo')|| null,//异步获取本地存储的用户对象
	historyList:uni.getStorageSync('historyList')|| [],
	labelList:uni.getStorageSync('labelList')|| [],
}