(function () {
    "use strict";

    function visibleImageLinks(gallery) {
        return Array.prototype.slice
            .call(gallery.querySelectorAll(".image-lightbox"))
            .filter(function (link) {
                var item = link.closest(".project");
                return !item || !item.hidden;
            });
    }

    function createModal() {
        var modal = document.createElement("div");
        modal.className = "gallery-modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML =
            '<button type="button" class="gallery-modal-close" aria-label="Close gallery">&times;</button>' +
            '<button type="button" class="gallery-modal-nav gallery-modal-prev" aria-label="Previous image">&#8249;</button>' +
            '<div class="gallery-modal-content"></div>' +
            '<button type="button" class="gallery-modal-nav gallery-modal-next" aria-label="Next image">&#8250;</button>';
        document.body.appendChild(modal);
        return modal;
    }

    function initLightbox() {
        var modal = createModal();
        var content = modal.querySelector(".gallery-modal-content");
        var closeButton = modal.querySelector(".gallery-modal-close");
        var prevButton = modal.querySelector(".gallery-modal-prev");
        var nextButton = modal.querySelector(".gallery-modal-next");
        var activeGallery = null;
        var activeIndex = -1;
        var lastFocused = null;

        function close() {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("gallery-modal-open");
            content.innerHTML = "";
            activeGallery = null;
            activeIndex = -1;
            if (lastFocused) {
                lastFocused.focus();
            }
        }

        function updateNav() {
            var showNav = activeGallery && visibleImageLinks(activeGallery).length > 1;
            prevButton.hidden = !showNav;
            nextButton.hidden = !showNav;
        }

        function openImage(link) {
            var links = visibleImageLinks(activeGallery);
            activeIndex = links.indexOf(link);
            content.innerHTML = "";

            var image = document.createElement("img");
            image.src = link.getAttribute("href");
            image.alt = link.dataset.lightboxAlt || "";
            content.appendChild(image);
            updateNav();
        }

        function moveImage(step) {
            var links = activeGallery ? visibleImageLinks(activeGallery) : [];
            if (!links.length) {
                return;
            }

            activeIndex = (activeIndex + step + links.length) % links.length;
            openImage(links[activeIndex]);
        }

        function openInline(target) {
            var source = document.querySelector(target);
            if (!source) {
                return;
            }

            activeGallery = null;
            activeIndex = -1;
            content.innerHTML = "";
            content.appendChild(source.cloneNode(true));
            content.firstElementChild.hidden = false;
            updateNav();
        }

        document.addEventListener("click", function (event) {
            var imageLink = event.target.closest(".image-lightbox");
            var inlineLink = event.target.closest(".inline-lightbox");

            if (!imageLink && !inlineLink) {
                return;
            }

            event.preventDefault();
            lastFocused = imageLink || inlineLink;
            activeGallery = imageLink ? imageLink.closest(".gallery-lightbox") : null;

            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("gallery-modal-open");

            if (imageLink) {
                openImage(imageLink);
            } else {
                openInline(inlineLink.getAttribute("href"));
            }

            closeButton.focus();
        });

        modal.addEventListener("click", function (event) {
            if (event.target === modal || event.target === closeButton) {
                close();
            }
        });

        prevButton.addEventListener("click", function () {
            moveImage(-1);
        });

        nextButton.addEventListener("click", function () {
            moveImage(1);
        });

        document.addEventListener("keydown", function (event) {
            if (!modal.classList.contains("is-open")) {
                return;
            }

            if (event.key === "Escape") {
                close();
            } else if (event.key === "ArrowLeft") {
                moveImage(-1);
            } else if (event.key === "ArrowRight") {
                moveImage(1);
            }
        });
    }

    function initFilters() {
        document.querySelectorAll(".portfolio-filter").forEach(function (filter) {
            var section = filter.closest(".portfolio-type2");
            var grid = section && section.querySelector(".gallery-grid");
            if (!grid) {
                return;
            }

            filter.addEventListener("click", function (event) {
                var link = event.target.closest("[data-group]");
                if (!link) {
                    return;
                }

                event.preventDefault();
                var group = link.dataset.group;

                filter.querySelectorAll("[data-group]").forEach(function (item) {
                    item.classList.toggle("active", item === link);
                });

                grid.querySelectorAll(".project").forEach(function (item) {
                    item.hidden = group !== "all" && item.dataset.group !== group;
                });
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initFilters();
        initLightbox();
    });
})();
