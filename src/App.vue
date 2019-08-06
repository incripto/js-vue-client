<template>
    <div id="app">  
        <header>
            <div class="top">
                <router-link to="/" exact><i class="material-icons">home</i></router-link>
                <router-link to="/wtf"><i class="material-icons">help</i></router-link>
                <router-link to="/log"><i class="material-icons">list_alt</i></router-link>
                <a v-bind:href="userurl"><i class="material-icons">link</i></a>
                <a href="javascript:void(0);" v-if="isNotif" v-on:click="notif"><i class="material-icons">notification_important</i></a>
                <a href="javascript:void(0);" class="add-button"><i class="material-icons">add_to_home_screen</i></a>
                <a href="javascript:void(0);" v-on:click="reload"><i class="material-icons">autorenew</i></a>
            </div>
        </header>
        <online></online>
        <transition name="page" mode="out-in">
            <router-view></router-view>
        </transition>
        <notifications position="top" width="100%">
            <template slot="body" slot-scope="props">
                <div class="notification">
                    <div class="ttl" v-if="props.item.title" v-html="props.item.title"></div>
                    <div class="cnt" v-html="props.item.text"></div>
                </div>
            </template>
        </notifications>
        <footer>
            <div class="menu">
                <router-link to="/p2p"><i class="material-icons">chat</i><span class="msg-counter">{{ counter }}</span></router-link>
                <router-link to="/check"><i class="material-icons">search</i></router-link>
                <router-link to="/contacts"><i class="material-icons">contacts</i></router-link>
                <router-link to="/profile"><i class="material-icons">account_box</i></router-link>
                <router-link to="/send"><i class="material-icons">send</i></router-link>
            </div>
        </footer>
    </div>
</template>

