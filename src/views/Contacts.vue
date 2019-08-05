<template>
    <div id="contacts">
        <h1>contacts</h1>
        <ul class="msg contacts">
            <li class="u-snd" v-for="contact in contacts" :key="contact.id" v-on:click="p2p(contact.addr, contact.name)">{{ contact.name }}</li>
        </ul>
    </div>
</template>
<script>

    export default {
        name: 'Contacts',
        data () {
            return {
                
            }
        },
        mounted () {
            
        },
        computed: {
            contacts () {
                return this.$store.state.contacts;
            }
        },
        methods: {
            edit () {},
            remove () {},
            p2p (a, n) {
                this.$store.state.rec = a;
                this.$store.state.recName = n;
                this.$router.push({ path: `/p2p` })
            }
        }
    };
</script>