import { box, randomBytes } from "tweetnacl";

//var myByteArray = window.crypto.getRandomValues(new Uint8Array(16))

const crypt = {

    nonce () {
        return randomBytes(16)
    },

    b2h (b) {
        return Array.prototype.map.call(b, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    },
    
    h2b (h) {
        if (typeof h !== 'string') throw new TypeError('expected string');
        let b = new Uint8Array(h.length / 2);
        let i = 0;
        while (h.length >= 2) {
            b[i] = parseInt(h.substring(0, 2), 16);
            h = h.substring(2, h.length);
            i++;
        };
        return b;
    },
    
    u2b (s) {
        if (typeof s !== 'string') throw new TypeError('expected string');
        let i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
        for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
        return b;
    },
    
    b2u (b) {
        let i, s = [];
        for (i = 0; i < b.length; i++) s.push(String.fromCharCode(b[i]));
        return decodeURIComponent(escape(s.join('')));
    },
    
    genKey () {
        const k = box.keyPair();
        return this.b2h(k.secretKey);
    },

    async recKeys (s) {
        const addr = box.keyPair.fromSecretKey(this.h2b(s)).publicKey;
        return this.b2h(addr);
    },
    
    //my_box_pub, mes, rec_box_pub, my_box_sec
    encrypt (p, m, r, s) {
    
        const n = randomBytes(box.nonceLength);
        const _m = this.u2b(m);
        const _r = this.h2b(r);   
        const _s = this.h2b(s);
      
        const e = box(_m, n, _r, _s);
      
        return {    
          snd: p,
          nonce: this.b2h(n),
          data: this.b2h(e) 
        }
    },
    
    //mes, nonce, sender_box_pub, my_box_sec
    decrypt (m, n, s, r) {  
    
        const _m = this.h2b(m);
        const _n = this.h2b(n);   
        const _s = this.h2b(s);
        const _r = this.h2b(r);     
      
        const d = box.open(_m, _n, _s, _r)
      
        return this.b2u(d)        
    },
};

export default crypt;