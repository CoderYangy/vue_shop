<template>
  <el-container class="home-container">
<!-- 头部区域 -->
  <el-header>
    <div>
      <img src="~assets/logo.png" alt="">
      <span>电商管理系统</span>
    </div> 
    <div>当前用户：{{username}}</div>
      <el-button type="info" @click="logout">退出</el-button>
  </el-header>
<!-- 页面主体 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px': '200px'">
      <div class="toggle-button" @click="togglePress">|||</div>
      <!-- 侧边栏菜单 -->
       <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened 
      :collapse="isCollapse" 
      :collapse-transition="false" router 
      :default-active="activePath" >
     <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconObj[item.id]"></i>
          <!-- 文本 -->
          <span> {{item.authName}} </span>
        </template>
<!-- 二级菜单 -->
        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
          <template slot="title">
             <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span> {{subItem.authName}} </span>
          </template>
        </el-menu-item>
      </el-submenu>
     
    </el-menu>
    </el-aside>
<!-- 主内容区 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      // 图标
      iconObj:{
        '125': 'iconfont icon-yonghu',
        '103': 'iconfont icon-quanxian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-dingdan_huaban',
        '145': 'iconfont icon-shuju'
      },
      // 是否折叠
      isCollapse: false,
      // 链接激活地址
      activePath: '',
      username: ''
    }
  },
  created() {
  this.getMenuList()
  this.activePath = window.sessionStorage.getItem('activePath')
  this.username = window.sessionStorage.getItem('username')
  },
methods: {
  logout() {
   this.$confirm('确定退出当前页面吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已成功退出!'
          });
            window.sessionStorage.clear()
    this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    // window.sessionStorage.clear()
    // this.$router.push('/login')
  },
  // 获取所有的菜单
  async getMenuList() {
    const {data: res} = await this.$http.get('menus')
    if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.menulist = res.data
    console.log(this.menulist);
    
  },
  // 点击按钮，实现折叠菜单
  togglePress() {
    this.isCollapse = !this.isCollapse
  },
  // 保存链接的激活状态
  saveNavState(activePath) {
    window.sessionStorage.setItem('activePath', activePath)
    this.activePath = activePath
  }
}
}
</script>

<style lang="scss" scoped>
.home-container {
height: 100%;
 }
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
 padding-left: 0;
 align-items: center;
 color: #fff;
 div {
  display: flex;
  align-items: center;
 img {
   width: 50px;
 }
 span {
   font-size: 20px;
   margin-left: 15px;
 }
}
 }


  .el-aside {
background-color: #333744;
  .el-menu {
    border: none;
  }
  }

  .el-main {
   background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
 .toggle-button {
   background-color: #4a5064;
   font-size: 10px;
   line-height: 24px;
   color: #fff;
   text-align: center;
   letter-spacing: 0.3em;
   cursor: pointer;
 }
</style>