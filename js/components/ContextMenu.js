import {Util} from "../modules/Util.js";

export class ContextMenu extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        shadow.innerHTML = `
            <style>
                :host {
                    position: absolute;
                    display: none;
                    background: rgb(0,0,0,70%);
                    border: 1px solid #000;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,20%);
                    padding: 4px;
                    z-index: 1000;
                    max-height: 50vh; 
                    overflow: scroll;
                }
                .menu-item {
                    padding: 4px 8px;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .menu-item:hover {
                    background-color: #345;
                }
                input{padding:5px 10px;font-family:inherit;font-size:inherit;background:rgb(0,0,0,50%);color:#ccc;border:none;}
                input:focus{outline:none}
            </style>
            <input type="search" value=""><hr>
            <div id="menu"></div>
        `;

        this.menuElement = shadow.querySelector('#menu');
        this.inputElement = shadow.querySelector('input');
        this.inputElement.addEventListener('keyup', e => {
            if (e.key === "Enter") {
                this.menuElement.childNodes.forEach(menu => {
                    if (menu.style.display === 'block') {
                        menu.dispatchEvent(new Event('click'))
                    }
                })
            }
            const text = e.currentTarget.value;
            this.menuElement.childNodes.forEach(menu => {
                menu.style.display = menu.textContent.toLowerCase().indexOf(text.toLowerCase()) === -1 ? 'none' : 'block';
            })
        })
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    connectedCallback() {
        document.addEventListener('click', this.handleClickOutside);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    // Add option
    addItem(label, callback) {
        const item = document.createElement('div');
        item.classList.add('menu-item');
        item.textContent = label;
        item.addEventListener('click', e => {
            callback();
            this.hide();
        });
        this.menuElement.appendChild(item);
    }

    addSeparator() {
        this.menuElement.append(Util.element('hr'))
    }

    show(x, y) {
        this.style.display = 'block';
        this.inputElement.value = '';
        this.inputElement.focus()
        if (y + this.offsetHeight > window.innerHeight) {
            y = window.innerHeight - this.offsetHeight;
        }
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
    }

    hide() {
        this.style.display = 'none';
    }

    handleClickOutside(event) {
        if (!this.contains(event.target)) {
            this.hide();
        }
    }

    static getInstance() {
        const menu = document.querySelector('tivins-ctx-menu') || new ContextMenu();
        if (!document.body.contains(menu)) document.body.appendChild(menu);
        return menu;
    }
}

customElements.define('tivins-ctx-menu', ContextMenu);