export class Util {
    static element(tag, p = {}) {
        return Object.assign(document.createElement(tag), p);
    }
}
