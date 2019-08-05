import Vue from 'vue';
import Vuex from 'vuex';

//https://habr.com/ru/post/322354/

Vue.use(Vuex);
Vue.config.devtools = true;

const store = new Vuex.Store({
    state: {
        srv: 'ISRVI',
        ws: 'IWSI',
        isOnline: false,
        isConnected: false,
        status: null,
        name: null,
        priv: null,
        addr: null,
        rec: null,
        recStatus: null,
        recName: null,
        recUser: null,
        mess: [],
        contacts: [],
        counter: 0,
        logs: []
    },
    actions: {},
    mutations: {
        online (state) {
            state.isOnline = true;
        },
        offline (state) {
            state.isOnline = false;
        }
    },
    getters: {},  
    modules: {}
});

export default store;