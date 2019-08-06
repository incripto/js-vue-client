<template>
    <div id="p2p">
        <h1>peer 2 peer</h1>
        <recipient></recipient>
        <ul class="msg">
            <li v-for="mes in mess" :key="mes.id" v-bind:class="{ right: mes.self }">
                <span class="u-snd" v-on:click="check(mes.pub)">
                    <span>{{ mes.snd }}&nbsp;</span><span v-if="!mes.self">⇾</span><span v-if="mes.self">⇽</span>
                </span>
                <span class="u-txt" v-html="mes.txt"></span>
                <span class="icon reply" v-if="!mes.self" v-on:click="setrec(mes.snd, mes.pub)"><i class="material-icons">reply</i></span>
            </li>
        </ul>
        <textarea v-model="msg" @keyup.enter="sendMsg" placeholder="Message"></textarea>
        <button v-on:click="sendMsg" v-if="isOnline" style="margin-bottom: 0 !important">send</button>
    </div>
</template>

<script>

    import Recipient from './Recipient.vue';
    
    export default {
        name: 'Peer',
        data () {
            return {
                msg: ''
            }
        },
        computed: {
            mess () {
                return this.$store.state.mess;
            },
            isOnline () {
                return this.$store.state.isOnline;
            }
        },
        methods: {
            sendMsg () {
                let pack;
                try {
                    pack = this.$crypt.encrypt(
                        this.$store.state.addr,
                        this.msg,
                        this.$store.state.rec,
                        this.$store.state.priv
                    );

                    let date = new Date();
                    let msg =  {
                        m: 'put',
                        q: 'msg',
                        u: this.$store.state.rec,
                        d: date.getTime().toString(),
                        n: this.$store.state.name,
                        pack
                    };

                    this.$store.state.mess.push({
                        'snd': this.$store.state.recName,
                        'pub': this.$store.state.rec,
                        'txt': this.msg,
                        'self': true
                    });

                    this.msg = '';

                    this.$socket.sendObj(msg);

                } catch (e) {
                    this.$store.state.logs.push(e);
                    console.error(e);
                };
            },
            setrec (n, a) {
                this.$store.state.rec = a;
                this.$store.state.recName = n;
            },
            check (p) {
                this.$router.push({ path: `/user/${p}` })
            }
        },
        components: { Recipient }
    }

</script>