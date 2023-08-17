export default({name,data={}})=>{
	// 导出promise对象
	return new Promise((resolve,reject)=>{
		const loading = data.isLoading ;
		loading && delete data.isLoading;//不将isLoading值传向后端，只在http.js中做个判断
		// 显示loading效果
		!loading && uni.showLoading({
			title:"加载中"
		});
		// 真正发起数据的请求
		uniCloud.callFunction({
			name,//云函数名字
			data,
			success({result}){
				// 请求成功
				if(result.code === 0){
					resolve(result.data);
				}else{
					// 请求失败，一般是后端没有查询到数据 显示消息请求框
					uni.showToast({
						icon:"none",
						title:result.msg
					});
				}
			},
			// 请求失败，一般是网络的原因或者后端错误
			fail(err){
				reject(err);
			},
			complete(){
				// 请求完成 关闭loading效果
				!loading && uni.hideLoading();
			}
		})
	})
}