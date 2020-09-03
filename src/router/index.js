import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import index from '../views/index.vue'
import User from '../views/User.vue'
import Menu from '../views/Menu.vue'
import Role from '../views/Role.vue'
import Config from '../views/Config.vue'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)


export default new Router({
    routes: [{
            path: '/',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/index',
            component: index,
            children: [{
                    path: '/user',
                    component: User
                },
                {
                    path: '/menu',
                    component: Menu
                },
                {
                    path: '/role',
                    component: Role
                },
                {
                    path: '/config',
                    component: Config
                },

            ]
        }
    ]
})