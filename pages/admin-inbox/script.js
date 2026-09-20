
function zevAdminInboxInitialize() {

    var API_BASE =
        "https://zevqyn-backend.onrender.com";

    var SUPABASE_URL =
        "https://phjizxajnigiiawitkyx.supabase.co";

    var SUPABASE_KEY =
        "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";


    var root =
        document.getElementById(
            "zev-admin-inbox"
        );

    if (!root) {
        return;
    }


    var messageList =
        document.getElementById(
            "zai-message-list"
        );

    var detail =
        document.getElementById(
            "zai-detail"
        );

    var searchField =
        document.getElementById(
            "zai-search"
        );

    var filterField =
        document.getElementById(
            "zai-filter"
        );

    var refreshButton =
        document.getElementById(
            "zai-refresh"
        );

    var statusBox =
        document.getElementById(
            "zai-status"
        );


    var messages = [];

    var selectedId = null;

    var accessToken = null;


    /* =====================================
       HELPERS
       ===================================== */

    function zaiEscape(value) {

        var element =
            document.createElement("div");

        element.textContent =
            value === null
                ? ""
                : String(value);

        return element.innerHTML;

    }


    function zaiShowStatus(
        message,
        type
    ) {

        if (!statusBox) {
            return;
        }

        statusBox.className =
            "zai-status zai-show " +
            type;

        statusBox.textContent =
            message;

    }


    function zaiHideStatus() {

        if (!statusBox) {
            return;
        }

        statusBox.className =
            "zai-status";

        statusBox.textContent = "";

    }


    function zaiFormatDate(value) {

        if (!value) {
            return "";
        }

        var date =
            new Date(value);

        if (
            isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }
        );

    }


    function zaiGetStatusClass(
        status
    ) {

        if (status === "new") {
            return "zai-pill-new";
        }

        if (status === "read") {
            return "zai-pill-read";
        }

        if (status === "replied") {
            return "zai-pill-replied";
        }

        return "zai-pill-archived";

    }


    /* =====================================
       SUPABASE SESSION
       ===================================== */

  function zaiGetSession() {

    var storageKey =
        "sb-phjizxajnigiiawitkyx-auth-token";

    var storedValue =
        window.localStorage.getItem(
            storageKey
        );

    if (!storedValue) {

        zaiShowStatus(
            "Please sign in to ZEVQYN again.",
            "zai-error"
        );

        return;

    }


    var storedData = null;

    try {

        storedData =
            JSON.parse(
                storedValue
            );

    } catch (error) {

        zaiShowStatus(
            "Your ZEVQYN login session could not be read.",
            "zai-error"
        );

        return;

    }


    var token = null;


    if (storedData) {

        if (storedData.access_token) {

            token =
                storedData.access_token;

        }


        if (!token) {

            if (storedData.currentSession) {

                if (
                    storedData.currentSession.access_token
                ) {

                    token =
                        storedData.currentSession.access_token;

                }

            }

        }


        if (!token) {

            if (storedData.session) {

                if (
                    storedData.session.access_token
                ) {

                    token =
                        storedData.session.access_token;

                }

            }

        }

    }


    if (!token) {

        zaiShowStatus(
            "Your ZEVQYN session token could not be found. Please sign in again.",
            "zai-error"
        );

        return;

    }


    accessToken = token;


    zaiHideStatus();


    zaiLoadMessages();

}


    /* =====================================
       API REQUEST
       ===================================== */

    function zaiApiRequest(
        method,
        path,
        body,
        callback
    ) {

        if (!accessToken) {

            zaiShowStatus(
                "Your ZEVQYN session is unavailable.",
                "zai-error"
            );

            return;

        }


        var request =
            new XMLHttpRequest();


        request.open(
            method,
            API_BASE + path,
            true
        );


        request.setRequestHeader(
            "Authorization",
            "Bearer " + accessToken
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


                var data = null;


                try {

                    data =
                        JSON.parse(
                            request.responseText
                        );

                } catch (error) {

                    data = null;

                }


                callback(
                    request.status,
                    data
                );

            };


        request.onerror =
            function () {

                callback(
                    0,
                    null
                );

            };


        if (body) {

            request.send(
                JSON.stringify(body)
            );

        } else {

            request.send();

        }

    }


    /* =====================================
       LOAD MESSAGES
       ===================================== */

    function zaiLoadMessages() {

        if (messageList) {

            messageList.innerHTML =
                '<div class="zai-loading">' +
                'Loading messages...' +
                '</div>';

        }


        zaiHideStatus();


        zaiApiRequest(
            "GET",
            "/api/v1/contact/messages",
            null,
            function (
                status,
                data
            ) {

                if (status === 401) {

                    zaiShowStatus(
                        "Your session has expired. Please sign in again.",
                        "zai-error"
                    );

                    return;

                }


                if (status === 403) {

                    zaiShowStatus(
                        "Admin access is required to view this inbox.",
                        "zai-error"
                    );

                    if (messageList) {
                        messageList.innerHTML = "";
                    }

                    return;

                }


                if (status !== 200) {

                    zaiShowStatus(
                        "Unable to load contact messages.",
                        "zai-error"
                    );

                    return;

                }


                if (
                    !Array.isArray(data)
                ) {

                    zaiShowStatus(
                        "Unexpected response from the server.",
                        "zai-error"
                    );

                    return;

                }


                messages = data;


                zaiUpdateStats();

                zaiRenderList();


                if (
                    selectedId
                ) {

                    zaiRenderSelected();

                }

            }
        );

    }


    /* =====================================
       STATS
       ===================================== */

    function zaiUpdateStats() {

        var total =
            messages.length;

        var newCount = 0;

        var readCount = 0;

        var repliedCount = 0;


        messages.forEach(
            function (message) {

                if (
                    message.status ===
                    "new"
                ) {
                    newCount += 1;
                }

                if (
                    message.status ===
                    "read"
                ) {
                    readCount += 1;
                }

                if (
                    message.status ===
                    "replied"
                ) {
                    repliedCount += 1;
                }

            }
        );


        document.getElementById(
            "zai-total-count"
        ).textContent =
            String(total);


        document.getElementById(
            "zai-new-count"
        ).textContent =
            String(newCount);


        document.getElementById(
            "zai-read-count"
        ).textContent =
            String(readCount);


        document.getElementById(
            "zai-replied-count"
        ).textContent =
            String(repliedCount);

    }


    /* =====================================
       FILTER
       ===================================== */

    function zaiFilteredMessages() {

        var query = "";

        var filter = "all";


        if (searchField) {

            query =
                searchField.value
                    .trim()
                    .toLowerCase();

        }


        if (filterField) {

            filter =
                filterField.value;

        }


        return messages.filter(
            function (message) {

                if (
                    filter !== "all"
                ) {

                    if (
                        message.status !==
                        filter
                    ) {
                        return false;
                    }

                }


                if (!query) {
                    return true;
                }


                var combined =
                    String(
                        message.name || ""
                    ).toLowerCase() +
                    " " +
                    String(
                        message.email || ""
                    ).toLowerCase() +
                    " " +
                    String(
                        message.subject || ""
                    ).toLowerCase() +
                    " " +
                    String(
                        message.message || ""
                    ).toLowerCase();


                return (
                    combined.indexOf(
                        query
                    ) !== -1
                );

            }
        );

    }


    /* =====================================
       LIST
       ===================================== */

    function zaiRenderList() {

        if (!messageList) {
            return;
        }


        var filtered =
            zaiFilteredMessages();


        var visibleCount =
            document.getElementById(
                "zai-visible-count"
            );


        if (visibleCount) {

            visibleCount.textContent =
                String(
                    filtered.length
                );

        }


        if (
            filtered.length === 0
        ) {

            messageList.innerHTML =
                '<div class="zai-no-results">' +
                'No messages found.' +
                '</div>';

            return;

        }


        var html = "";


        filtered.forEach(
            function (message) {

                var activeClass = "";

                if (
                    selectedId ===
                    message.id
                ) {

                    activeClass =
                        " zai-active";

                }


                var preview =
                    message.message || "";


                html +=
                    '<div class="zai-message-item' +
                    activeClass +
                    '" data-message-id="' +
                    zaiEscape(
                        message.id
                    ) +
                    '">' +

                    '<div class="zai-item-top">' +

                    '<div class="zai-sender">' +
                    zaiEscape(
                        message.name
                    ) +
                    '</div>' +

                    '<div class="zai-date">' +
                    zaiEscape(
                        zaiFormatDate(
                            message.created_at
                        )
                    ) +
                    '</div>' +

                    '</div>' +

                    '<div class="zai-item-subject">' +
                    zaiEscape(
                        message.subject
                    ) +
                    '</div>' +

                    '<div class="zai-item-preview">' +
                    zaiEscape(
                        preview
                    ) +
                    '</div>' +

                    '<span class="zai-status-pill ' +
                    zaiGetStatusClass(
                        message.status
                    ) +
                    '">' +
                    zaiEscape(
                        message.status
                    ) +
                    '</span>' +

                    '</div>';

            }
        );


        messageList.innerHTML =
            html;


        var items =
            messageList.querySelectorAll(
                ".zai-message-item"
            );


        items.forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        selectedId =
                            item.getAttribute(
                                "data-message-id"
                            );


                        zaiRenderList();

                        zaiRenderSelected();

                    }
                );

            }
        );

    }


    /* =====================================
       DETAIL
       ===================================== */

    function zaiFindSelected() {

        var selected = null;


        messages.forEach(
            function (message) {

                if (
                    message.id ===
                    selectedId
                ) {

                    selected =
                        message;

                }

            }
        );


        return selected;

    }


    function zaiRenderSelected() {

        if (!detail) {
            return;
        }


        var message =
            zaiFindSelected();


        if (!message) {

            detail.innerHTML =
                '<div class="zai-empty">' +
                '<div class="zai-empty-icon">✉</div>' +
                '<h2>Select a message</h2>' +
                '<p>Choose a contact message from the inbox to read it here.</p>' +
                '</div>';

            return;

        }


        var replyLink =
            "mailto:" +
            encodeURIComponent(
                message.email
            ) +
            "?subject=" +
            encodeURIComponent(
                "Re: " +
                message.subject +
                " — ZEVQYN"
            );


        detail.innerHTML =

            '<div class="zai-detail-top">' +

                '<div>' +

                    '<div class="zai-detail-label">' +
                    'Contact message' +
                    '</div>' +

                    '<h2>' +
                    zaiEscape(
                        message.subject
                    ) +
                    '</h2>' +

                '</div>' +

                '<div class="zai-detail-date">' +
                zaiEscape(
                    zaiFormatDate(
                        message.created_at
                    )
                ) +
                '</div>' +

            '</div>' +


            '<div class="zai-person">' +

                '<div class="zai-person-box">' +

                    '<span>From</span>' +

                    '<strong>' +
                    zaiEscape(
                        message.name
                    ) +
                    '</strong>' +

                '</div>' +


                '<div class="zai-person-box">' +

                    '<span>Email</span>' +

                    '<a href="mailto:' +
                    zaiEscape(
                        message.email
                    ) +
                    '">' +
                    zaiEscape(
                        message.email
                    ) +
                    '</a>' +

                '</div>' +

            '</div>' +


            '<div class="zai-message-body">' +
            zaiEscape(
                message.message
            ) +
            '</div>' +


            '<div class="zai-actions">' +

                '<select id="zai-status-select">' +

                    '<option value="new">' +
                    'New' +
                    '</option>' +

                    '<option value="read">' +
                    'Read' +
                    '</option>' +

                    '<option value="replied">' +
                    'Replied' +
                    '</option>' +

                    '<option value="archived">' +
                    'Archived' +
                    '</option>' +

                '</select>' +


                '<button ' +
                'id="zai-save-status" ' +
                'class="zai-action-button" ' +
                'type="button">' +
                'Update status' +
                '</button>' +


                '<a class="zai-action-button zai-reply" href="' +
                zaiEscape(
                    replyLink
                ) +
                '">' +
                'Reply by email' +
                '</a>' +

            '</div>';


        var statusSelect =
            document.getElementById(
                "zai-status-select"
            );


        if (statusSelect) {

            statusSelect.value =
                message.status;

        }


        var saveButton =
            document.getElementById(
                "zai-save-status"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                function () {

                    zaiUpdateMessageStatus(
                        message.id,
                        statusSelect.value
                    );

                }
            );

        }


        if (
            message.status === "new"
        ) {

            zaiUpdateMessageStatus(
                message.id,
                "read",
                true
            );

        }

    }


    /* =====================================
       UPDATE STATUS
       ===================================== */

    function zaiUpdateMessageStatus(
        id,
        newStatus,
        silent
    ) {

        zaiApiRequest(
            "PATCH",
            "/api/v1/contact/messages/" +
            encodeURIComponent(id),
            {
                status: newStatus
            },
            function (
                status,
                data
            ) {

                if (status !== 200) {

                    if (!silent) {

                        zaiShowStatus(
                            "Unable to update message status.",
                            "zai-error"
                        );

                    }

                    return;

                }


                messages.forEach(
                    function (message) {

                        if (
                            message.id === id
                        ) {

                            message.status =
                                data.status;

                        }

                    }
                );


                zaiUpdateStats();

                zaiRenderList();

                zaiRenderSelected();


                if (!silent) {

                    zaiShowStatus(
                        "Message status updated.",
                        "zai-info"
                    );

                }

            }
        );

    }


    /* =====================================
       SEARCH + FILTER
       ===================================== */

    if (searchField) {

        searchField.addEventListener(
            "input",
            function () {

                zaiRenderList();

            }
        );

    }


    if (filterField) {

        filterField.addEventListener(
            "change",
            function () {

                zaiRenderList();

            }
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                zaiLoadMessages();

            }
        );

    }


    /* =====================================
       START
       ===================================== */

    zaiGetSession();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            zevAdminInboxInitialize();

        }
    );

} else {

    zevAdminInboxInitialize();

}
