
(function () {

    /* =========================================
       ZEVQYN PROJECTS
    ========================================= */

    const SUPABASE_URL =
        "https://phjizxajnigiiawitkyx.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

    const API_BASE =
        "https://zevqyn-backend.onrender.com";


    let supabaseClient = null;

    let currentSession = null;

    let projects = [];

    let visibleProjects = [];

    let pendingDeleteProjectId = null;


    /* =========================================
       HELPERS
    ========================================= */

    function el(id) {

        return document.getElementById(id);

    }


    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value === null ||
            value === undefined
                ? ""
                : String(value);

        return div.innerHTML;

    }


    function showToast(message, type) {

        const toast =
            el("zevqyn-project-toast");

        if (!toast) {
            return;
        }

        toast.textContent =
            message;

        toast.className =
            "zev-toast " +
            (type || "");

        toast.hidden = false;


        setTimeout(
            function () {

                toast.hidden = true;

            },
            3500
        );

    }


    function formatDate(value) {

        if (!value) {
            return "";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
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


    function normalizeArray(value) {

        if (Array.isArray(value)) {
            return value;
        }


        if (typeof value === "string") {

            return value
                .split(",")
                .map(
                    function (item) {
                        return item.trim();
                    }
                )
                .filter(
                    function (item) {
                        return item.length > 0;
                    }
                );

        }


        return [];

    }


    /* =========================================
       SUPABASE
    ========================================= */

    function loadSupabase() {

        return new Promise(
            function (resolve, reject) {

                if (window.supabase) {

                    resolve();

                    return;

                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";


                script.onload =
                    function () {

                        resolve();

                    };


                script.onerror =
                    function () {

                        reject(
                            new Error(
                                "Could not load Supabase."
                            )
                        );

                    };


                document.head.appendChild(
                    script
                );

            }
        );

    }


    /* =========================================
       API
    ========================================= */

    async function apiRequest(
        path,
        options
    ) {

        if (!currentSession) {

            throw new Error(
                "Your login session has expired."
            );

        }


        const settings =
            options || {};


        if (!settings.headers) {

            settings.headers = {};

        }


        settings.headers[
            "Authorization"
        ] =
            "Bearer " +
            currentSession.access_token;


        const response =
            await fetch(
                API_BASE + path,
                settings
            );


        if (response.status === 401) {

            await supabaseClient
                .auth
                .signOut();


            window.location.href =
                "https://zevqyn.free.je/login/";


            throw new Error(
                "Session expired."
            );

        }


        if (!response.ok) {

            let message =
                "Request failed (" +
                response.status +
                ").";


            try {

                const errorData =
                    await response.json();


                if (errorData.detail) {

                    if (
                        typeof errorData.detail ===
                        "string"
                    ) {

                        message =
                            errorData.detail;

                    } else {

                        message =
                            JSON.stringify(
                                errorData.detail
                            );

                    }

                }

            } catch (error) {

                /* keep default message */

            }


            throw new Error(message);

        }


        if (response.status === 204) {

            return null;

        }


        return await response.json();

    }


    /* =========================================
       USER
    ========================================= */

    function displayUser(user) {

        const metadata =
            user.user_metadata || {};


        const fullName =
            metadata.full_name ||
            metadata.name ||
            "ZEVQYN User";


        const email =
            user.email || "";


        const nameElement =
            el("zevqyn-user-name");

        const emailElement =
            el("zevqyn-user-email");

        const avatarElement =
            el("zevqyn-user-avatar");


        if (nameElement) {

            nameElement.textContent =
                fullName;

        }


        if (emailElement) {

            emailElement.textContent =
                email;

        }


        if (avatarElement) {

            avatarElement.textContent =
                fullName
                    .charAt(0)
                    .toUpperCase();

        }

    }


    /* =========================================
       LOAD PROJECTS
    ========================================= */

    async function loadProjects() {

        const loading =
            el("zevqyn-projects-loading");

        const empty =
            el("zevqyn-no-projects");


        if (loading) {

            loading.style.display =
                "flex";

        }


        if (empty) {

            empty.hidden = true;

            empty.style.display =
                "none";

        }


        try {

            const result =
                await apiRequest(
                    "/api/v1/projects",
                    {
                        method: "GET"
                    }
                );


            if (Array.isArray(result)) {

                projects = result;

            } else {

                projects = [];

            }


            applyProjectFilters();

            updateStats();


        } catch (error) {

            console.error(
                "Projects loading error:",
                error
            );


            showToast(
                error.message ||
                "Could not load projects.",
                "error"
            );


        } finally {

            if (loading) {

                loading.style.display =
                    "none";

            }

        }

    }


    /* =========================================
       PROJECT FILTERS
    ========================================= */

    function applyProjectFilters() {

        const searchInput =
            el("zevqyn-project-search");

        const filterElement =
            el("zevqyn-project-filter");

        const sortElement =
            el("zevqyn-project-sort");


        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const filter =
            filterElement
                ? filterElement.value
                : "all";


        const sort =
            sortElement
                ? sortElement.value
                : "updated";


        visibleProjects =
            projects.filter(
                function (project) {

                    const title =
                        String(
                            project.title || ""
                        ).toLowerCase();


                    const description =
                        String(
                            project.short_description ||
                            project.description ||
                            ""
                        ).toLowerCase();


                    const technologies =
                        normalizeArray(
                            project.technologies
                        )
                            .join(" ")
                            .toLowerCase();


                    if (search) {

                        const matchesSearch =
                            title.indexOf(search) !== -1 ||
                            description.indexOf(search) !== -1 ||
                            technologies.indexOf(search) !== -1;


                        if (!matchesSearch) {

                            return false;

                        }

                    }


                    const hasResearch =
                        Boolean(
                            project.source_workspace_id ||
                            project.workspace_id ||
                            project.research_workspace_id ||
                            project.source_document_id
                        );


                    const isPublic =
                        Boolean(
                            project.is_public
                        );


                    if (
                        filter === "research" &&
                        !hasResearch
                    ) {

                        return false;

                    }


                    if (
                        filter === "manual" &&
                        hasResearch
                    ) {

                        return false;

                    }


                    if (
                        filter === "public" &&
                        !isPublic
                    ) {

                        return false;

                    }


                    if (
                        filter === "private" &&
                        isPublic
                    ) {

                        return false;

                    }


                    return true;

                }
            );


        visibleProjects.sort(
            function (a, b) {

                if (sort === "name") {

                    return String(
                        a.title || ""
                    ).localeCompare(
                        String(
                            b.title || ""
                        )
                    );

                }


                if (sort === "oldest") {

                    return (
                        new Date(
                            a.created_at || 0
                        ).getTime() -
                        new Date(
                            b.created_at || 0
                        ).getTime()
                    );

                }


                if (sort === "newest") {

                    return (
                        new Date(
                            b.created_at || 0
                        ).getTime() -
                        new Date(
                            a.created_at || 0
                        ).getTime()
                    );

                }


                return (
                    new Date(
                        b.updated_at ||
                        b.created_at ||
                        0
                    ).getTime() -
                    new Date(
                        a.updated_at ||
                        a.created_at ||
                        0
                    ).getTime()
                );

            }
        );


        renderProjects();

    }


    /* =========================================
       RENDER PROJECTS
    ========================================= */

    function renderProjects() {

        const grid =
            el("zevqyn-project-grid");

        const empty =
            el("zevqyn-no-projects");

        const label =
            el("zevqyn-projects-label");


        if (label) {

            label.textContent =
                visibleProjects.length +
                (
                    visibleProjects.length === 1
                        ? " project"
                        : " projects"
                );

        }


        if (!grid) {

            return;

        }


        grid.innerHTML = "";


        if (visibleProjects.length === 0) {

            if (empty) {

                empty.hidden = false;

                empty.style.display =
                    "flex";

            }

            return;

        }


        if (empty) {

            empty.hidden = true;

            empty.style.display =
                "none";

        }


        visibleProjects.forEach(
            function (project) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "zev-project-card";


                const title =
                    escapeHTML(
                        project.title ||
                        "Untitled Project"
                    );


                const description =
                    escapeHTML(
                        project.short_description ||
                        project.description ||
                        "No description yet."
                    );


                const technologies =
                    normalizeArray(
                        project.technologies
                    );


                const hasResearch =
                    Boolean(
                        project.source_workspace_id ||
                        project.workspace_id ||
                        project.research_workspace_id ||
                        project.source_document_id
                    );


                const isPublic =
                    Boolean(
                        project.is_public
                    );


                let badges = "";


                if (hasResearch) {

                    badges +=
                        '<span class="zev-project-badge research">' +
                            'From Research' +
                        '</span>';

                }


                badges +=
                    '<span class="zev-project-badge">' +
                        (
                            isPublic
                                ? "Public"
                                : "Private"
                        ) +
                    '</span>';


                let techHTML = "";


                technologies
                    .slice(0, 5)
                    .forEach(
                        function (technology) {

                            techHTML +=
                                '<span class="zev-tech-tag">' +
                                    escapeHTML(
                                        technology
                                    ) +
                                '</span>';

                        }
                    );


                if (
                    technologies.length > 5
                ) {

                    techHTML +=
                        '<span class="zev-tech-tag">' +
                            "+" +
                            (
                                technologies.length -
                                5
                            ) +
                        '</span>';

                }


                const dateText =
                    formatDate(
                        project.updated_at ||
                        project.created_at
                    );


                card.innerHTML =
                    '<div class="zev-project-card-top">' +

                        '<div class="zev-project-card-icon">' +
                            '◆' +
                        '</div>' +

                        '<div class="zev-project-badges">' +
                            badges +
                        '</div>' +

                    '</div>' +

                    '<h3>' +
                        title +
                    '</h3>' +

                    '<p class="zev-project-description">' +
                        description +
                    '</p>' +

                    '<div class="zev-project-tech">' +
                        techHTML +
                    '</div>' +

                    '<div class="zev-project-card-footer">' +

                        '<span class="zev-project-date">' +
                            (
                                dateText
                                    ? "Updated " +
                                      escapeHTML(
                                          dateText
                                      )
                                    : ""
                            ) +
                        '</span>' +

                        '<div class="zev-project-actions">' +

                            '<button type="button" class="zev-project-action zev-open-project">' +
                                'Open' +
                            '</button>' +

                            '<button type="button" class="zev-project-action delete zev-delete-project">' +
                                'Delete' +
                            '</button>' +

                        '</div>' +

                    '</div>';


                const openButton =
                    card.querySelector(
                        ".zev-open-project"
                    );


                const deleteButton =
                    card.querySelector(
                        ".zev-delete-project"
                    );


                if (openButton) {

                    openButton.addEventListener(
                        "click",
                        function () {

                            window.location.href =
                                "/project-workspace/?id=" +
                                encodeURIComponent(
                                    project.id
                                );

                        }
                    );

                }


                if (deleteButton) {

                    deleteButton.addEventListener(
                        "click",
                        function () {

                            openDeleteModal(
                                project.id
                            );

                        }
                    );

                }


                grid.appendChild(card);

            }
        );

    }


    /* =========================================
       STATS
    ========================================= */

    function updateStats() {

        let researchCount = 0;

        let publicCount = 0;


        projects.forEach(
            function (project) {

                const hasResearch =
                    Boolean(
                        project.source_workspace_id ||
                        project.workspace_id ||
                        project.research_workspace_id ||
                        project.source_document_id
                    );


                if (hasResearch) {

                    researchCount += 1;

                }


                if (project.is_public) {

                    publicCount += 1;

                }

            }
        );


        const total =
            el("zevqyn-project-count");

        const research =
            el(
                "zevqyn-research-project-count"
            );

        const publicProjects =
            el(
                "zevqyn-public-project-count"
            );


        if (total) {

            total.textContent =
                projects.length;

        }


        if (research) {

            research.textContent =
                researchCount;

        }


        if (publicProjects) {

            publicProjects.textContent =
                publicCount;

        }

    }


    /* =========================================
       CREATE MODAL
    ========================================= */

    function openCreateModal() {

        const modal =
            el("zevqyn-project-modal");

        if (!modal) {

            return;

        }


        modal.hidden = false;


        const title =
            el("zevqyn-project-title");


        if (title) {

            setTimeout(
                function () {

                    title.focus();

                },
                50
            );

        }

    }


    function closeCreateModal() {

        const modal =
            el("zevqyn-project-modal");

        const form =
            el("zevqyn-project-form");


        if (modal) {

            modal.hidden = true;

        }


        if (form) {

            form.reset();

        }

    }


    /* =========================================
       CREATE PROJECT
    ========================================= */

    async function createProject(event) {

        event.preventDefault();


        const titleElement =
            el("zevqyn-project-title");

        const descriptionElement =
            el(
                "zevqyn-project-description"
            );

        const technologiesElement =
            el(
                "zevqyn-project-technologies"
            );

        const githubElement =
            el("zevqyn-project-github");

        const liveElement =
            el("zevqyn-project-live");

        const publicElement =
            el("zevqyn-project-public");

        const submitButton =
            el("zevqyn-project-submit");


        const title =
            titleElement
                ? titleElement.value.trim()
                : "";


        if (!title) {

            showToast(
                "Enter a project title.",
                "error"
            );

            return;

        }


        const technologies =
            technologiesElement
                ? normalizeArray(
                    technologiesElement.value
                )
                : [];


        const payload = {

            title: title,

            short_description:
                descriptionElement
                    ? descriptionElement
                        .value
                        .trim()
                    : "",

            description:
                descriptionElement
                    ? descriptionElement
                        .value
                        .trim()
                    : "",

            technologies:
                technologies,

            github_url:
                githubElement
                    ? githubElement
                        .value
                        .trim() || null
                    : null,

            live_url:
                liveElement
                    ? liveElement
                        .value
                        .trim() || null
                    : null

            

        };


        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Creating...";

        }


        try {

            await apiRequest(
                "/api/v1/projects",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


            closeCreateModal();


            showToast(
                "Project created successfully.",
                "success"
            );


            await loadProjects();


        } catch (error) {

            console.error(
                "Project creation error:",
                error
            );


            showToast(
                error.message ||
                "Could not create project.",
                "error"
            );


        } finally {

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Create Project";

            }

        }

    }


    /* =========================================
       DELETE PROJECT
    ========================================= */

    function openDeleteModal(
        projectId
    ) {

        pendingDeleteProjectId =
            projectId;


        const modal =
            el(
                "zevqyn-project-delete-modal"
            );


        if (modal) {

            modal.hidden = false;

        }

    }


    function closeDeleteModal() {

        pendingDeleteProjectId =
            null;


        const modal =
            el(
                "zevqyn-project-delete-modal"
            );


        if (modal) {

            modal.hidden = true;

        }

    }


    async function confirmDeleteProject() {

        if (!pendingDeleteProjectId) {

            return;

        }


        const projectId =
            pendingDeleteProjectId;


        const button =
            el(
                "zevqyn-project-delete-confirm"
            );


        if (button) {

            button.disabled = true;

            button.textContent =
                "Deleting...";

        }


        try {

            await apiRequest(
                "/api/v1/projects/" +
                projectId,
                {
                    method: "DELETE"
                }
            );


            closeDeleteModal();


            showToast(
                "Project deleted.",
                "success"
            );


            await loadProjects();


        } catch (error) {

            showToast(
                error.message ||
                "Could not delete project.",
                "error"
            );


        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "Delete Project";

            }

        }

    }


    /* =========================================
       EVENTS
    ========================================= */

    function setupEvents() {

        const newProject =
            el("zevqyn-new-project");

        const emptyNewProject =
            el(
                "zevqyn-empty-new-project"
            );

        const modalClose =
            el(
                "zevqyn-project-modal-close"
            );

        const cancel =
            el("zevqyn-project-cancel");

        const form =
            el("zevqyn-project-form");

        const search =
            el("zevqyn-project-search");

        const filter =
            el("zevqyn-project-filter");

        const sort =
            el("zevqyn-project-sort");

        const deleteCancel =
            el(
                "zevqyn-project-delete-cancel"
            );

        const deleteConfirm =
            el(
                "zevqyn-project-delete-confirm"
            );

        const signOut =
            el("zevqyn-signout");


        if (newProject) {

            newProject.addEventListener(
                "click",
                openCreateModal
            );

        }


        if (emptyNewProject) {

            emptyNewProject.addEventListener(
                "click",
                openCreateModal
            );

        }


        if (modalClose) {

            modalClose.addEventListener(
                "click",
                closeCreateModal
            );

        }


        if (cancel) {

            cancel.addEventListener(
                "click",
                closeCreateModal
            );

        }


        if (form) {

            form.addEventListener(
                "submit",
                createProject
            );

        }


        if (search) {

            search.addEventListener(
                "input",
                applyProjectFilters
            );

        }


        if (filter) {

            filter.addEventListener(
                "change",
                applyProjectFilters
            );

        }


        if (sort) {

            sort.addEventListener(
                "change",
                applyProjectFilters
            );

        }


        if (deleteCancel) {

            deleteCancel.addEventListener(
                "click",
                closeDeleteModal
            );

        }


        if (deleteConfirm) {

            deleteConfirm.addEventListener(
                "click",
                confirmDeleteProject
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


        const backdrops =
            document.querySelectorAll(
                ".zev-modal-backdrop"
            );


        backdrops.forEach(
            function (backdrop) {

                backdrop.addEventListener(
                    "click",
                    function () {

                        closeCreateModal();

                        closeDeleteModal();

                    }
                );

            }
        );

    }


    /* =========================================
       START
    ========================================= */

    async function startProjects() {

        try {

            await loadSupabase();


            supabaseClient =
                window.supabase
                    .createClient(
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


            await loadProjects();


        } catch (error) {

            console.error(
                "ZEVQYN Projects error:",
                error
            );


            const loading =
                el(
                    "zevqyn-projects-loading"
                );


            if (loading) {

                loading.style.display =
                    "none";

            }


            showToast(
                error.message ||
                "Could not start Projects.",
                "error"
            );

        }

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                startProjects();

            }
        );

    } else {

        startProjects();

    }

})();
