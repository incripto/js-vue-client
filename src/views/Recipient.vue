<template>
    <div id="recipient">
        <input v-model="rec" @input="updateRec" type="text" v-on:click="clear" placeholder="Recipient" />
    </div>
</template>

<script>

    export default {
        name: 'Recipient',
        data () {
            return {
                
            }
        },
        computed: {
            rec () {
                return this.$store.state.rec;
            }
        },
        mounted () {
            
        },
        methods: {
            updateRec (e) {
                this.$store.state.rec = e.target.value;
            },
            clear (e) {
                e.target.value = '';
            }
        }
    };
</script>