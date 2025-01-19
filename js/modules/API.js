export class API {

    static token = '';

    static getToken() {
        if (!this.token) {
            this.token = window.localStorage.getItem('token');
        }
        return this.token;
    }

    static setToken(token) {
        this.token = token;
        if (!token) {
            window.localStorage.removeItem('token');
            return;
        }
        window.localStorage.setItem('token', token);
    }

    static async get(url) {
        return this.#apiCall('GET', url);
    }

    static async getBlob(url) {
        return this.#apiCallBlob('GET', url);
    }

    static async post(url, data) {
        return this.#apiCall('POST', url, {body: data});
    }

    static async delete(url) {
        return this.#apiCall('DELETE', url);
    }

    // ---------- Private Methods ----------

    static #fetch(method, url, options) {
        // console.debug('⚡', url);
        options.headers = options.headers || {}
        options.headers.Authorization = `Bearer ${this.getToken()}`;
        return fetch(url, {
            method: method, headers: options.headers || {}, body: options.body || null
        })
    }

    static async #apiCall(method, url, options = {}) {
        const response = await this.#fetch(method, url, options);
        return response.json();
    }

    static async #apiCallBlob(method, url, options = {}) {
        const response = await this.#fetch(method, url, options);
        return response.blob()
    }

}