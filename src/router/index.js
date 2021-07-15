import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Index = () => import('@/views/Index.vue')
const Game = () => import('@/views/Game.vue')
const Create = () => import('@/views/Create.vue')

export default new Router({
  routes: [
    {
      path: '',
      // redirect 重定向
      redirect: to => {
        return '/create'
      }
    },
    {
      path: '/index',
      component: Index
    },
    {
      name: 'game',
      path: '/game',
      component: Game
    },
    {
      path: '/create',
      component: Create
    }
  ]
})
