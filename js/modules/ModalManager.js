/**
 *
 * ModalManager.instance.showLoading();
 *
 *
 * ModalManager.instance.show('Hello world');
 */
export class ModalManager {
    content = null;
    element = null;

    /**
     * @type {ModalManager}
     */
    static #instance = null;
    static get instance() {
        if (this.#instance === null) {
            this.#instance = new ModalManager();
        }
        return this.#instance;
    }

    constructor() {
        // Initialize your instance properties here
        this.element = document.createElement("div")
        this.element.style.display = 'none';
        this.element.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-container flex flex-align p-2">
            <div class="modal-window">
                <div class="modal-header flex flex-align bg-black-20">
                    <div class="flex-grow py-1 px-2">Confirm</div>
                    <button class="close-btn empty"><i class="fa fa-times"></i></button>
                </div>
                <div class="modal-content"></div>
            </div>
        </div>
        `
        // this.#appyStyle();
        document.body.appendChild(this.element);

        this.content = this.element.querySelector('.modal-content');
        this.element.querySelector('.close-btn').addEventListener('click', () => {
            this.close();
        })
    }

    // Example method
    close() {
        this.element.style.display = 'none';
        document.body.style.overflow='auto'
    }
    show(content) {
        this.element.style.display = 'block';
        if (typeof content === 'string') {
            this.content.innerHTML = content;
        } else {
            this.content.innerHTML = '';
            this.content.append(content);
        }
        this.content.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        document.body.style.overflow='hidden'
    }

    showLoading() {
        this.show(`
        <div class="p-2 text-center">
            <div class="my-2"><i class="fa fa-spinner fa-spin fa-2x"></i></div>
            <div class="my-2 muted">Loading&hellip;</div>
        </div>
        `)
    }
}