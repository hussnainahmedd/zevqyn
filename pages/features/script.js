
function zevFeaturesInitialize() {

    var featureLinks =
        document.querySelectorAll(
            '#zev-genz-features a[href^="#"]'
        );

    featureLinks.forEach(
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
            "#zev-genz-features .zgf-feature-card, " +
            "#zev-genz-features .zgf-step, " +
            "#zev-genz-features .zgf-ai-tool-grid > div"
        );


    revealItems.forEach(
        function (item) {
            item.classList.add("zgf-reveal");
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
                                    "zgf-visible"
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
                item.classList.add("zgf-visible");
            }
        );
    }
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            zevFeaturesInitialize();
        }
    );

} else {

    zevFeaturesInitialize();
}
