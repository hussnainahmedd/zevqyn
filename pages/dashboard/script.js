
(function () {

    const SUPABASE_URL =
        "https://phjizxajnigiiawitkyx.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

    const API_BASE =
        "https://zevqyn-backend.onrender.com/api/v1";


    /* =========================
       LOAD SUPABASE
    ========================= */

    function loadSupabase() {

        return new Promise(function (resolve, reject) {

            if (window.supabase) {
                resolve();
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";

            script.onload = function () {
                resolve();
            };

            script.onerror = function () {
                reject(
                    new Error(
                        "Could not load Supabase."
                    )
                );
            };

            document.head.appendChild(script);
        });
    }


    /* =========================
       SAFE TEXT
    ========================= */

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value === null ||
            value === undefined
                ? ""
                : String(value);

        return div.innerHTML;
    }


    /* =========================
       DATE FORMAT
    ========================= */

    function formatDate(value) {

        if (!value) {
            return "";
        }

        const date =
            new Date(value);

        if (Number.isNaN(date.getTime())) {
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


    /* =========================
       START DASHBOARD
    ========================= */

    async function startDashboard() {

        console.log(
            "ZEVQYN: Dashboard starting"
        );

        try {

            await loadSupabase();

        } catch (error) {

            console.error(
                "ZEVQYN: Supabase failed to load",
                error
            );

            return;
        }


        const client =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        /* =========================
           CHECK LOGIN
        ========================= */

        const sessionResult =
            await client.auth.getSession();

        const session =
            sessionResult.data.session;


        if (!session) {

            window.location.href =
                "/login/";

            return;
        }


        const user =
            session.user;


        /* =========================
           API HELPER
        ========================= */

        async function apiRequest(endpoint) {

            const response =
                await fetch(
                    API_BASE + endpoint,
                    {
                        method: "GET",
                        headers: {
                            "Authorization":
                                "Bearer " +
                                session.access_token,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    "API " +
                    response.status +
                    ": " +
                    message
                );
            }


            return await response.json();
        }


        /* =========================
           USER HEADER
        ========================= */

        let fullName =
            "ZEVQYN User";


        if (user.user_metadata) {

            if (user.user_metadata.full_name) {

                fullName =
                    user.user_metadata.full_name;
            }
        }


        const email =
            user.email || "";


        const nameElement =
            document.getElementById(
                "zevqyn-user-name"
            );

        const emailElement =
            document.getElementById(
                "zevqyn-user-email"
            );

        const avatarElement =
            document.getElementById(
                "zevqyn-user-avatar"
            );

        const welcomeElement =
            document.getElementById(
                "zevqyn-welcome"
            );


        if (nameElement) {

            nameElement.textContent =
                fullName;
        }


        if (emailElement) {

            emailElement.textContent =
                email;
        }


        if (avatarElement) {

            let firstLetter =
                fullName.charAt(0);

            if (!firstLetter) {
                firstLetter = "Z";
            }

            avatarElement.textContent =
                firstLetter.toUpperCase();
        }


        if (welcomeElement) {

            let firstName =
                fullName.split(" ")[0];

            welcomeElement.textContent =
                "Welcome back, " +
                firstName +
                " 👋";
        }


        /* =========================
           GET DASHBOARD ELEMENTS
        ========================= */

        const researchCountElement =
            document.getElementById(
                "zevqyn-research-count"
            );

        const documentCountElement =
            document.getElementById(
                "zevqyn-document-count"
            );

        const projectCountElement =
            document.getElementById(
                "zevqyn-project-count"
            );

        const profileCompletionElement =
            document.getElementById(
                "zevqyn-profile-completion"
            );

        const recentResearchElement =
            document.getElementById(
                "zevqyn-recent-research"
            );


        /* =========================
           DEFAULT LOADING VALUES
        ========================= */

        if (researchCountElement) {
            researchCountElement.textContent = "—";
        }

        if (documentCountElement) {
            documentCountElement.textContent = "—";
        }

        if (projectCountElement) {
            projectCountElement.textContent = "—";
        }

        if (profileCompletionElement) {
            profileCompletionElement.textContent = "—";
        }


        /* =========================
           LOAD WORKSPACES
        ========================= */

        let workspaces = [];


        try {

            const result =
                await apiRequest(
                    "/workspaces"
                );


            if (Array.isArray(result)) {

                workspaces =
                    result;
            }


            if (researchCountElement) {

                researchCountElement.textContent =
                    workspaces.length;
            }


            console.log(
                "ZEVQYN: Workspaces loaded",
                workspaces
            );

        } catch (error) {

            console.error(
                "ZEVQYN: Workspace load failed",
                error
            );

            if (researchCountElement) {
                researchCountElement.textContent = "0";
            }
        }


        /* =========================
           LOAD DOCUMENT COUNT
        ========================= */

        let documentCount = 0;


        if (workspaces.length > 0) {

            const documentRequests =
                workspaces.map(
                    async function (workspace) {

                        try {

                            const documents =
                                await apiRequest(
                                    "/workspaces/" +
                                    encodeURIComponent(
                                        workspace.id
                                    ) +
                                    "/documents"
                                );


                            if (Array.isArray(documents)) {

                                return documents.length;
                            }

                            return 0;

                        } catch (error) {

                            console.error(
                                "ZEVQYN: Documents failed for workspace",
                                workspace.id,
                                error
                            );

                            return 0;
                        }
                    }
                );


            const documentCounts =
                await Promise.all(
                    documentRequests
                );


            documentCounts.forEach(
                function (count) {

                    documentCount += count;
                }
            );
        }


        if (documentCountElement) {

            documentCountElement.textContent =
                documentCount;
        }


        console.log(
            "ZEVQYN: Total documents",
            documentCount
        );


        /* =========================
           LOAD PROJECTS
        ========================= */

        let projects = [];


        try {

            const result =
                await apiRequest(
                    "/projects"
                );


            if (Array.isArray(result)) {

                projects =
                    result;
            }


            if (projectCountElement) {

                projectCountElement.textContent =
                    projects.length;
            }


            console.log(
                "ZEVQYN: Projects loaded",
                projects
            );

        } catch (error) {

            console.error(
                "ZEVQYN: Projects load failed",
                error
            );

            if (projectCountElement) {
                projectCountElement.textContent = "0";
            }
        }


        /* =========================
           LOAD PROFILE
        ========================= */

        let profile = null;


        try {

            profile =
                await apiRequest(
                    "/profile"
                );


            const fields = [
                "username",
                "full_name",
                "bio",
                "avatar_url",
                "location",
                "website",
                "github_url",
                "linkedin_url",
                "phone"
            ];


            let completedFields = 0;


            fields.forEach(
                function (field) {

                    const value =
                        profile[field];

                    if (value !== null) {

                        if (value !== undefined) {

                            if (
                                String(value).trim() !== ""
                            ) {

                                completedFields += 1;
                            }
                        }
                    }
                }
            );


            const completion =
                Math.round(
                    (
                        completedFields /
                        fields.length
                    ) *
                    100
                );


            if (profileCompletionElement) {

                profileCompletionElement.textContent =
                    completion + "%";
            }


            /*
             * Prefer Career Profile name/avatar
             * over Auth metadata when available.
             */

            if (profile.full_name) {

                fullName =
                    profile.full_name;

                if (nameElement) {

                    nameElement.textContent =
                        fullName;
                }


                if (welcomeElement) {

                    welcomeElement.textContent =
                        "Welcome back, " +
                        fullName.split(" ")[0] +
                        " 👋";
                }


                if (avatarElement) {

                    avatarElement.textContent =
                        fullName
                            .charAt(0)
                            .toUpperCase();
                }
            }


            console.log(
                "ZEVQYN: Profile loaded",
                profile
            );

        } catch (error) {

            console.error(
                "ZEVQYN: Profile load failed",
                error
            );

            if (profileCompletionElement) {

                profileCompletionElement.textContent =
                    "0%";
            }
        }


        /* =========================
           LOAD RESUMES
        ========================= */

        let resumes = [];


        try {

            const result =
                await apiRequest(
                    "/resumes"
                );


            if (Array.isArray(result)) {

                resumes =
                    result;
            }


            console.log(
                "ZEVQYN: Resumes loaded",
                resumes
            );

        } catch (error) {

            console.error(
                "ZEVQYN: Resumes load failed",
                error
            );
        }


        /* =========================
           LOAD PORTFOLIOS
        ========================= */

        let portfolios = [];


        try {

            const result =
                await apiRequest(
                    "/portfolios"
                );


            if (Array.isArray(result)) {

                portfolios =
                    result;
            }


            console.log(
                "ZEVQYN: Portfolios loaded",
                portfolios
            );

        } catch (error) {

            console.error(
                "ZEVQYN: Portfolios load failed",
                error
            );
        }


        /* =========================
           RECENT RESEARCH
        ========================= */

        if (recentResearchElement) {

            recentResearchElement.innerHTML =
                "";


            if (workspaces.length === 0) {

                recentResearchElement.innerHTML =
                    '<div class="zev-research">' +
                        '<div class="zev-file-icon">＋</div>' +
                        '<div class="zev-research-info">' +
                            '<div class="zev-research-name">' +
                                'Start your first research workspace' +
                            '</div>' +
                            '<div class="zev-research-meta">' +
                                'Upload PDF, DOCX, TXT or Markdown' +
                            '</div>' +
                        '</div>' +
                        '<a class="zev-status" href="/research/">' +
                            'Get started' +
                        '</a>' +
                    '</div>';

            } else {

                const sortedWorkspaces =
                    workspaces.slice();


                sortedWorkspaces.sort(
                    function (a, b) {

                        const aValue =
                            a.updated_at ||
                            a.created_at ||
                            "";

                        const bValue =
                            b.updated_at ||
                            b.created_at ||
                            "";

                        return (
                            new Date(bValue).getTime() -
                            new Date(aValue).getTime()
                        );
                    }
                );


                const recentWorkspaces =
                    sortedWorkspaces.slice(
                        0,
                        3
                    );


                recentWorkspaces.forEach(
                    function (workspace) {

                        const item =
                            document.createElement(
                                "a"
                            );

                        item.className =
                            "zev-research";

                        item.href =
                            "/research-workspace/?id=" +
                            encodeURIComponent(
                                workspace.id
                            );


                        const displayDate =
                            formatDate(
                                workspace.updated_at ||
                                workspace.created_at
                            );


                        const description =
                            workspace.description
                                ? workspace.description
                                : "Research workspace";


                        item.innerHTML =
                            '<div class="zev-file-icon">▣</div>' +
                            '<div class="zev-research-info">' +
                                '<div class="zev-research-name">' +
                                    escapeHtml(
                                        workspace.name
                                    ) +
                                '</div>' +
                                '<div class="zev-research-meta">' +
                                    escapeHtml(
                                        description
                                    ) +
                                    (
                                        displayDate
                                            ? " · " +
                                              escapeHtml(
                                                  displayDate
                                              )
                                            : ""
                                    ) +
                                '</div>' +
                            '</div>' +
                            '<span class="zev-status">' +
                                'Open' +
                            '</span>';


                        recentResearchElement.appendChild(
                            item
                        );
                    }
                );
            }
        }


        /* =========================
           CAREER WORKFLOW PROGRESS
        ========================= */

        let workflowSteps = 0;


        if (workspaces.length > 0) {
            workflowSteps += 1;
        }


        if (projects.length > 0) {
            workflowSteps += 1;
        }


        if (resumes.length > 0) {
            workflowSteps += 1;
        }


        if (portfolios.length > 0) {
            workflowSteps += 1;
        }


        const workflowProgress =
            document.querySelector(
                ".zev-progress span"
            );


        if (workflowProgress) {

            workflowProgress.style.width =
                (
                    workflowSteps *
                    25
                ) +
                "%";
        }


        /* =========================
           SIGN OUT
        ========================= */

        const signOutButton =
            document.getElementById(
                "zevqyn-signout"
            );


        if (signOutButton) {

            signOutButton.onclick =
                async function (event) {

                    event.preventDefault();


                    const result =
                        await client.auth.signOut();


                    if (result.error) {

                        console.error(
                            "ZEVQYN: Sign out failed",
                            result.error
                        );

                        alert(
                            "Unable to sign out. Please try again."
                        );

                        return;
                    }


                    window.location.href =
                        "/login/";
                };
        }


        console.log(
            "ZEVQYN: DASHBOARD READY",
            {
                workspaces:
                    workspaces.length,
                documents:
                    documentCount,
                projects:
                    projects.length,
                resumes:
                    resumes.length,
                portfolios:
                    portfolios.length
            }
        );
    }


    /* =========================
       INITIALIZE
    ========================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                startDashboard();
            }
        );

    } else {

        startDashboard();
    }

})();
