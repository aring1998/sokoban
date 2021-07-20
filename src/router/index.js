import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Index = () => import('@/views/Index.vue')
const Game = () => import('@/views/Game.vue')
const Create = () => import('@/views/Create.vue')
const Workshop = ()=>import('../views/Workshop.vue')

export default new Router({
  routes: [
    {
      path: '',
      // redirect 重定向
      redirect: to => {
        return '/index'
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
      name: 'create',
      path: '/create',
      component: Create
    },
    {
      path: '/workshop',
      component:Workshop 
    }
  ]
})
