export class CopyToClipboard extends HTMLElement {

    constructor() {
        super();
        this.classList.add('empty', 'btn-sm', 'button');
        this.addEventListener('click', () => this.copyToClipboard());
        this.#setInitialState();
    }

    #setInitialState() {
        this.innerHTML = '<tivins-icon icon="clone" class="muted" outline fw></tivins-icon>';
    }

    #setCopiedState() {
        this.innerHTML = '<tivins-icon icon="check" class="accent" fw></tivins-icon>';
    }

    copyToClipboard() {
        const targetId = this.getAttribute('target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const textToCopy = targetElement.textContent || '';
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    this.#setCopiedState();
                    setTimeout(() => this.#setInitialState(), 2500);
                })
                .catch(err => console.error('Cannot copy text', err));
        } else {
            console.error('CopyToClipboard: Cannot find target element.', targetId);
        }
    }
}

customElements.define('copy-to-clipboard', CopyToClipboard);
