window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");

    document.body.style.overflow = "visible";

    if (!preloader) {
        return;
    }

    window.setTimeout(() => {
        preloader.style.transition = "opacity 600ms ease";
        preloader.style.opacity = "0";

        window.setTimeout(() => {
            preloader.style.display = "none";
        }, 600);
    }, 350);
});
