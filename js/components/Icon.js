import {Util} from "../modules/Util.js";

export class Icon extends HTMLElement {
    constructor() {
        super();

        const fontURL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
        const shadow = this.attachShadow({mode: 'closed'});
        const style = Util.element('style', {textContent: `@import url('${fontURL}');`});

        this.icon = Util.element('i');
        this.update();
        shadow.append(style, this.icon);

        if (!document.querySelector('link[href*="font-awesome"]')) {
            document.head.append(Util.element('link', {rel: 'stylesheet', href: fontURL}));
        }
    }

    update() {
        const style = 'fa-' + (this.hasAttribute('outline') ? 'regular' : 'solid');
        const iconName = ' ' + 'fa-' + (this.getAttribute('icon') || 'star');
        const fixedWidth = this.hasAttribute('fw') ? ' fa-fw' : '';
        this.icon.className = style + iconName + fixedWidth;
    }

    static get observedAttributes() {
        return ['icon', 'fw', 'outline'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'icon' || name === 'fw' || name === 'outline') {
            this.update();
        }
    }

}

customElements.define('tivins-icon', Icon);