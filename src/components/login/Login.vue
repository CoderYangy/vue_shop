<template>
	<div class="login-container">
		<!-- 整个白框 -->
		<div class="login-box">
			<!-- logo框 -->
			<div class="avatar-box">
				<img src="~assets/logo.png" alt="">
				</div>
            <!-- 登录表单区 -->
			<!-- 用户名 -->
			<el-form :model="loginForm" :rules="loginRules" label-width="80px" class="login-form" ref="loginFromRef">
  <el-form-item label="账号：" prop="username">
    <el-input v-model="loginForm.username"></el-input>
  </el-form-item>
   <el-form-item label="密码：" prop="password">
    <el-input v-model="loginForm.password" type="password"></el-input>
  </el-form-item>
			<!-- 按钮区 -->
  
   <el-form-item class="btns">
  <el-button type="primary" @click="login">立即登陆</el-button>
     <el-button type="info" @click="resetLogin">重置</el-button>
  </el-form-item>
</el-form>
				
		
				</div>	
		</div>
</template>

<script>
	export default {
		data() {
			return {
				// 登陆表单的数据对象
				loginForm: {
					username:'',
					password:''
				},
				// 表单验证规则
				loginRules: {
				  username: [
					   { required: true, message: '请输入登录账号', trigger: 'blur' },
                       { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
				  password: [
					   { required: true, message: '请输入登录密码', trigger: 'blur' },
					 { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }]
				}
			}
		},
		methods: {
			resetLogin() {
           this.$refs.loginFromRef.resetFields()	
			},
			login() {
				this.$refs.loginFromRef.validate( async valid => {
				 if(! valid) return;
				 const {data: res} = await this.$http.post('login',this.loginForm)		
				 if(res.meta.status !== 200) return this.$message.error('登录失败')
				this.$message.success('登录成功')
				 
				//  登陆成功后的token 保存到客户端 sessionStorage中
				console.log(res);
				window.sessionStorage.setItem('username', res.data.username)
				window.sessionStorage.setItem('token', res.data.token)
				this.$router.push('/home')
				
				 			
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		background-color: #2b4b6b;
		height: 100%;
		position: relative;

		.login-box {
			width: 450px;
			height: 300px;
			background-color: #fff;
			border-radius: 4px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);

           .avatar-box {
			   height: 130px;
			   width: 130px;
			   border: 1px solid #eee;
			   border-radius: 50%;
			   padding: 10px;
			   box-shadow: 0 0 10px #ddd;
			   position: absolute;
			   left: 50%;
			   transform: translate(-50%,-50%);
			   background-color: #fff;
			   img {
				   height: 100%;
				   width: 100%;
				   border-radius: 50%;
			       background-color: #eee;
			   }
		   }
		   .login-form {
			   position: absolute;
			   top: 100px;
			   width: 100%;
			   padding: 0px 10px;
			   box-sizing: border-box;

			 .btns {
				 margin-left: 50px;
			 }
		   }
		   
		}
	}
</style>
