<template>
    <div id="online">
        <input :value="name" @blur="upName" v-on:click="clear" placeholder="Name" />
        <input :value="status" @blur="upStatus" v-on:click="clear" placeholder="Status" />
    </div>
</template>

<script>

    export default {
        name: 'Online',
        data () {
            return {
                host: window.location.hostname
            }
        },
        mounted () {
            
        },
        computed: {
            status () {
                return this.$store.state.status;          
            },
            name () {
                return this.$store.state.name;
            }
        },
        methods: {
            upStatus(e) {
                let s = e.target.value;
                this.$store.state.status = s;
                this.$db.set('settings', 'status', s);
            },
            upName(e) {
                let n = e.target.value;
                this.$store.state.name = n;
                this.$db.set('settings', 'name', n);
            },
            clear (e) {
                e.target.value = '';
            }
        }
    }

</script>