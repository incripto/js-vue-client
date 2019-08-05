/*
1xx — информационные сообщения:
100 — базовое уведомление;
101 — важное уведомление.
2xx — успешное завершение:
200 — OK;
201 (created) — объект создан;
202 (accepted) — подтверждение.
4xx — ошибка на стороне клиента:
400 — неправильный запрос/JSON-объект;
401 — не авторизован;
402 — неправильный логин/пароль;
403 (forbidden) — пользователь заблокирован;
404 (not found) — пользователь/чат отсутствует на сервере;
409 (conflict) — уже имеется подключение с указанным логином;
410 (gone) — адресат существует, но недоступен (offline).
5xx — ошибка на стороне сервера:
500 — ошибка сервера.


https://github.com/jakearchibald/idb


https://habr.com/ru/post/321924/ - Push
https://tproger.ru/articles/html5-notifications-is-easy/
https://developer.mozilla.org/en-US/docs/Web/API/Push_API
https://developer.mozilla.org/ru/docs/Web/API/Push_API
https://developer.mozilla.org/ru/docs/Web/API/notification

https://habr.com/ru/company/ruvds/blog/441566/ - 12 JS

https://adamant.im/ru/

https://toster.ru/q/441487<br />
https://github.com/MetinSeylan/Vue-Socket.io<br />
https://github.com/nathantsoi/vue-native-websocket<br />
https://developer.mozilla.org/en-US/docs/Web/API/WebSocket<br />
https://github.com/dchest/tweetnacl-js/wiki/Examples<br />
https://medium.com/zinc_work/using-cryptography-tweetnacl-js-to-protect-user-data-intro-tips-tricks-a8e38e1818b5<br />
https://habr.com/ru/post/331412/<br />
https://www.html5rocks.com/ru/tutorials/file/dndfiles/

gfl		git flow	Git-Flow command
gfli	git flow init	Initialize git-flow repository
gcd		git checkout develop	Check out develop branch
gch		git checkout hotfix	Check out hotfix branch
gcr		git checkout release	Check out release branch
gflf	git flow feature	List existing feature branches
gflh	git flow hotfix	List existing hotfix branches
gflr	git flow release	List existing release branches
gflfs	git flow feature start	Start a new feature: gflfs <name>
gflhs	git flow hotfix start	Start a new hotfix: gflhs <version>
gflrs	git flow release start	Start a new release: gflrs <version>
gflff	git flow feature finish	Finish feature: gflff <name>
gflfp	git flow feature publish	Publish feature: gflfp <name>
gflhf	git flow hotfix finish	Finish hotfix: gflhf <version>
gflrf	git flow release finish	Finish release: gflrf <version>

https://github.com/nvie/gitflow/wiki/Command-Line-Arguments
https://github.com/se-panfilov/vue-notifications

yarn global add syncyarnlock // install syncyarnlock globally
yarn upgrade --latest // update dependencies, updates yarn.lock
syncyarnlock -s -k // updates package.json with versions installed from yarn.lock
yarn install // updates yarn.lock with current version constraint from package.json

*/

out = {
	m: 'get',
	q: 'srv'
};

inn = {
	m: 'get',
	q: 'srv',
	c: 100,
	res : {
		pub: '123123123',
		online: '37'
	}
};


out = {
	m: 'put',
	q: 'user',
	pack: {
		name: 'incripto',
		pub: '123123123',
		nonce: '35345345',
		sign: 'xhuyxuftuft(incripto)'
	}
}

inn = {
	m: 'put',
	q: 'user',
	c: 201 / 402 / 409
}

out = {
	m: 'del',
	q: 'user',
	pack: {
		name: 'incripto',
		pub: '123123123',
		nonce: '35345345',
		sign: 'xhuyxuftuft(incripto)'
	}
}

inn = {
	m: 'del',
	q: 'user',
	c: 200 / 404
}

out = {
	m: 'get',
	q: 'user',
	u: 'incripto'
}

inn = {
	m: 'get',
	q: 'user',
	c: 200 / 404,
	res : {
		pub: '123123123',
		status: 'qeqweqwe'
	}
}

out = {
	m: 'put',
	q: 'msg',
	u: 'username',
	d: 'timestamp',
	pack: {    
		snd: '123123123',
		nonce: '123123123',
		data: '123123123' 
	}
}

inn = {
	m: 'put',
	q: 'msg',
	d: 'timestamp',
	c: 200 / 404
}

async recKeys () {
    try {
        let s = await this.$db.get('settings', 'priv');
        let d = await this.$crypt.pinDecrypt(this.pinDecode, s);
        this.priv = this.$crypt.b2u(d);
        await this.checkin();
    } catch (e) {
        this.$store.state.logs.push(e);
        console.error(e);
    }
}

if (this.isSave) {
    try {
        let e = await this.$crypt.pinEncrypt(this.pinCode, this.priv);
        this.$db.set('settings', 'priv', e);
        
    } catch (e) {
        this.$store.state.logs.push(e);
        console.error(e);
    };
};

async pinKey (p) {
    let r = await window.crypto.subtle.digest({name: "SHA-256"}, this.u2b(p));
    let k = await window.crypto.subtle.importKey("raw", r, {name: "AES-CBC"}, false, ["encrypt", "decrypt"]);
    return k;
},

async pinEncrypt (p, m) {
    let k = await this.pinKey(p);
    let v = new Uint8Array(16);
    let e = await window.crypto.subtle.encrypt({name: "AES-CBC", iv: v}, k, this.u2b(m));
    let r = new Uint8Array(e);
    return r;
},

async pinDecrypt (p, m) {
    let k = await this.pinKey(p);
    let v = new Uint8Array(16);
    let d = await window.crypto.subtle.decrypt({name: "AES-CBC", iv: v}, k, m);
    let r = new Uint8Array(d);
    return r;
}
