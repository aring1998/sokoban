import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Index = () => import('@/views/Index.vue')

export default new Router({
  routes: [
    {
      path: '',
      // redirect 重定向
      redirect: to => {
        return '/home'
      }
    },
    {
      path: '/home',
      component: Index
    }
  ]
})
