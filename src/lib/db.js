import { openDB } from 'idb/with-async-ittr.js';

const _db = openDB('yzoz', 1, {
    upgrade(db) {
        db.createObjectStore('settings');
        const contacts = db.createObjectStore('contacts', {
            keyPath: 'id',
            autoIncrement: true,
        });
        contacts.createIndex('name', 'name');
    }
});

const db = {
    async get(store, key) {
      return (await _db).get(store, key);
    },
    async set(store, key, val) {
      return (await _db).put(store, val, key);
    },
    async delete(store, key) {
      return (await _db).delete(store, key);
    },
    async clear(store) {
      return (await _db).clear(store);
    },
    async keys(store) {
      return (await _db).getAllKeys(store);
    },
    async addContact(name, addr) {
        return (await _db).add('contacts', {
            name,
            addr
        });
    },
    async getContacts() {
        return (await _db).getAllFromIndex('contacts', 'name');
    }
};

export default db;