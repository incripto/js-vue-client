<template>
    <div id="check">
        <h1>Check User:</h1>
        <input v-model="user" type="text" v-on:click="clear" placeholder="User" />
        <button v-on:click="check">check</button>
    </div>
</template>
<script>

    export default {
        name: 'Check',
        data () {
            return {
                user: null
            }
        },
        methods: {
            clear (e) {
                e.target.value = '';
            },
            check () {
                this.$router.push({ path: `/user/${this.user}` })
            }
        }
    };
</script>