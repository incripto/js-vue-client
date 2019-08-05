<template>
    <div id="check">
        <h1>user info</h1>
        <h2>{{ recName }}</h2>
        <h3 v-if="recStatus">{{ recStatus }}</h3>
        <div class="content">
            <p v-if="rec">{{ rec }}</p>
            <p v-if="recUser">{{ recUser }}</p>
        </div>
        <div v-if="recStatus">
            <div class="link-button"><router-link to="/p2p">⇽&nbsp;write</router-link></div>
            <div class="link-button"><a href="javascript:void(0)" v-on:click="addContact(recName, rec)">+&nbsp;add</a></div>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'Check',
        data () {
            return {
                
            }
        },
        computed: {
            rec () {
                return this.$store.state.rec;
            },
            recUser () {
                return this.$store.state.recUser;
            },
            recStatus () {
                return this.$store.state.recStatus;
            },
            recName () {
                return this.$store.state.recName;
            }
        },
        mounted () {
            if (this.$route.params.id) {
                this.$store.state.rec = this.$route.params.id;
                try {
                    let intr = setInterval(() => {
                        if (this.$socket.readyState == 1) {
                            this.checkuser();
                            clearInterval(intr);
                        }
                    }, 1000);
                } catch (e) {
                    console.error(e);
                };
            } else if (this.$route.params.username) {
                this.$store.state.recUser = this.$route.params.username;
            }; 
        },
        methods: {
            checkuser () {
                let msg = {
                    m: 'get',
                    q: 'user',
                    u: this.rec
                };
                this.$socket.sendObj(msg);
            },
            addContact (n, a) {
                this.$db.addContact(n, a);
                this.$store.state.contacts.push({'name': n, 'addr': a});
                this.$notify(`User ${n} with ${a} added`);
            }
        }
    };
</script>