import {ScrollToTop} from "./js/components/ScrollToTop.js";
import {Toasts} from "./js/modules/Toasts.js";
import {Util} from "./js/modules/Util.js";
import {ModalManager} from "./js/modules/ModalManager.js";
import {API} from "./js/modules/API.js";
import {ContextMenu} from "./js/components/ContextMenu.js";

document.body.append(new ScrollToTop());


Toasts.instance.addToastDefault("Hello world, I'm an HTML toast and I'll disappear is few seconds...");

// Router.listenLinks()
// Router.addRoute('/', 'examples/scroll.js');
// Router.addRoute('/ article/([0-9]*)', '/ front/ js/ pages/ pageArticle. js');
// Router.init();

// ModalManager.instance.showLoading();
// ModalManager.instance.show('Hello world');


window.oncontextmenu = e => {
    e.preventDefault();
    e.stopPropagation();
};
document.querySelector('#demo-contextMenu').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ctxMenu = ContextMenu.getInstance();
    ctxMenu.show(e.pageX, e.pageY);
});
document.querySelector('#demo-apiCall').addEventListener('click', () => {
    API.get('/examples/apiResult.json').then((response) => {
        document.querySelector('#api_result').innerHTML = JSON.stringify(response);
    })
});
document.querySelector('#demo-addPopup').addEventListener('click', () => {
    ModalManager.instance.show('Hello world');
});
document.querySelector('#demo-addToast').addEventListener('click', () => {
    Toasts.instance.addToastDefault("Basic toast message std");
    Toasts.instance.addToastDefault("Basic toast message error", 0, "error");
    const element1 = Util.element('div', {className: 'p-1', innerHTML: "HTMLElement<br>1"})
    const element2 = Util.element('div', {className: 'p-1', innerHTML: "HTMLElement<br>2"})
    Toasts.instance.addToast([element1, element2]);
})