<template>
    <div id="msg">
        <h1>offline message</h1>
        <h2>{{ sender }}</h2>
        <div class="content">
            {{ msg }}
        </div>
    </div>
</template>
<script>

    export default {
        name: 'Msg',
        data () {
            return {
                msg: '',
                sender: '',
            }
        },
        mounted () {
            if (this.$route.params.snd && this.$route.params.nonce && this.$route.params.data) {
                this.sender = this.$route.params.snd;
                try {
                    let intr = setInterval(() => {
                        if (this.$store.state.sec !== null) {
                            let m = this.$crypt.decrypt(
                                this.$route.params.data,
                                this.$route.params.nonce,
                                this.$route.params.snd,
                                this.$store.state.sec
                            );
                            clearInterval(intr);
                            this.msg = m;
                        }
                    }, 500);
                } catch (e) {
                    console.error(e);
                };
            } else {
                this.sender = 'Bad Data';
            };
        }
    };
</script>