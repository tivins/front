/**
 * Usage:
 *
 * ```html
 * <tivins-mason columns=3>
 *     <div class="mason-item"><img src="/img1.png" alt="image caption" /></div>
 *     <div class="mason-item"><img src="/img2.png" alt="image caption" /></div>
 *     <!-- ... --->
 * </tivins-mason>
 * ```
 *
 * -- or --
 *
 * ```js
 * import {Mason} from "Mason.js"
 * const mason = new Mason();
 * mason.append(child1, child2);
 * ```
 *
 * -- or with configuration --
 *
 * ```js
 * import {Mason} from "Mason.js"
 * const mason = new Mason();
 * mason.columns = 5;
 * mason.onMediaLoaded = item => { console.log('loaded', item) };
 * mason.append(child1, child2);
 * ```
 *
 * css (required for now, will be removed later)
 * ```css
 * .mason-item {
 *     position: absolute;
 *     display: block;
 * }
 * ```
 */
export class Mason extends HTMLElement {

    static isResizeListenerAdded = false;
    #columnCount = 5;
    #columnWidth = 20;
    #columnsHeights = [];

    /**
     * @see connectedCallback()
     */
    constructor() {
        super();
        this.style.position = 'relative';
        this.style.display = 'block';

        const observer = new MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                        this.update();
                    }
                }
            }
        });
        const config = { childList: true };
        observer.observe(this, config);
        this.update();
    }

    static get observedAttributes() {
        return ['columns'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'columns') {
            this.columns = newValue; // use setter
            this.update();
        }
    }
    get columns() {
        return this.#columnCount;
    }
    set columns(v) {
        this.#columnCount = parseInt(v);
    }

    connectedCallback() {
        if (!Mason.isResizeListenerAdded) {
            Mason.isResizeListenerAdded = true;
            window.addEventListener('resize', () => {
                document.querySelectorAll('tivins-mason')
                    .forEach(i => i.update());
            });
        }
    }

    #updateRequested=false;
    update() {
        this.#columnWidth = 100 / this.#columnCount;
        this.#resetHeights();
        this.#pushItems(this.querySelectorAll(".mason-item"));
        this.listenLoadEvents();
    }

    #pushItems(items) {
        let idx = 0;
        for (const item of items) {
            let columnIndex = this.#getLowestColumn();
            item.style.top = this.#columnsHeights[columnIndex] + 'px';
            item.style.left = (columnIndex * this.#columnWidth) + '%';
            item.style.width = (this.#columnWidth) + '%';
            this.#columnsHeights[columnIndex] += item.offsetHeight;
            idx++;
        }
        this.style.height = this.#columnsHeights[this.#getHighestColumn()] + 'px';
    }

    #resetHeights() {
        this.#columnsHeights = [];
        for (let i = 0; i < this.#columnCount; i++) {
            this.#columnsHeights[i] = 0;
        }
    }

    #getLowestColumn() {
        return this.#columnsHeights.reduce(
            (minIdx, currentValue, currentIndex, arr) =>
                currentValue < arr[minIdx] ? currentIndex : minIdx, 0);
    }

    #getHighestColumn() {
        return this.#columnsHeights.reduce(
            (minIdx, currentValue, currentIndex, arr) =>
                currentValue > arr[minIdx] ? currentIndex : minIdx, 0);
    }

    listenLoadEvents() {
        this.querySelectorAll('img:not(.mason-listened)').forEach(img => {
            img.classList.add('mason-listened');
            img.addEventListener('load', () => {
                this.onMediaLoaded(img)
                this.update()
            });
        });
        this.querySelectorAll('video:not(.mason-listened)').forEach(vid => {
            vid.classList.add('mason-listened');
            vid.addEventListener('loadeddata', () => {
                this.onMediaLoaded(vid);
                this.update()
            })
        });
    }

    onMediaLoaded = item => {};
}

customElements.define('tivins-mason', Mason);
