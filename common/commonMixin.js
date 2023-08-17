//挂载到Vue应用中，可以全局使用
// 用来判断用户是否登录 根据状态改变点赞状态
import {mapState,mapMutations} from 'vuex'
export default{
	install(Vue){
		Vue.mixin({
			data(){
				return {
					
				}
			},
			computed:{
				...mapState(['userInfo'])
			},
			methods:{
				...mapMutations(['updateUserInfo']),
				// 判断用户是否登录
				checkedLogin(){
					return new Promise((resolve)=>{
						// 从state中获取userInfo 有值则执行resolve(),没有则跳转页面
						if(this.userInfo){
							resolve()
						}else{
							uni.navigateTo({
							url:'/pages/userInfo/login/login'
							})
						}
					})
				}
			}
		})
	}
}