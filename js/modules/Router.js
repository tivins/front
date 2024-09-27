/**
 *
 * Usage:
 *
 * ```js
 * Router.addRoute('/','/front/js/pages/pageHome2.js');
 * Router.addRoute('/article/([0-9]*)', '/front/js/pages/pageArticle.js');
 * // ...
 * Router.init();
 * ```
 */
export class Router {

    static #routes = []

    static onPreRouting = (path, found) => {
        console.info('🏎️', path,found)
    }

    static onPostRouting = (path, found) => {
        console.info('🏎️', path, "was" , (found ? '' : 'NOT') + ' found')
    }

    static addRoute(path_regexp, module, args = null) {
        this.#routes.push({
            path: this.mkRegexp(path_regexp),
            action: matches => this.loadModule(module, args ?? matches)
        });
    }

    static async router() {

        let found = false;
        const path = window.location.pathname;

        if (this.onPreRouting) {
            this.onPreRouting(path);
        }
        for (const route of this.#routes) {
            const match = route.path.exec(path);
            if (match) {
                found = true;
                const module = await route.action(match);
                this.listenLinks();
                break;
            }
        }

        if (this.onPostRouting) {
            this.onPostRouting(path, found);
        }
    }

    static navigateTo(path) {
        history.pushState(null, '', path);
        this.router();
    }

    static navigate(event) {
        event.preventDefault();
        this.navigateTo(event.currentTarget.href);
    }

    static listenLinks() {
        document.querySelectorAll(`[href]:not(.${ROUTER_LISTEN_CLASS}):not(link)`).forEach(link => {
            link.classList.add(ROUTER_LISTEN_CLASS);
            if (link.href.substring(0,1) === '#') return;
            link.addEventListener('click', event => this.navigate(event));
        });
    }

    static mkRegexp(s) {
        return new RegExp(`^${s}$`);
    }

    static async loadModule(url, match) {
        const {render} = await import(url);
        render(match);
    };

    static init() {
        this.listenLinks();
        window.onpopstate = () => {
            this.router();
        }
        this.router();
    }
}

export const ROUTER_LISTEN_CLASS = 'router-processed';
