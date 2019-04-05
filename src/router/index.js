import Vue from 'vue'
import Router from 'vue-router'
import AddBlog from '@/components/AddBlog'
import VueResource from 'vue-resource'
import Hello from '@/components/HelloWorld'
import ShowBlog from '@/components/ShowBlog'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'hello',
      component: Hello
    },
    {
      path:'/addBlog',
      name:'添加博客',
      component:AddBlog
    },{
      path:'/showBlog',
      name:'showBlog',
      component:ShowBlog
    }
  ]

})

Vue.use(VueResource)