<script>
    import Online from './views/Online.vue';

    export default {
        name: 'App',
        data () {
            return {
                isError: false,
            }
        },
        created () {
            (async () => {
                let w = await this.$db.get('settings', 'ws');
                if (typeof w != 'undefined') {
                    this.$connect(w, { format: 'json' });
                    this.$store.state.ws = w;
                } else {
                    this.$connect(this.$store.state.ws, { format: 'json' });
                };
            })();
            (async () => {
                let p = await this.$db.get('settings', 'priv');
                if (typeof p != 'undefined') {
                    this.$store.state.priv = p;
                } else {
                    this.$store.state.priv = this.$crypt.genKey();
                    this.$db.set('settings', 'priv', this.$store.state.priv);
                };
                this.$store.state.addr = await this.$crypt.recKeys(this.$store.state.priv);
            })();
        },
        mounted () {
            if (this.isWorker) {
                navigator.serviceWorker.register('/sw.js', {updateViaCache: 'none'})
                .then(() => {
                    console.log('Service Worker Registered');
                });
            };
            (async () => {
                this.$store.state.contacts = await this.$db.getContacts();
                this.$store.state.status = await this.$db.get('settings', 'status');
                this.$store.state.name = await this.$db.get('settings', 'name');

            })();
            this.$options.sockets.onopen = (e) => {
                console.log(e);
                this.$store.state.isConnected = true;
                this.isError = false;
                this.$store.state.logs.push('serverside connection is open');
                if (this.$store.state.priv && this.$store.state.addr) {
                    this.checkin();
                };
            };
            this.$options.sockets.onerror = (e) => {
                console.log(e);
                this.isError = true;
                this.$store.state.logs.push('connection error');
            };
            this.$options.sockets.onclose = (e) => {
                console.log(e);
                this.$store.state.isConnected = false;
                this.$store.commit('offline');
                this.$store.state.logs.push('connection is closed');
                try {
                    setTimeout(() => {
                        this.$connect(this.$store.state.ws, { format: 'json' });
                    }, 5000);
                } catch (e) {
                    console.error(e);
                };
            };
            this.$options.sockets.onmessage = (e) => {
                
                let msg = JSON.parse(e.data);
                console.log(msg);
                
                let method = msg.m;
                let query = msg.q;

                if (method == 'info') {
                    if (query == 'sendmsg') {
                        if (msg.c == 200) {
                            this.$store.state.logs.push(`message ${msg.d} sent`);
                        } else {
                            this.$store.state.logs.push(`message ${msg.d} not sent`);
                            this.$notify({
                                speed: 1000,
                                text: `The address is not available now, try to send offline message. <i class="material-icons">textsms</i>`
                            });
                            let mess = this.$store.state.mess;
                            let last = mess.length - 1;
                            this.$store.state.mess[last].txt += ` <a href='${this.$store.state.srv}msg/${this.$store.state.addr}/${msg.pack.nonce}/${msg.pack.data}'><i class="material-icons">textsms</i></a>`;
                        };
                    };
                    if (query == 'checkin') {
                        if (msg.c == 201) {
                            this.$store.commit('online');
                            this.$store.state.logs.push(`online`);
                            /*this.$notify({
                                group: 'foo',
                                type: 'warn',
                                title: 'This is title',
                                text: 'This is <b> content </b>'
                            )};*/
                            //this.$router.go(-1);
                        } else {
                            this.$notify({
                                speed: 1000,
                                text: `Public is not availible now`
                            });
                        };
                    };
                    if (query == 'srv') {
                        this.$store.state.logs.push(`${msg.res.online} users online`);
                    };
                    if (query == 'checkuser') {
                        if (msg.c == 200) {
                            this.$store.state.recStatus = msg.res.status;
                            this.$store.state.recName = msg.res.name;
                        } else {
                            this.$store.state.recStatus = false;
                            this.$store.state.recName = 'Offline';
                        };
                    };
                };

                if (method == 'get') {
                    if (query == 'you') {
                        this.$store.state.logs.push(`${msg.u} check you (${this.$store.state.name} / ${this.$store.state.status})`);
                        let _msg = {
                            m: 'post',
                            q: 'user',
                            u: msg.u,
                            status: this.$store.state.status,
                            name: this.$store.state.name
                        };
                        this.$socket.sendObj(_msg);
                    };
                };

                if (method == 'put') {
                    if (query == 'msg') {
                        let user = msg.user;
                        let pack = msg.pack;

                        let m = pack.data;
                        let n = pack.nonce;
                        let s = pack.snd;
                        let r = this.$store.state.priv;

                        let txt;
                        try {
                            txt = this.$crypt.decrypt(m, n, s, r);
                            this.$store.state.mess.push({
                                'snd': user,
                                'pub': s,
                                'txt': txt,
                                'self': false
                            });
                            if (this.$route.path == '/p2p') {
                                this.scroll();
                            } else {
                                this.$store.state.counter++;
                            };
                            if (document.hasFocus() == false) {
                                this.sendNotification(user, {
                                    body: txt,
                                    icon: '/static/favicon-128.png',
                                    dir: 'auto'
                                });
                            };
                        } catch (e) {
                            this.$store.state.logs.push(e);
                            console.error(e);
                        };
                    };
                };

                if (method == 'del') {
                    
                };
            };
        },
        computed: {
            isOnline () {
                return this.$store.state.isOnline;
            },
            isNotif () {
                if (('Notification' in window) && Notification.permission != "granted" && this.$store.state.isOnline == true) {
                    return true;
                }
            },
            isWorker () {
                if ('serviceWorker' in navigator) {
                    return true
                };
            },
            counter () {
                if (this.$route.path != '/p2p' && this.$store.state.counter != 0) {
                    return ` ${this.$store.state.counter}`;
                } else {
                    this.$store.state.counter = 0;
                    return '';
                };
            },
            userurl () {
                return this.$store.state.srv + 'user/' + this.$store.state.addr;
            }
        },
        methods: {
            async checkin () {
                try {
                    let msg = {
                        m: 'put',
                        q: 'user',
                        pack: {
                            addr: this.$store.state.addr
                        }
                    };
                    this.$socket.sendObj(msg);
                } catch (e) {
                    this.$store.state.logs.push(e);
                    console.error(e);
                };
            },
            sendNotification(title, options) {
                if ('Notification' in window) {
                    if (Notification.permission == "granted") {

                        if (this.isWorker) {
                            navigator.serviceWorker.ready.then( (registration) => {
                                registration.showNotification(title, options);
                            });
                        } else {
                            let notification = new Notification(title, options);
                            function clickFunc() { 
                                this.$store.state.logs.push('you have clicked on notifications');
                            };
                            notification.onclick = clickFunc();
                        };

                    } else if (Notification.permission != 'denied') {

                        Notification.requestPermission( (permission) => {

                            if (permission == "granted") {
                                if (this.isWorker) {
                                    navigator.serviceWorker.ready.then( (registration) => {
                                        registration.showNotification(title, options);
                                    });
                                } else {
                                    let notification = new Notification(title, options);
                                };

                            } else {
                                this.$store.state.logs.push('you have forbidden to show notifications');
                            };

                        });

                    } else {
                    
                    };
                };
            },
            notif () {
                this.sendNotification('Great Choice!', {
                    body: 'Thank You :)',
                    icon: '/static/favicon-128.png',
                    dir: 'auto'
                });
            },
            scroll () {
                window.scrollTo(0, 999999);
            },
            reload () {
                //document.location.reload(true);
                this.$disconnect();
                this.$connect(this.$store.state.ws, { format: 'json' });
            }
        },
        components: { Online }
    };
</script>