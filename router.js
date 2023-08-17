// router.js
import {RouterMount,createRouter} from 'uni-simple-router';
import store from "./store/index.js"
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,  
	routes: [...ROUTES]  //指的是vue.config.js中的整个路由配置文件
});
//全局路由前置守卫 可以在此设置拦截
router.beforeEach((to, from, next) => {
	// console.log(to);
	//当前没有登录 且要跳转的页面需要登录时 页面必须先跳转到登录页面
	if(!store.state.userInfo&&to.meta.needLogin){
		// 需要跳转到登录页
		next({
			name:"login",
			NAVTYPE:"push",//跳转到普通界面，不是小程序下面导航栏界面，新开启的界面保留历史记录栈
		});
	}else{
		next();
	}
	
	next();
});
// 全局路由后置守卫
// router.afterEach((to, from) => {
//     console.log('跳转结束')
// })

export {
	router,
	RouterMount
}