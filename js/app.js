(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    var classes = [ ".property__description", ".property__heading" ];
    classes.forEach((function(cls) {
        var containers = document.querySelectorAll(cls);
        containers.forEach((function(container) {
            var mouseDown = false;
            var startX, scrollLeft;
            function startHandler(e) {
                mouseDown = true;
                startX = ("touches" in e ? e.touches[0].pageX : e.pageX) - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            }
            function endHandler() {
                mouseDown = false;
            }
            function moveHandler(e) {
                if (!mouseDown) return;
                e.preventDefault();
                var x = ("touches" in e ? e.touches[0].pageX : e.pageX) - container.offsetLeft;
                var walk = x - startX;
                container.scrollLeft = scrollLeft - walk;
            }
            container.addEventListener("mousedown", startHandler);
            container.addEventListener("touchstart", startHandler);
            container.addEventListener("mouseup", endHandler);
            container.addEventListener("mouseleave", endHandler);
            container.addEventListener("touchend", endHandler);
            container.addEventListener("mousemove", moveHandler);
            container.addEventListener("touchmove", moveHandler);
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        var burger = document.querySelector(".menu__icon");
        var menu = document.querySelector(".menu__body");
        burger.addEventListener("click", (function() {
            menu.classList.toggle("active");
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        var button1 = document.querySelector(".btns__finance");
        var button2 = document.querySelector(".btns__property");
        var bigBlock1 = document.querySelector(".finance");
        var bigBlock2 = document.querySelector(".property");
        if (button1 && bigBlock1) button1.addEventListener("click", (function() {
            bigBlock1.style.display = "flex";
            button1.closest(".single__wrapper").style.display = "none";
        }));
        if (button2 && bigBlock2) button2.addEventListener("click", (function() {
            bigBlock2.style.display = "flex";
            button2.closest(".single__wrapper").style.display = "none";
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        var burgerButton = document.querySelector(".menu__icon");
        var img = document.querySelector(".welcome__image");
        var isDown = false;
        img.style.transition = "margin-top 1s";
        burgerButton.addEventListener("click", (function() {
            if (isDown) img.style.marginTop = "0px"; else img.style.marginTop = "160px";
            isDown = !isDown;
        }));
    }));
    $(document).ready((function() {
        $(".single__item").slick({
            autoplay: false,
            infinite: false,
            slidesToShow: 1,
            prevArrow: `<button class="single__left pages__btn arrow-left"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="26" height="26" rx="13" transform="rotate(180 16 16)" fill="#EFEFEF"/><path d="M18 21L13 16L18 11" stroke="#574794" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`,
            nextArrow: `<button class="single__right pages__btn arrow-right"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="26" height="26" rx="13" fill="#EFEFEF"/><path d="M14 21L19 16L14 11" stroke="#574794" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`,
            appendArrows: $(".single__cont")
        });
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
})();