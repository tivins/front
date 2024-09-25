/**
 * Usage:
 *
 * ```html
 * <head><script src="path/to/ScrollToTop.js"></script></head>
 * <body><scroll-to-top></scroll-to-top></body>
 * ```
 *
 * or
 *
 * ```js
 * import {ScrollToTop} from "path/to/ScrollToTop.js"
 * document.body.append(new ScrollToTop());
 * ```
 */
export class ScrollToTop extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'closed'});

        const button = document.createElement('button');
        button.innerHTML = '<svg width="16px" height="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
            + '<path class="check" d="M8.00003 7.82842L12.5858 12.4142L15.4142 9.58578L8.00003 2.17157L0.585815 9.58578L3.41424 12.4142L8.00003 7.82842Z" />'
            + '</svg>';

        const style = document.createElement('style');
        style.textContent = this.#css();

        button.addEventListener('click', evt => {
            evt.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
        });

        shadow.append(button, style);

        window.addEventListener('scroll', () => {
            const act = window.scrollY > 300 ? 'add' : 'remove';
            button.classList[act]('enabled');
        });
    }

    #css() {
        return `
            .check {
                fill: white;
            }
            button {
                background: #667;
                opacity: 0;
                pointer-events: none;
                position: fixed;
                font-size: 22px;
                line-height: 48px;
                width: 48px;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                bottom: 20px;
                right: 20px;
                transition: opacity 0.5s ease,background-color 0.2s ease;
                /*box-shadow: 0 5px 15px rgb(0,0,0,.35)*/
            }
            button.enabled {
                opacity: .8;
                pointer-events: auto;
            }
            button:hover {
                background-color: #08c;
            }
        `
    }
}

customElements.define('scroll-to-top', ScrollToTop);
