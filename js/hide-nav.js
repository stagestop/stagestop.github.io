document.addEventListener("DOMContentLoaded", () => {
    let previousScroll = 0;
    let scrollTimer;

    const toggleElements = () => document.querySelectorAll("[data-nav-status='toggle']");
    const documentHeight = () => document.documentElement.scrollHeight;
    const viewportHeight = () => window.innerHeight || document.documentElement.clientHeight;

    function showToggle() {
        toggleElements().forEach((element) => {
            element.classList.remove("is-hidden");
            element.classList.add("is-visible");
        });
    }

    function hideToggle() {
        toggleElements().forEach((element) => {
            element.classList.remove("is-visible");
            element.classList.add("is-hidden");
        });
    }

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > 0 && currentScroll < documentHeight() - viewportHeight()) {
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(() => {
                if (currentScroll > previousScroll) {
                    showToggle();
                } else {
                    hideToggle();
                }

                previousScroll = currentScroll;
            }, 250);
        }
    }, { passive: true });
});
