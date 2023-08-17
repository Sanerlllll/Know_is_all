// 专门用来做表单字段的验证

export default{
	install(Vue){//uniapp的写法：全局安装Vue并接收插件，然后进行配置验证规则
		Vue.mixin({
			data(){
				return{
					userRules: {
						loginName:{
							rules:[{
								required:true,
								errorMessage:'账号不能为空'
							},{
								validateFunction:this.validateLoginName
							}]
						},
						password:{
							rules:[{
								required:true,
								errorMessage:'密码不能为空'
							}]
						},
						phone:{
							rules:[{
								required:true,
								errorMessage:'手机号不能为空'
							},{
								validateFunction:this.validatePhone
							}]
						},
						vCode:{
							rules:[{
								required:true,
								errorMessage:'验证码不能为空'
							},{
								validateFunction:this.validateCode
							}]
						},
					},
					mobileReg:/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/,
				}
			},
			methods:{
				// 用户名验证函数：验证字段名，验证值，验证的input框数据，错误时的处理函数
				validateLoginName(rule,val,data,callback){
					switch(true){
						case val.length<6:
						callback('账号长度不正确');
						break;
						default ://否则默认长度正确
						return true;
					}
				},
				validatePhone(rule,val,data,callback){
					switch(true){
						case !this.mobileReg.test(val):
						callback('手机号码格式不正确');
						break;
						default ://否则默认长度正确
						return true;
					}
				},
				validateCode(rule,val,data,callback){
					switch(true){
						case val != this.returnCode:
						callback('请输入正确的验证码');
						break;
						default ://否则默认长度正确
						return true;
					}
					return true;
				}
			}
		})
	}
}