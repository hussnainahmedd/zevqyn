
function zevContactInitialize() {

    var contactForm =
        document.getElementById("zct-contact-form");

    var subjectField =
        document.getElementById("zct-subject");

    var messageField =
        document.getElementById("zct-message");

    var countField =
        document.getElementById("zct-count");

    var responseBox =
        document.getElementById("zct-form-response");

    var submitButton =
        document.getElementById("zct-submit");

    var typeCards =
        document.querySelectorAll(
            "#zev-contact-page .zct-type-card"
        );


    /* =====================================
       CONTACT TYPE CARDS
       ===================================== */

    typeCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                typeCards.forEach(
                    function (item) {

                        item.classList.remove(
                            "zct-selected"
                        );

                    }
                );

                card.classList.add(
                    "zct-selected"
                );

                var selectedType =
                    card.getAttribute(
                        "data-contact-type"
                    );

                if (subjectField) {

                    subjectField.value =
                        selectedType;

                }


                var formSection =
                    document.getElementById(
                        "zct-form-section"
                    );

                if (formSection) {

                    formSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


    /* =====================================
       CHARACTER COUNTER
       ===================================== */

    if (messageField) {

        messageField.addEventListener(
            "input",
            function () {

                if (countField) {

                    countField.textContent =
                        String(
                            messageField.value.length
                        );

                }

            }
        );

    }


    /* =====================================
       ERROR HELPERS
       ===================================== */

    function zctSetError(
        field,
        message
    ) {

        if (!field) {
            return;
        }

        var parent =
            field.parentElement;

        if (!parent) {
            return;
        }

        var error =
            parent.querySelector(
                ".zct-error"
            );

        field.style.borderColor =
            "rgba(255, 100, 100, .65)";

        if (error) {

            error.textContent =
                message;

        }

    }


    function zctClearError(field) {

        if (!field) {
            return;
        }

        var parent =
            field.parentElement;

        if (!parent) {
            return;
        }

        var error =
            parent.querySelector(
                ".zct-error"
            );

        field.style.borderColor = "";

        if (error) {

            error.textContent = "";

        }

    }


    function zctEmailValid(email) {

        var atPosition =
            email.indexOf("@");

        var dotPosition =
            email.lastIndexOf(".");

        if (atPosition < 1) {
            return false;
        }

        if (
            dotPosition <
            atPosition + 2
        ) {
            return false;
        }

        if (
            dotPosition ===
            email.length - 1
        ) {
            return false;
        }

        return true;

    }


    /* =====================================
       RESPONSE MESSAGE
       ===================================== */

    function zctShowResponse(
        type,
        message
    ) {

        if (!responseBox) {
            return;
        }

        responseBox.className =
            "zct-form-response " +
            type;

        responseBox.textContent =
            message;

    }


    /* =====================================
       SUBMIT BUTTON
       ===================================== */

    function zctSetSending(
        sending
    ) {

        if (!submitButton) {
            return;
        }

        if (sending) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Sending...";

        } else {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Send message";

        }

    }


    /* =====================================
       FORM SUBMISSION
       ===================================== */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                var nameField =
                    document.getElementById(
                        "zct-name"
                    );

                var emailField =
                    document.getElementById(
                        "zct-email"
                    );


                if (!nameField) {
                    return;
                }

                if (!emailField) {
                    return;
                }

                if (!subjectField) {
                    return;
                }

                if (!messageField) {
                    return;
                }


                var valid = true;


                zctClearError(
                    nameField
                );

                zctClearError(
                    emailField
                );

                zctClearError(
                    subjectField
                );

                zctClearError(
                    messageField
                );


                var nameValue =
                    nameField.value.trim();

                var emailValue =
                    emailField.value.trim();

                var subjectValue =
                    subjectField.value;

                var messageValue =
                    messageField.value.trim();


                if (
                    nameValue.length < 2
                ) {

                    zctSetError(
                        nameField,
                        "Please enter your name."
                    );

                    valid = false;

                }


                if (
                    !zctEmailValid(
                        emailValue
                    )
                ) {

                    zctSetError(
                        emailField,
                        "Enter a valid email address."
                    );

                    valid = false;

                }


                if (!subjectValue) {

                    zctSetError(
                        subjectField,
                        "Choose a topic."
                    );

                    valid = false;

                }


                if (
                    messageValue.length < 10
                ) {

                    zctSetError(
                        messageField,
                        "Give us a little more detail."
                    );

                    valid = false;

                }


                if (!valid) {

                    if (responseBox) {

                        responseBox.className =
                            "zct-form-response";

                        responseBox.textContent =
                            "";

                    }

                    return;

                }


                /* =====================================
                   API PAYLOAD
                   ===================================== */

                var payload = {
                    name: nameValue,
                    email: emailValue,
                    subject: subjectValue,
                    message: messageValue
                };


                zctSetSending(true);


                zctShowResponse(
                    "zct-response-info",
                    "Sending your message..."
                );


                /* =====================================
                   API REQUEST
                   ===================================== */

                var request =
                    new XMLHttpRequest();


                request.open(
                    "POST",
                    "https://zevqyn-backend.onrender.com/api/v1/contact",
                    true
                );


                request.setRequestHeader(
                    "Content-Type",
                    "application/json"
                );


                request.onreadystatechange =
                    function () {

                        if (
                            request.readyState !== 4
                        ) {
                            return;
                        }


                        zctSetSending(false);


                        if (
                            request.status >= 200
                        ) {

                            if (
                                request.status < 300
                            ) {

                                zctShowResponse(
                                    "zct-response-success",
                                    "Message sent successfully! We'll get back to you soon."
                                );


                                contactForm.reset();


                                if (countField) {

                                    countField.textContent =
                                        "0";

                                }


                                typeCards.forEach(
                                    function (item) {

                                        item.classList.remove(
                                            "zct-selected"
                                        );

                                    }
                                );


                                return;

                            }

                        }


                        zctShowResponse(
                            "zct-response-error",
                            "We could not send your message. Please try again."
                        );

                    };


                request.onerror =
                    function () {

                        zctSetSending(false);

                        zctShowResponse(
                            "zct-response-error",
                            "We could not connect to ZEVQYN. Please try again."
                        );

                    };


                request.ontimeout =
                    function () {

                        zctSetSending(false);

                        zctShowResponse(
                            "zct-response-error",
                            "The request took too long. Please try again."
                        );

                    };


                request.timeout =
                    30000;


                request.send(
                    JSON.stringify(
                        payload
                    )
                );

            }
        );

    }


    /* =====================================
       FAQ
       ===================================== */

    var faqButtons =
        document.querySelectorAll(
            "#zev-contact-page .zct-faq-button"
        );


    faqButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    var item =
                        button.parentElement;

                    if (!item) {
                        return;
                    }


                    var answer =
                        item.querySelector(
                            ".zct-faq-answer"
                        );


                    var wasOpen =
                        item.classList.contains(
                            "zct-open"
                        );


                    var allItems =
                        document.querySelectorAll(
                            "#zev-contact-page .zct-faq-item"
                        );


                    allItems.forEach(
                        function (faqItem) {

                            faqItem.classList.remove(
                                "zct-open"
                            );


                            var faqAnswer =
                                faqItem.querySelector(
                                    ".zct-faq-answer"
                                );


                            if (faqAnswer) {

                                faqAnswer.style.maxHeight =
                                    null;

                            }

                        }
                    );


                    if (wasOpen) {
                        return;
                    }


                    item.classList.add(
                        "zct-open"
                    );


                    if (answer) {

                        answer.style.maxHeight =
                            answer.scrollHeight +
                            "px";

                    }

                }
            );

        }
    );


    /* =====================================
       SCROLL REVEAL
       ===================================== */

    var revealItems =
        document.querySelectorAll(
            "#zev-contact-page .zct-reveal"
        );


    if (
        "IntersectionObserver" in window
    ) {

        var observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add(
                                        "zct-visible"
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

                observer.observe(
                    item
                );

            }
        );

    } else {

        revealItems.forEach(
            function (item) {

                item.classList.add(
                    "zct-visible"
                );

            }
        );

    }

}


/* =====================================
   INITIALIZE
   ===================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            zevContactInitialize();

        }
    );

} else {

    zevContactInitialize();

}
