<template>
    <div id="profile">
        <h1>info</h1>
        <div class="content"><h6>websocket server:</h6></div>
        <input :value="ws" @blur="upWS" placeholder="> WS" />
        <div class="content"><h6>secret key <a v-on:click="gen" href="javascript:void(0)"><i class="material-icons">refresh</i></a>:</h6></div>
        <textarea :value="priv" @blur="upPriv" class="xs"></textarea>
        <div class="content">
            <h6>name:</h6>
            <p>{{ name }}</p>
            <h6>status:</h6>
            <p>{{ status }}</p>
            <h6>public addres:</h6>
            <p>{{ addr }} <a v-bind:href="userurl"><i class="material-icons">link</i></a></p>
            <h6>sing public:</h6>
            <p>{{ pub }}</p>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'Profile',
        data () {
            return {
                
            }
        },
        mounted () {
            
        },
        computed: {
            ws () {
                return this.$store.state.ws;
            },
            name () {
                return this.$store.state.name;
            },
            status () {
                return this.$store.state.status;
            },
            priv () {
                return this.$store.state.priv;
            },
            addr () {
                return this.$store.state.addr;
            },
            pub () {
                return this.$store.state.pub;
            },
            userurl () {
                return this.$store.state.srv + 'user/' + this.$store.state.addr;
            }
        },
        methods: {
            upWS(e) {
                let s = e.target.value;
                this.$store.state.ws = s;
                this.$db.set('settings', 'ws', s);
            },
            async upPriv(e) {
                let p = e.target.value;
                this.$store.state.priv = p;
                this.$db.set('settings', 'priv', p);
                [this.$store.state.pub, this.$store.state.sec, this.$store.state.addr] = await this.$crypt.recKeys(p);
            },
            async gen () {
                this.$store.state.priv = this.$crypt.genKey();
                this.$db.set('settings', 'priv', this.$store.state.priv);
                [this.$store.state.pub, this.$store.state.sec, this.$store.state.addr] = await this.$crypt.recKeys(this.$store.state.priv);
            }
        }
    };
</script>