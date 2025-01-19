import {Util} from "./Util.js";

export class Toasts {
    /**
     *
     * @type {Toasts}
     */
    static #instance = null;

    static get instance() {
        if (this.#instance === null) {
            this.#instance = new Toasts();
        }
        return this.#instance;
    }

    #container = null;

    constructor() {
        this.#container = Util.element('div', {id: 'toasts'});
        document.body.appendChild(this.#container);

        const toastInterval = setInterval(() => {
            document.querySelectorAll('.toast').forEach(el => {
                const end = el.getAttribute('data-end');
                if (end && new Date().getTime() > end && el.dataset['mouse'] !== '1') {
                    this.toastHide(el);
                }
            });
        }, 1000);
    }

    /**
     *
     * @param msg {string|HTMLElement[]}
     * @param lifetime {number}
     * @param type
     * @param closeBtnHTML
     * @param icon
     */
    addToast(msg, lifetime = 5, type = "default", closeBtnHTML = null, icon = null) {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        // if (type === 'error') toast.style.backgroundColor="#633"
        // if (type === 'success') toast.style.backgroundColor="#363"
        if (lifetime > 0) {
            toast.setAttribute('data-end', (new Date().getTime() + lifetime * 1000).toString())
        }
        if (icon) {
            toast.innerHTML = `<tivins-icon icon="${icon.name}" class="accent p-2 text-${icon.size ?? 'xl'}"></tivins-icon>`;
        }

        if (typeof msg === 'string') {
            toast.innerHTML += msg;
        } else {
            toast.append(...msg)
        }
        const a = document.createElement('a');
        a.innerHTML = closeBtnHTML ?? '<i class="fa fa-times"></i>';
        a.className = 'button empty flat-left';
        a.style.borderRadius = '0';
        toast.append(a);
        a.addEventListener('click', e => {
            e.preventDefault();
            this.toastHide(toast);
        })
        toast.addEventListener('mouseenter', () => {
            toast.dataset.mouse = "1";
        });
        toast.addEventListener('mouseleave', () => {
            toast.dataset.mouse = "0";
        });
        this.#container.prepend(toast);
        setTimeout(() => {
            toast.classList.add('show')
        }, 100)
    }

    addToastDefault(msg, lifetime = 5, type = "default", closeBtnHTML = null, icon = null) {
        this.addToast(`<div class="p-1">${msg}</div>`, lifetime, type, closeBtnHTML, icon);
    }


    toastHide(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.parentNode.removeChild(toast);
        }, 500)
    }
}
