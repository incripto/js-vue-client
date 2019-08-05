import Vue from 'vue';
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Check from '../views/Check.vue'
import Log from '../views/Log.vue'
import Wtf from '../views/Wtf.vue'
import Peer from '../views/Peer.vue'
import User from '../views/User.vue'
import Send from '../views/Send.vue'
import Contacts from '../views/Contacts.vue'
import Msg from '../views/Msg.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Home },
    { path: '/profile', component: Profile },
    { path: '/p2p', component: Peer },
    { path: '/check', component: Check },
    { path: '/log', component: Log },
    { path: '/wtf', component: Wtf },
    { path: '/user/:id', component: User },
    { path: '/msg/:snd/:nonce/:data', component: Msg },
    { path: '/@:username', component: User },
    { path: '/contacts', component: Contacts },
    { path: '/send', component: Send }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router;