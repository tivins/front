/**
 *
 * Usage:
 *
 * HTML:
 * ```html
 * <div class="mason">
 *     <div class="mason-item"><img src="/path/img1.png" alt="" /></div>
 *     <!-- ... -->
 *     <div class="mason-item"><img src="/path/img24.png" alt="" /></div>
 * </div>
 * ```
 * JS:
 * ```js
 * const mason = new Mason(document.querySelector('.mason'));
 * mason.setColumnsCount(5);
 * mason.listenLoadEvents(); // update on <img> and <video> are loaded.
 * mason.update(); // initial positioning.
 * window.addEventListener('resize', e => mason.update()); // Update layout on resize.
 * ```
 */
export class Mason {
    /**
     * @type HTMLElement
     */
    #wrapperElement;
    /**
     * @see setColumnsCount()
     * @type {number}
     */
    #columnCount = 8;
    #columnWidth = 0;
    #columnsHeights = []

    constructor(wrapperElement) {
        this.#wrapperElement = wrapperElement;
    }

    update() {
        this.#columnWidth = 100 / this.#columnCount;
        this.#resetHeights();
        this.#pushItems(this.#wrapperElement.querySelectorAll(".mason-item"));
    }

    getColumnsCount() {
        return this.#columnCount;
    }
    setColumnsCount(v) {
        this.#columnCount = parseInt(v);
    }

    #pushItems(items) {
        const bigAvailable = [0];
        const bigIndex = bigAvailable[Math.round(Math.random() * (bigAvailable.length - 1))];
        let idx = 0;
        for (const item of items) {
            const big = bigIndex === idx;
            let columnIndex = this.#getLowestColumn();
            item.style.top = this.#columnsHeights[columnIndex] + 'px';
            item.style.left = (columnIndex * this.#columnWidth) + '%';
            item.style.width = (this.#columnWidth * ((big ? 2 : 1))) + '%';
            this.#columnsHeights[columnIndex] += item.offsetHeight;
            if (big) this.#columnsHeights[columnIndex + 1] += item.offsetHeight;
            idx++;
        }
        this.#wrapperElement.style.height = this.#columnsHeights[this.#getHighestColumn()] + 'px';
    }

    #resetHeights() {
        this.#columnsHeights = [];
        for (let i = 0; i < this.#columnCount; i++) {
            this.#columnsHeights[i] = 0;
        }
    }

    #getLowestColumn() {
        return this.#columnsHeights.reduce(
            (minIdx, currentValue, currentIndex, arr) => currentValue < arr[minIdx] ? currentIndex : minIdx, 0);
    }

    #getHighestColumn() {
        return this.#columnsHeights.reduce(
            (minIdx, currentValue, currentIndex, arr) => currentValue > arr[minIdx] ? currentIndex : minIdx, 0);
    }

    listenLoadEvents() {
        this.#wrapperElement.querySelectorAll('img').forEach(
            img => img.addEventListener('load',
                    e => this.update()
            )
        );
        this.#wrapperElement.querySelectorAll('video').forEach(
            vid => vid.addEventListener('loadeddata',
                    e => this.update()
            )
        );
    }
}
