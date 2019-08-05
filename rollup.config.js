import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import less from 'rollup-plugin-less';
import replaceHtmlVars from 'rollup-plugin-replace-html-vars';
import copy from 'rollup-plugin-copy';
import * as dotenv from 'dotenv-flow';

dotenv.config();

const plugins = [
    less({
        include: 'src/index.less',
        output: 'dist/index.css',
        option: {
            compress: true
        }
    }),
    vue(),
    resolve({
        browser: true
    }),
    commonjs({
        namedExports: {
          'tweetnacl': ['box', 'randomBytes', 'sign'],
          'idb': ['openDB']
        }
    }),
    replaceHtmlVars({
        files: ['src/index.html', 'src/manifest.webmanifest'],
        from: ['I-TITLE-I', 'I-DESCRIPTION-I', 'I-H1-I', 'I-H2-I', 'I-H3-I', 'I-TAGLINE-I', 'I-LINKS-I'],
        to: [process.env.TITLE, process.env.DESCRIPTION, process.env.H1, process.env.H2, process.env.H3, process.env.TAGLINE, process.env.LINKS],
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.MODE),
        'process.env.DEBUG_MODE': process.env.TITLE,
        'IWSI': process.env.WS,
        'ISRVI': process.env.SRV,
        'I-H1-I': process.env.H1,
        'I-H2-I': process.env.H2,
        'I-H3-I': process.env.H3,
        'I-TAGLINE-I': process.env.TAGLINE,
        'I-LINKS-I': process.env.LINKS,
        'I-WTF-I': process.env.WTF
    }),
    copy({
        targets: [
          { src: ['src/index.html', 'src/manifest.webmanifest', 'src/robots.txt', 'src/sw.js'], dest: 'dist/'},
          { src: 'assets/**/*', dest: 'dist/static/' }
        ]
      })
];

let config = {
    input: 'src/index.js',
        output: {
        file: 'dist/index.js',
        format: 'esm',
        //format: 'iife',
        sourcemap: true
    }, 
    watch: {
        include: 'src/**'
    },
    plugins: plugins
};


if (process.env.MODE == 'production') {
    config.output.sourcemap = false;
};

export default config;
