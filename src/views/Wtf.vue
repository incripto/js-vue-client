<template>
    <div id="wtf">
        <h1>WTF?</h1>
        <div class="content" v-html="content"></div>
    </div>
</template>
<script>

    export default {
        name: 'Wtf',
        data () {
            return {
                content: 'I-WTF-I'
            }
        }
    };
</script>