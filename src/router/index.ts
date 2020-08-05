import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Transaction from '../components/Transaction.vue'
import Item from '../components/Item.vue'
import Project from '../components/Project.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Transaction',
    component: Transaction
  },
  {
    path: '/projects',
    name: 'Project',
    component: Project
  },
  {
    path: '/items',
    name: 'Item',
    component: Item
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
