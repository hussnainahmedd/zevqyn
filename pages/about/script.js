function zevqynAboutInitialize() {

    var revealItems = document.querySelectorAll(".za-reveal");

    if ("IntersectionObserver" in window) {

        var revealObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("za-visible");
                        revealObserver.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });

    } else {

        revealItems.forEach(function (item) {
            item.classList.add("za-visible");
        });

    }


    var visual = document.querySelector(".za-visual");

    if (visual) {

        visual.addEventListener("mousemove", function (event) {

            if (window.innerWidth <= 1024) {
                return;
            }

            var rect = visual.getBoundingClientRect();

            var mouseX = event.clientX - rect.left;
            var mouseY = event.clientY - rect.top;

            var rotateY =
                ((mouseX / rect.width) - 0.5) * 3;

            var rotateX =
                ((mouseY / rect.height) - 0.5) * -3;

            visual.style.transform =
                "rotate(-1.5deg) perspective(1000px) rotateX(" +
                rotateX +
                "deg) rotateY(" +
                rotateY +
                "deg)";
        });


        visual.addEventListener("mouseleave", function () {

            visual.style.transform =
                "rotate(-1.5deg) perspective(1000px) rotateX(0deg) rotateY(0deg)";

        });

    }

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            zevqynAboutInitialize();
        }
    );

} else {

    zevqynAboutInitialize();

}