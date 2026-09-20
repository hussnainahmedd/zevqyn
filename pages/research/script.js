
(function () {

    /* =========================================
       ZEVQYN RESEARCH
    ========================================= */

    const SUPABASE_URL =
        "https://phjizxajnigiiawitkyx.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

    const API_BASE =
        "https://zevqyn-backend.onrender.com";

    let supabaseClient = null;
    let currentSession = null;
    let workspaces = [];
    let documentCounts = {};

    /* =========================================
       LOAD SUPABASE
    ========================================= */

    function loadSupabase() {

        return new Promise(function (resolve, reject) {

            if (window.supabase) {
                resolve();
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";

            script.onload = function () {
                resolve();
            };

            script.onerror = function () {
                reject(new Error("Could not load Supabase."));
            };

            document.head.appendChild(script);

        });

    }


    /* =========================================
       HELPER
    ========================================= */

    function getElement(id) {
        return document.getElementById(id);
    }


    function escapeHTML(value) {

        const div = document.createElement("div");

        div.textContent = value || "";

        return div.innerHTML;

    }


    function showCreateMessage(message, success) {

        const element = getElement("zevqyn-create-message");

        if (!element) {
            return;
        }

        element.textContent = message || "";

        if (success) {
            element.style.color = "#4ed36f";
        } else {
            element.style.color = "#e16b6b";
        }

    }


    /* =========================================
       AUTHENTICATED BACKEND REQUEST
    ========================================= */

    async function apiRequest(path, options) {

        if (!currentSession) {
            throw new Error("Your session has expired.");
        }

        const requestOptions = options || {};

        if (!requestOptions.headers) {
            requestOptions.headers = {};
        }

        requestOptions.headers["Authorization"] =
            "Bearer " + currentSession.access_token;

        const response = await fetch(
            API_BASE + path,
            requestOptions
        );

        if (response.status === 401) {

            await supabaseClient.auth.signOut();

            window.location.href =
                "https://zevqyn.free.je/login/";

            throw new Error("Session expired.");

        }

        if (!response.ok) {

            let message =
                "Backend request failed (" +
                response.status +
                ").";

            try {

                const errorData = await response.json();

                if (errorData.detail) {

                    if (typeof errorData.detail === "string") {
                        message = errorData.detail;
                    }

                }

            } catch (error) {
                /* Keep default message */
            }

            throw new Error(message);

        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();

    }


    /* =========================================
       USER INFORMATION
    ========================================= */

    function displayUser(user) {

        const metadata = user.user_metadata || {};

        let fullName =
            metadata.full_name ||
            metadata.name ||
            "ZEVQYN User";

        const email =
            user.email || "";

        let firstLetter = "Z";

        if (fullName) {
            firstLetter =
                fullName.charAt(0).toUpperCase();
        }

        const nameElement =
            getElement("zevqyn-user-name");

        const emailElement =
            getElement("zevqyn-user-email");

        const avatarElement =
            getElement("zevqyn-user-avatar");


        if (nameElement) {
            nameElement.textContent = fullName;
        }

        if (emailElement) {
            emailElement.textContent = email;
        }

        if (avatarElement) {
            avatarElement.textContent = firstLetter;
        }

    }


    /* =========================================
       LOADING / EMPTY STATE
    ========================================= */

    function showLoading() {

        const loading =
            getElement("zevqyn-research-loading");

        const grid =
            getElement("zevqyn-workspace-grid");

        const empty =
            getElement("zevqyn-empty-state");

        if (loading) {
            loading.style.display = "flex";
        }

        if (grid) {
            grid.style.display = "none";
        }

        if (empty) {
            empty.style.display = "none";
        }

    }


    function hideLoading() {

        const loading =
            getElement("zevqyn-research-loading");

        if (loading) {
            loading.style.display = "none";
        }

    }


    /* =========================================
       LOAD WORKSPACES
    ========================================= */

    async function loadWorkspaces() {

        showLoading();

        try {

            const result =
                await apiRequest(
                    "/api/v1/workspaces",
                    {
                        method: "GET"
                    }
                );

            if (Array.isArray(result)) {
                workspaces = result;
            } else {
                workspaces = [];
            }

            await loadDocumentCounts();

            updateStatistics();

            renderWorkspaces();

        } catch (error) {

            hideLoading();

            console.error(
                "Workspace loading error:",
                error
            );

            const empty =
                getElement("zevqyn-empty-state");

            if (empty) {
                empty.style.display = "flex";
            }

        }

    }


    /* =========================================
       DOCUMENT COUNTS
    ========================================= */

    async function loadDocumentCounts() {

        documentCounts = {};

        const requests =
            workspaces.map(async function (workspace) {

                try {

                    const documents =
                        await apiRequest(
                            "/api/v1/workspaces/" +
                            workspace.id +
                            "/documents",
                            {
                                method: "GET"
                            }
                        );

                    if (Array.isArray(documents)) {

                        documentCounts[workspace.id] =
                            documents.length;

                    } else {

                        documentCounts[workspace.id] = 0;

                    }

                } catch (error) {

                    documentCounts[workspace.id] = 0;

                }

            });

        await Promise.all(requests);

    }


    /* =========================================
       STATISTICS
    ========================================= */

    function updateStatistics() {

        const workspaceCount =
            getElement("zevqyn-workspace-count");

        const documentCount =
            getElement("zevqyn-document-count");

        const chatCount =
            getElement("zevqyn-chat-count");


        if (workspaceCount) {

            workspaceCount.textContent =
                workspaces.length;

        }


        let totalDocuments = 0;

        Object.keys(documentCounts).forEach(
            function (key) {

                totalDocuments +=
                    Number(documentCounts[key] || 0);

            }
        );


        if (documentCount) {

            documentCount.textContent =
                totalDocuments;

        }


        /*
           Chat counting will be connected when
           we build the individual workspace/chat UI.
        */

        if (chatCount) {
            chatCount.textContent = "0";
        }

    }


    /* =========================================
       DATE
    ========================================= */

    function formatDate(value) {

        if (!value) {
            return "Recently created";
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return "Recently created";
        }

        return date.toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }


    /* =========================================
       FILTER + SORT
    ========================================= */

    function getVisibleWorkspaces() {

        let result =
            workspaces.slice();

        const searchInput =
            getElement("zevqyn-research-search");

        const sortInput =
            getElement("zevqyn-research-sort");


        let query = "";

        if (searchInput) {

            query =
                searchInput.value
                    .trim()
                    .toLowerCase();

        }


        if (query) {

            result = result.filter(
                function (workspace) {

                    const name =
                        String(
                            workspace.name || ""
                        ).toLowerCase();

                    const description =
                        String(
                            workspace.description || ""
                        ).toLowerCase();


                    if (name.indexOf(query) !== -1) {
                        return true;
                    }

                    if (
                        description.indexOf(query) !== -1
                    ) {
                        return true;
                    }

                    return false;

                }
            );

        }


        let sortValue = "recent";

        if (sortInput) {
            sortValue = sortInput.value;
        }


        result.sort(
            function (a, b) {

                if (sortValue === "name") {

                    return String(a.name || "")
                        .localeCompare(
                            String(b.name || "")
                        );

                }


                const aDate =
                    new Date(
                        a.updated_at ||
                        a.created_at ||
                        0
                    ).getTime();

                const bDate =
                    new Date(
                        b.updated_at ||
                        b.created_at ||
                        0
                    ).getTime();


                if (sortValue === "oldest") {
                    return aDate - bDate;
                }

                return bDate - aDate;

            }
        );


        return result;

    }


    /* =========================================
       RENDER WORKSPACES
    ========================================= */

    function renderWorkspaces() {

        hideLoading();

        const grid =
            getElement("zevqyn-workspace-grid");

        const empty =
            getElement("zevqyn-empty-state");


        if (!grid) {
            return;
        }


        if (workspaces.length === 0) {

            grid.innerHTML = "";
            grid.style.display = "none";

            if (empty) {
                empty.style.display = "flex";
            }

            return;

        }


        if (empty) {
            empty.style.display = "none";
        }


        const visible =
            getVisibleWorkspaces();


        grid.style.display = "grid";
        grid.innerHTML = "";


        if (visible.length === 0) {

            grid.innerHTML =
                '<div style="' +
                'grid-column:1/-1;' +
                'padding:45px 20px;' +
                'text-align:center;' +
                'color:#7f8b93;' +
                'font-size:13px;' +
                '">' +
                'No research workspaces match your search.' +
                '</div>';

            return;

        }


        visible.forEach(
            function (workspace) {

                const card =
                    document.createElement("div");

                card.className =
                    "zev-workspace-card";


                const description =
                    workspace.description ||
                    "No description added yet.";


                const documents =
                    documentCounts[
                        workspace.id
                    ] || 0;


                card.innerHTML =
                    '<div style="' +
                    'display:flex;' +
                    'justify-content:space-between;' +
                    'gap:12px;' +
                    'margin-bottom:16px;' +
                    '">' +

                        '<div style="' +
                        'width:38px;' +
                        'height:38px;' +
                        'border-radius:9px;' +
                        'background:rgba(53,184,91,.1);' +
                        'color:#4ed36f;' +
                        'display:flex;' +
                        'align-items:center;' +
                        'justify-content:center;' +
                        'font-size:17px;' +
                        '">' +
                        '▣' +
                        '</div>' +

                        '<span style="' +
                        'color:#647078;' +
                        'font-size:10px;' +
                        '">' +
                        documents +
                        ' document' +
                        (documents === 1 ? "" : "s") +
                        '</span>' +

                    '</div>' +

                    '<h3 style="' +
                    'margin:0 0 8px;' +
                    'color:#fff;' +
                    'font-size:15px;' +
                    'font-weight:800;' +
                    '">' +
                    escapeHTML(workspace.name) +
                    '</h3>' +

                    '<p style="' +
                    'margin:0 0 18px;' +
                    'color:#78858d;' +
                    'font-size:11px;' +
                    'line-height:1.6;' +
                    '">' +
                    escapeHTML(description) +
                    '</p>' +

                    '<div style="' +
                    'color:#59666d;' +
                    'font-size:9px;' +
                    '">' +
                    'Updated ' +
                    escapeHTML(
                        formatDate(
                            workspace.updated_at ||
                            workspace.created_at
                        )
                    ) +
                    '</div>';


                card.addEventListener(
                    "click",
                    function () {

                        /*
                           Next step:
                           open individual Research Workspace.
                        */

                      card.addEventListener(
    "click",
    function () {

        window.location.assign(
            "/research-workspace/?id=" +
            encodeURIComponent(workspace.id)
        );

    }
);

                    }
                );


                grid.appendChild(card);

            }
        );

    }


    /* =========================================
       MODAL
    ========================================= */

    function openModal() {

        const modal =
            getElement("zevqyn-create-modal");

        const title =
            getElement("zevqyn-research-title");

        if (!modal) {
            return;
        }

        modal.hidden = false;

        showCreateMessage("", false);

        setTimeout(
            function () {

                if (title) {
                    title.focus();
                }

            },
            100
        );

    }


    function closeModal() {

        const modal =
            getElement("zevqyn-create-modal");

        const form =
            getElement(
                "zevqyn-create-research-form"
            );

        if (modal) {
            modal.hidden = true;
        }

        if (form) {
            form.reset();
        }

        showCreateMessage("", false);

    }


    /* =========================================
       CREATE WORKSPACE
    ========================================= */

    async function createWorkspace(event) {

        event.preventDefault();


        const titleInput =
            getElement("zevqyn-research-title");

        const descriptionInput =
            getElement(
                "zevqyn-research-description"
            );

        const button =
            getElement("zevqyn-create-btn");


        if (!titleInput) {
            return;
        }


        const name =
            titleInput.value.trim();

        let description = "";

        if (descriptionInput) {
            description =
                descriptionInput.value.trim();
        }


        if (!name) {

            showCreateMessage(
                "Please enter a workspace title.",
                false
            );

            return;

        }


        if (button) {

            button.disabled = true;
            button.textContent = "Creating...";

        }


        showCreateMessage(
            "Creating your workspace...",
            true
        );


        try {

            const created =
                await apiRequest(
                    "/api/v1/workspaces",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            description: description
                        })
                    }
                );


            if (created) {

                showCreateMessage(
                    "Workspace created successfully.",
                    true
                );


                await loadWorkspaces();


                setTimeout(
                    function () {
                        closeModal();
                    },
                    500
                );

            }


        } catch (error) {

            console.error(
                "Create workspace error:",
                error
            );

            showCreateMessage(
                error.message ||
                "Could not create workspace.",
                false
            );

        } finally {

            if (button) {

                button.disabled = false;
                button.textContent =
                    "Create Workspace";

            }

        }

    }


    /* =========================================
       EVENTS
    ========================================= */

    function setupEvents() {

        const newButton =
            getElement("zevqyn-new-research");

        const emptyButton =
            getElement("zevqyn-empty-create");

        const closeButton =
            getElement("zevqyn-modal-close");

        const cancelButton =
            getElement("zevqyn-modal-cancel");

        const modal =
            getElement("zevqyn-create-modal");

        const form =
            getElement(
                "zevqyn-create-research-form"
            );

        const search =
            getElement("zevqyn-research-search");

        const sort =
            getElement("zevqyn-research-sort");

        const signOut =
            getElement("zevqyn-signout");


        if (newButton) {

            newButton.addEventListener(
                "click",
                openModal
            );

        }


        if (emptyButton) {

            emptyButton.addEventListener(
                "click",
                openModal
            );

        }


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeModal
            );

        }


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeModal
            );

        }


        if (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (event.target === modal) {
                        closeModal();
                    }

                }
            );

        }


        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Escape") {
                    closeModal();
                }

            }
        );


        if (form) {

            form.addEventListener(
                "submit",
                createWorkspace
            );

        }


        if (search) {

            search.addEventListener(
                "input",
                renderWorkspaces
            );

        }


        if (sort) {

            sort.addEventListener(
                "change",
                renderWorkspaces
            );

        }


        if (signOut) {

            signOut.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();

                    await supabaseClient
                        .auth
                        .signOut();

                    window.location.href =
                        "https://zevqyn.free.je/login/";

                }
            );

        }

    }


    /* =========================================
       START APP
    ========================================= */

    async function startResearchPage() {

        try {

            await loadSupabase();


            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );


            const sessionResult =
                await supabaseClient
                    .auth
                    .getSession();


            currentSession =
                sessionResult.data.session;


            if (!currentSession) {

                window.location.href =
                    "https://zevqyn.free.je/login/";

                return;

            }


            displayUser(
                currentSession.user
            );


            setupEvents();


            await loadWorkspaces();


        } catch (error) {

            console.error(
                "ZEVQYN Research initialization error:",
                error
            );


            const loading =
                getElement(
                    "zevqyn-research-loading"
                );

            if (loading) {

                loading.innerHTML =
                    '<div style="' +
                    'color:#e16b6b;' +
                    'text-align:center;' +
                    'line-height:1.7;' +
                    '">' +
                    'Could not load your research workspace.' +
                    '<br>' +
                    '<span style="' +
                    'color:#77838b;' +
                    'font-size:10px;' +
                    '">' +
                    escapeHTML(error.message) +
                    '</span>' +
                    '</div>';

            }

        }

    }


  if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            startResearchPage();
        }
    );

} else {

    startResearchPage();

}

})();
