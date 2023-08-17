export default{
	updateUserInfo(state,userInfo){
		uni.setStorageSync('userInfo',userInfo);//对本地存储的userInfo进行更新
		state.userInfo = userInfo;//在store中存储userInfo
	},
	// 修改搜索历史
	setHistory(state,val){ 
		let list = state.historyList;
		// findIndex 返回符合条件的第一个下标，都不符合则返回-1
		// 如果list里面有搜索关键字，即搜索历史有该关键字，则不进行任何操作
		if(list.length>0 && list.findIndex(item =>item===val)>-1) return;
		list.unshift(val);//将val添加到数组第一项;
		uni.setStorageSync('historyList',list);//将list保存到本地
		state.historyList = list;//保存到state中的historyList
	},
	// 清空搜索历史
	clearHistory(state){
		uni.removeStorageSync('historyList');
		state.historyList = [];
	},
	// 保存已选择的标签，同步到导航栏选项卡中
	setLabelList(state,labelList){
		uni.setStorageSync('labelList',labelList);//将list保存到本地
		state.labelList = labelList;//保存到state中的historyList
	}
}