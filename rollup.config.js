import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import less from 'rollup-plugin-less';
import copy from 'copy';
import * as dotenv from 'dotenv-flow';
import { terser } from "rollup-plugin-terser";
import progress from 'rollup-plugin-progress';

dotenv.config();

copy(['assets/**/*'], 'dist/static/', {flatten: true}, (e, f) => {
    if (e) throw e;
    f.forEach( (f) => {
        console.log(`Copying to ${f.relative}`);
    });
});

let copy2replace = new Promise( (resolve) => {
    copy.each(['src/favicon.ico', 'src/index.html', 'src/manifest.webmanifest', 'src/robots.txt', 'src/sw.js'], 'dist/', {flatten: true}, (e, f) => {
        if (e) throw e;
        resolve(f);
    });
});

copy2replace.then( (f) => {
    f.forEach( (f) => {
        console.log(`Copying to ${f.relative}`);
    });
});

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
    progress({
        clearLine: false // default: true
    })
];

let config = {
    input: 'src/index.js',
        output: {
        file: 'dist/index.js',
        format: 'es',
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
    config.plugins.push(terser({
        compress: true,
        ecma: 8
    }));
};

export default config;