import Vue from 'vue';
import store from './store';
import router from './router';
import VueNativeSock from 'vue-native-websocket';
import Notifications from 'vue-notification';
import App from './App.vue';
import './index.less';
import {DateTime, Interval} from 'luxon';
import crypt from './lib/crypt';
import db from './lib/db';

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.config.warnHandler = function (msg, vm, trace) {
    // `trace` is the component hierarchy trace
};

Vue.prototype.$dt = DateTime;
Vue.prototype.$intl = Interval;
Vue.prototype.$crypt = crypt;
Vue.prototype.$db = db;

Vue.use(VueNativeSock, 'IWSI', {
    connectManually: true,
	format: 'json' 
});

Vue.use(Notifications);

new Vue({
	render: h => h(App),
	store,
	router
}).$mount("data");

let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    // console.log(e.platforms);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = 'initial';

    addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
                deferredPrompt = null;
        });
    });
});