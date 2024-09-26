import {Util} from "../modules/Util.js";

export class Icon extends HTMLElement {
    constructor() {
        super();

        const fontURL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
        const shadow = this.attachShadow({mode: 'closed'});
        const style = Util.element('style', {textContent: `@import url('${fontURL}');`});

        this.icon = Util.element('i');
        this.update();
        shadow.append(style, this.icon);

        if (!document.querySelector('link[href*="font-awesome"]')) {
            document.head.append(Util.element('link', {rel: 'stylesheet', href: fontURL}));
        }
    }

    static get observedAttributes() {
        return ['icon', 'fw'];
    }

    connectedCallback() {
    }

    update() {
        const iconName = this.getAttribute('icon') || 'star';
        const fixedWidth = this.hasAttribute('fw') ? 'fa-fw' : '';
        this.icon.className = `fa fa-${iconName} ${fixedWidth}`;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'icon' || name === 'fw') {
            this.update();
        }
    }
}

customElements.define('v-icon', Icon);
