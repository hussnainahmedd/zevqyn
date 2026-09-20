
function zevHowInitialize() {

    var smoothLinks =
        document.querySelectorAll(
            '#zev-how-page a[href^="#"]'
        );

    smoothLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    var targetId =
                        link.getAttribute("href");

                    var target =
                        document.querySelector(targetId);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        }
    );


    var revealItems =
        document.querySelectorAll(
            "#zev-how-page .zhi-step-copy, " +
            "#zev-how-page .zhi-visual, " +
            "#zev-how-page .zhi-showcase, " +
            "#zev-how-page .zhi-flow-item, " +
            "#zev-how-page .zhi-loop-item"
        );


    revealItems.forEach(
        function (item) {
            item.classList.add("zhi-reveal");
        }
    );


    if ("IntersectionObserver" in window) {

        var observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (entry.isIntersecting) {

                                entry.target.classList.add(
                                    "zhi-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.08
                }
            );


        revealItems.forEach(
            function (item) {
                observer.observe(item);
            }
        );

    } else {

        revealItems.forEach(
            function (item) {
                item.classList.add("zhi-visible");
            }
        );
    }
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            zevHowInitialize();
        }
    );

} else {

    zevHowInitialize();
}
