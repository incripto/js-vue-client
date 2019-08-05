<template>
    <div id="home">
        <h1>{{ h1 }}</h1>
        <h2>{{ h2 }}</h2>
        <h3>{{ h3 }}</h3>
        <div class="content" v-html="tagline"></div>
        <div class="links" v-html="links"></div>
    </div>
</template>
<script>

    export default {
        name: 'Home',
        data () {
            return {
                h1: 'I-H1-I',
                h2: 'I-H2-I',
                h3: 'I-H3-I',
                tagline: 'I-TAGLINE-I',
                links: 'I-LINKS-I'
            }
        }
    };
</script>