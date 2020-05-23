import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    { path: '/', redirect: '/login'},
    { path: '/login', component: () => import('components/login/Login') },
    { path: '/home', component: () => import('components/home/Home'),
    redirect: '/welcome',
      children: [ 
        { path: '/welcome', component: () => import('components/home/Welcome')},
        { path: '/users', component: () => import('components/user/Users')},
        { path: '/rights', component: () => import('components/power/Rights')},
        { path: '/roles', component: () => import('components/power/Roles')},
        { path: '/categories', component: () => import('components/goods/Cate')},
        { path: '/params', component: () => import('components/goods/Params')},
        { path: '/goods', component: () => import('components/goods/List')},
        { path: '/goods/add', component: () => import('components/goods/Add')},
        { path: '/orders', component: () => import('components/order/Order')}          
      ] }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，标识放行
  // next() 放行 next('/login) 强制跳转
  if(to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
