<template>
    <div id="log">
        <h1>Log:::</h1>
        <ul class="log">
            <li v-for="log in logs" :key="log.id">{{timeNow}} ::: {{ log }}</li>
        </ul>
    </div>
</template>
<script>

    export default {
        name: 'Log',
        data () {
            return {
                
            }
        },
        computed: {
            logs () {
                return this.$store.state.logs;
            },
            timeNow () {
                return this.$dt.local().toFormat('d MMMM tt');
            }
        }
    };
</script>