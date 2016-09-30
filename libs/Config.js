"use strict";

class Config {

    constructor(setting) {
        this.stack = setting || {};
    }

    get(key, def) {
        return ( key in this.stack ) ? this.stack[key] : def || null;
    }

    set(key, value) {
        this.stack[key] = value;
    }

    exists(key) {
        return ( key in this.stack );
    }
}

module.exports = Config;
