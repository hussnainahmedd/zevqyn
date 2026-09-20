
/* =========================================
   ZEVQYN PROJECT WORKSPACE
========================================= */


/* =========================================
   CONFIG
========================================= */

const ZEV_PW_SUPABASE_URL =
    "https://phjizxajnigiiawitkyx.supabase.co";

const ZEV_PW_SUPABASE_KEY =
    "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

const ZEV_PW_API_BASE =
    "https://zevqyn-backend.onrender.com";


/* =========================================
   STATE
========================================= */

let zevPwSupabase = null;
let zevPwSession = null;
let zevPwProject = null;

let zevPwTechnologies = [];
let zevPwSkills = [];

let zevPwToastTimer = null;


/* =========================================
   HELPERS
========================================= */

function zevPwEl(id) {
    return document.getElementById(id);
}


function zevPwGetProjectId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


function zevPwShowToast(
    message,
    type
) {

    const toast =
        zevPwEl("zevqyn-project-toast");

    if (!toast) {
        return;
    }

    if (zevPwToastTimer) {
        clearTimeout(
            zevPwToastTimer
        );
    }

    toast.textContent =
        message;

    toast.className =
        "zev-pw-toast " +
        (type || "");

    toast.hidden = false;

    zevPwToastTimer =
        setTimeout(
            function () {

                toast.hidden = true;

            },
            3500
        );

}


function zevPwShowError(message) {

    const loading =
        zevPwEl(
            "zevqyn-project-loading"
        );

    const content =
        zevPwEl(
            "zevqyn-project-content"
        );

    const error =
        zevPwEl(
            "zevqyn-project-error"
        );

    const errorMessage =
        zevPwEl(
            "zevqyn-project-error-message"
        );

    if (loading) {
        loading.hidden = true;
    }

    if (content) {
        content.hidden = true;
    }

    if (errorMessage) {
        errorMessage.textContent =
            message;
    }

    if (error) {
        error.hidden = false;
    }

}


function zevPwFormatDate(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
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


function zevPwNormalizeUrl(value) {

    const clean =
        String(
            value || ""
        ).trim();

    if (!clean) {
        return "";
    }

    return clean;

}


/* =========================================
   LOAD SUPABASE
========================================= */

function zevPwLoadSupabaseLibrary() {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (
                window.supabase
            ) {
                resolve();
                return;
            }

            const existing =
                document.querySelector(
                    'script[src*="supabase-js"]'
                );

            if (existing) {

                existing.addEventListener(
                    "load",
                    function () {
                        resolve();
                    }
                );

                existing.addEventListener(
                    "error",
                    function () {
                        reject(
                            new Error(
                                "Could not load authentication library."
                            )
                        );
                    }
                );

                return;
            }


            const script =
                document.createElement(
                    "script"
                );

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

            script.onload =
                function () {
                    resolve();
                };

            script.onerror =
                function () {

                    reject(
                        new Error(
                            "Could not load authentication library."
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
   AUTH
========================================= */

async function zevPwSetupAuth() {

    await zevPwLoadSupabaseLibrary();

    zevPwSupabase =
        window.supabase.createClient(
            ZEV_PW_SUPABASE_URL,
            ZEV_PW_SUPABASE_KEY
        );

    const result =
        await zevPwSupabase.auth
            .getSession();

    zevPwSession =
        result.data.session;

    if (!zevPwSession) {

        window.location.assign(
            "/login/"
        );

        throw new Error(
            "Authentication required."
        );
    }

}


/* =========================================
   API
========================================= */

async function zevPwApiRequest(
    path,
    options
) {

    if (!zevPwSession) {

        throw new Error(
            "Your session has expired."
        );

    }

    const requestOptions =
        options || {};

    const headers =
        new Headers(
            requestOptions.headers || {}
        );

    headers.set(
        "Authorization",
        "Bearer " +
        zevPwSession.access_token
    );

    const response =
        await fetch(
            ZEV_PW_API_BASE + path,
            {
                method:
                    requestOptions.method ||
                    "GET",

                headers:
                    headers,

                body:
                    requestOptions.body
            }
        );


    if (response.status === 401) {

        throw new Error(
            "Your session has expired. Please sign in again."
        );

    }


    let data = null;

    try {

        data =
            await response.json();

    } catch (error) {

        data = null;

    }


    if (!response.ok) {

        let message =
            "Request failed.";

        if (data) {

            if (data.detail) {

                if (
                    typeof data.detail ===
                    "string"
                ) {

                    message =
                        data.detail;

                } else {

                    message =
                        JSON.stringify(
                            data.detail
                        );

                }

            }

        }

        throw new Error(
            message
        );

    }


    return data;

}


/* =========================================
   LOAD PROJECT
========================================= */

async function zevPwLoadProject() {

    const projectId =
        zevPwGetProjectId();

    if (!projectId) {

        zevPwShowError(
            "No project ID was provided in the page URL."
        );

        return;
    }


    try {

        const project =
            await zevPwApiRequest(
                "/api/v1/projects/" +
                encodeURIComponent(
                    projectId
                )
            );

        zevPwProject =
            project;

        zevPwPopulateProject(
            project
        );


        const loading =
            zevPwEl(
                "zevqyn-project-loading"
            );

        const content =
            zevPwEl(
                "zevqyn-project-content"
            );

        if (loading) {
            loading.hidden = true;
        }

        if (content) {
            content.hidden = false;
        }


    } catch (error) {

        console.error(
            "ZEVQYN project load error:",
            error
        );

        zevPwShowError(
            error.message ||
            "Could not load this project."
        );

    }

}


/* =========================================
   POPULATE PROJECT
========================================= */

function zevPwPopulateProject(
    project
) {

    zevPwTechnologies =
        Array.isArray(
            project.technologies
        )
            ? project.technologies.slice()
            : [];

    zevPwSkills =
        Array.isArray(
            project.skills
        )
            ? project.skills.slice()
            : [];


    const heading =
        zevPwEl(
            "zevqyn-project-heading"
        );

    const subheading =
        zevPwEl(
            "zevqyn-project-subheading"
        );

    const title =
        zevPwEl(
            "zevqyn-project-title"
        );

    const shortDescription =
        zevPwEl(
            "zevqyn-project-short"
        );

    const description =
        zevPwEl(
            "zevqyn-project-description"
        );

    const visibility =
        zevPwEl(
            "zevqyn-project-visibility"
        );

    const featured =
        zevPwEl(
            "zevqyn-project-featured"
        );

    const github =
        zevPwEl(
            "zevqyn-project-github"
        );

    const live =
        zevPwEl(
            "zevqyn-project-live"
        );

    const image =
        zevPwEl(
            "zevqyn-project-image"
        );


    if (heading) {

        heading.textContent =
            project.title ||
            "Untitled Project";

    }


    if (subheading) {

        subheading.textContent =
            project.short_description ||
            "Manage your ZEVQYN project.";

    }


    if (title) {

        title.value =
            project.title ||
            "";

    }


    if (shortDescription) {

        shortDescription.value =
            project.short_description ||
            "";

    }


    if (description) {

        description.value =
            project.description ||
            "";

    }


    if (visibility) {

        visibility.value =
            project.visibility ||
            "private";

    }


    if (featured) {

        featured.checked =
            project.featured === true;

    }


    if (github) {

        github.value =
            project.github_url ||
            "";

    }


    if (live) {

        live.value =
            project.live_url ||
            "";

    }


    if (image) {

        image.value =
            project.image_url ||
            "";

    }


    zevPwRenderTags();

    zevPwUpdateVisibilityBadge();

    zevPwUpdateStats();

    zevPwUpdateLinks();

    zevPwUpdateImagePreview();

    zevPwUpdateResearchOrigin();

    zevPwUpdateCounters();


    const created =
        zevPwEl(
            "zevqyn-project-created"
        );

    const updated =
        zevPwEl(
            "zevqyn-project-updated"
        );


    if (created) {

        created.textContent =
            zevPwFormatDate(
                project.created_at
            );

    }


    if (updated) {

        updated.textContent =
            zevPwFormatDate(
                project.updated_at
            );

    }

}


/* =========================================
   TAGS
========================================= */

function zevPwRenderTags() {

    zevPwRenderTagGroup(
        "zevqyn-tech-tags",
        zevPwTechnologies,
        "technology"
    );

    zevPwRenderTagGroup(
        "zevqyn-skill-tags",
        zevPwSkills,
        "skill"
    );

}


function zevPwRenderTagGroup(
    containerId,
    items,
    type
) {

    const container =
        zevPwEl(
            containerId
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (items.length === 0) {

        const empty =
            document.createElement(
                "span"
            );

        empty.className =
            "zev-pw-tag-empty";

        empty.textContent =
            type === "technology"
                ? "No technologies added yet."
                : "No skills added yet.";

        container.appendChild(
            empty
        );

        return;
    }


    items.forEach(
        function (
            item,
            index
        ) {

            const tag =
                document.createElement(
                    "span"
                );

            tag.className =
                "zev-pw-tag";


            const text =
                document.createElement(
                    "span"
                );

            text.textContent =
                String(item);


            const remove =
                document.createElement(
                    "button"
                );

            remove.type =
                "button";

            remove.textContent =
                "×";

            remove.setAttribute(
                "aria-label",
                "Remove " +
                String(item)
            );


            remove.addEventListener(
                "click",
                function () {

                    if (
                        type ===
                        "technology"
                    ) {

                        zevPwTechnologies.splice(
                            index,
                            1
                        );

                    } else {

                        zevPwSkills.splice(
                            index,
                            1
                        );

                    }

                    zevPwRenderTags();
                    zevPwUpdateStats();

                }
            );


            tag.appendChild(
                text
            );

            tag.appendChild(
                remove
            );

            container.appendChild(
                tag
            );

        }
    );

}


function zevPwAddTag(type) {

    let input = null;
    let list = null;

    if (
        type ===
        "technology"
    ) {

        input =
            zevPwEl(
                "zevqyn-tech-input"
            );

        list =
            zevPwTechnologies;

    } else {

        input =
            zevPwEl(
                "zevqyn-skill-input"
            );

        list =
            zevPwSkills;

    }


    if (!input) {
        return;
    }


    const value =
        input.value.trim();

    if (!value) {
        return;
    }


    if (list.length >= 20) {

        zevPwShowToast(
            "Maximum 20 items allowed.",
            "error"
        );

        return;
    }


    const exists =
        list.some(
            function (item) {

                return (
                    String(item)
                        .toLowerCase() ===
                    value.toLowerCase()
                );

            }
        );


    if (exists) {

        zevPwShowToast(
            "That item is already added.",
            "error"
        );

        return;
    }


    list.push(
        value
    );

    input.value = "";

    zevPwRenderTags();

    zevPwUpdateStats();

}


/* =========================================
   VISIBILITY
========================================= */

function zevPwUpdateVisibilityBadge() {

    const select =
        zevPwEl(
            "zevqyn-project-visibility"
        );

    const badge =
        zevPwEl(
            "zevqyn-project-visibility-badge"
        );

    if (!select) {
        return;
    }

    if (!badge) {
        return;
    }


    const value =
        select.value ||
        "private";

    badge.textContent =
        value.toUpperCase();

}


/* =========================================
   STATS
========================================= */

function zevPwUpdateStats() {

    const tech =
        zevPwEl(
            "zevqyn-stat-tech"
        );

    const skills =
        zevPwEl(
            "zevqyn-stat-skills"
        );

    const links =
        zevPwEl(
            "zevqyn-stat-links"
        );

    const origin =
        zevPwEl(
            "zevqyn-stat-origin"
        );


    if (tech) {

        tech.textContent =
            String(
                zevPwTechnologies.length
            );

    }


    if (skills) {

        skills.textContent =
            String(
                zevPwSkills.length
            );

    }


    let linkCount = 0;

    const github =
        zevPwEl(
            "zevqyn-project-github"
        );

    const live =
        zevPwEl(
            "zevqyn-project-live"
        );


    if (github) {

        if (
            github.value.trim()
        ) {
            linkCount += 1;
        }

    }


    if (live) {

        if (
            live.value.trim()
        ) {
            linkCount += 1;
        }

    }


    if (links) {

        links.textContent =
            String(
                linkCount
            );

    }


    if (origin) {

        if (zevPwProject) {

            origin.textContent =
                zevPwProject.workspace_id
                    ? "Research"
                    : "Manual";

        }

    }

}


/* =========================================
   LINKS
========================================= */

function zevPwUpdateLinks() {

    const githubInput =
        zevPwEl(
            "zevqyn-project-github"
        );

    const liveInput =
        zevPwEl(
            "zevqyn-project-live"
        );

    const githubButton =
        zevPwEl(
            "zevqyn-open-github"
        );

    const liveButton =
        zevPwEl(
            "zevqyn-open-live"
        );


    const githubUrl =
        githubInput
            ? zevPwNormalizeUrl(
                githubInput.value
            )
            : "";

    const liveUrl =
        liveInput
            ? zevPwNormalizeUrl(
                liveInput.value
            )
            : "";


    if (githubButton) {

        if (githubUrl) {

            githubButton.href =
                githubUrl;

            githubButton.hidden =
                false;

        } else {

            githubButton.hidden =
                true;

        }

    }


    if (liveButton) {

        if (liveUrl) {

            liveButton.href =
                liveUrl;

            liveButton.hidden =
                false;

        } else {

            liveButton.hidden =
                true;

        }

    }


    zevPwUpdateStats();

}


/* =========================================
   IMAGE PREVIEW
========================================= */

function zevPwUpdateImagePreview() {

    const input =
        zevPwEl(
            "zevqyn-project-image"
        );

    const image =
        zevPwEl(
            "zevqyn-project-image-preview"
        );

    const empty =
        zevPwEl(
            "zevqyn-image-empty"
        );


    if (!input) {
        return;
    }

    if (!image) {
        return;
    }

    if (!empty) {
        return;
    }


    const url =
        input.value.trim();


    if (!url) {

        image.hidden = true;
        image.removeAttribute(
            "src"
        );

        empty.hidden = false;

        return;
    }


    image.onload =
        function () {

            image.hidden = false;
            empty.hidden = true;

        };


    image.onerror =
        function () {

            image.hidden = true;
            empty.hidden = false;

        };


    image.src =
        url;

}


/* =========================================
   RESEARCH ORIGIN
========================================= */

function zevPwUpdateResearchOrigin() {

    if (!zevPwProject) {
        return;
    }


    const title =
        zevPwEl(
            "zevqyn-origin-title"
        );

    const text =
        zevPwEl(
            "zevqyn-origin-text"
        );

    const link =
        zevPwEl(
            "zevqyn-open-research"
        );


    if (
        zevPwProject.workspace_id
    ) {

        if (title) {

            title.textContent =
                "Created from Research";

        }

        if (text) {

            text.textContent =
                "This project is connected to a ZEVQYN research workspace.";

        }

        if (link) {

            link.href =
                "/research-workspace/?id=" +
                encodeURIComponent(
                    zevPwProject.workspace_id
                );

            link.hidden = false;

        }

    } else {

        if (title) {

            title.textContent =
                "Manual Project";

        }

        if (text) {

            text.textContent =
                "This project was created directly from the Projects workspace.";

        }

        if (link) {

            link.hidden = true;

        }

    }

}


/* =========================================
   COUNTERS
========================================= */

function zevPwUpdateCounters() {

    const title =
        zevPwEl(
            "zevqyn-project-title"
        );

    const shortDescription =
        zevPwEl(
            "zevqyn-project-short"
        );

    const description =
        zevPwEl(
            "zevqyn-project-description"
        );


    const titleCount =
        zevPwEl(
            "zevqyn-title-count"
        );

    const shortCount =
        zevPwEl(
            "zevqyn-short-count"
        );

    const descriptionCount =
        zevPwEl(
            "zevqyn-description-count"
        );


    if (title) {

        if (titleCount) {

            titleCount.textContent =
                String(
                    title.value.length
                );

        }

    }


    if (shortDescription) {

        if (shortCount) {

            shortCount.textContent =
                String(
                    shortDescription
                        .value.length
                );

        }

    }


    if (description) {

        if (descriptionCount) {

            descriptionCount.textContent =
                String(
                    description
                        .value.length
                );

        }

    }

}


/* =========================================
   SAVE PROJECT
========================================= */

async function zevPwSaveProject() {

    if (!zevPwProject) {
        return;
    }


    const title =
        zevPwEl(
            "zevqyn-project-title"
        );

    const shortDescription =
        zevPwEl(
            "zevqyn-project-short"
        );

    const description =
        zevPwEl(
            "zevqyn-project-description"
        );

    const visibility =
        zevPwEl(
            "zevqyn-project-visibility"
        );

    const featured =
        zevPwEl(
            "zevqyn-project-featured"
        );

    const github =
        zevPwEl(
            "zevqyn-project-github"
        );

    const live =
        zevPwEl(
            "zevqyn-project-live"
        );

    const image =
        zevPwEl(
            "zevqyn-project-image"
        );

    const button =
        zevPwEl(
            "zevqyn-project-save"
        );


    const cleanTitle =
        title
            ? title.value.trim()
            : "";


    if (!cleanTitle) {

        zevPwShowToast(
            "Project title is required.",
            "error"
        );

        if (title) {
            title.focus();
        }

        return;
    }


    const payload = {

        title:
            cleanTitle,

        short_description:
            shortDescription
                ? shortDescription.value.trim()
                : "",

        description:
            description
                ? description.value.trim()
                : "",

        technologies:
            zevPwTechnologies.slice(),

        skills:
            zevPwSkills.slice(),

        github_url:
            github
                ? github.value.trim() || null
                : null,

        live_url:
            live
                ? live.value.trim() || null
                : null,

        image_url:
            image
                ? image.value.trim() || null
                : null,

        visibility:
            visibility
                ? visibility.value
                : "private",

        featured:
            featured
                ? featured.checked
                : false

    };


    if (button) {

        button.disabled = true;

        button.textContent =
            "Saving...";

    }


    try {

        const updated =
            await zevPwApiRequest(
                "/api/v1/projects/" +
                encodeURIComponent(
                    zevPwProject.id
                ),
                {
                    method:
                        "PATCH",

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


        zevPwProject =
            updated;

        zevPwPopulateProject(
            updated
        );


        zevPwShowToast(
            "Project saved successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "ZEVQYN project save error:",
            error
        );


        zevPwShowToast(
            error.message ||
            "Could not save project.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Save Changes";

        }

    }

}


/* =========================================
   RESET
========================================= */

function zevPwResetProject() {

    if (!zevPwProject) {
        return;
    }

    zevPwPopulateProject(
        zevPwProject
    );

    zevPwShowToast(
        "Unsaved changes reset.",
        ""
    );

}


/* =========================================
   EVENTS
========================================= */

function zevPwSetupEvents() {

    const addTech =
        zevPwEl(
            "zevqyn-add-tech"
        );

    const addSkill =
        zevPwEl(
            "zevqyn-add-skill"
        );

    const techInput =
        zevPwEl(
            "zevqyn-tech-input"
        );

    const skillInput =
        zevPwEl(
            "zevqyn-skill-input"
        );

    const save =
        zevPwEl(
            "zevqyn-project-save"
        );

    const reset =
        zevPwEl(
            "zevqyn-project-reset"
        );

    const visibility =
        zevPwEl(
            "zevqyn-project-visibility"
        );

    const github =
        zevPwEl(
            "zevqyn-project-github"
        );

    const live =
        zevPwEl(
            "zevqyn-project-live"
        );

    const image =
        zevPwEl(
            "zevqyn-project-image"
        );

    const title =
        zevPwEl(
            "zevqyn-project-title"
        );

    const shortDescription =
        zevPwEl(
            "zevqyn-project-short"
        );

    const description =
        zevPwEl(
            "zevqyn-project-description"
        );


    if (addTech) {

        addTech.addEventListener(
            "click",
            function () {

                zevPwAddTag(
                    "technology"
                );

            }
        );

    }


    if (addSkill) {

        addSkill.addEventListener(
            "click",
            function () {

                zevPwAddTag(
                    "skill"
                );

            }
        );

    }


    if (techInput) {

        techInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    zevPwAddTag(
                        "technology"
                    );

                }

            }
        );

    }


    if (skillInput) {

        skillInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    zevPwAddTag(
                        "skill"
                    );

                }

            }
        );

    }


    if (save) {

        save.addEventListener(
            "click",
            zevPwSaveProject
        );

    }


    if (reset) {

        reset.addEventListener(
            "click",
            zevPwResetProject
        );

    }


    if (visibility) {

        visibility.addEventListener(
            "change",
            zevPwUpdateVisibilityBadge
        );

    }


    if (github) {

        github.addEventListener(
            "input",
            zevPwUpdateLinks
        );

    }


    if (live) {

        live.addEventListener(
            "input",
            zevPwUpdateLinks
        );

    }


    if (image) {

        image.addEventListener(
            "change",
            zevPwUpdateImagePreview
        );

        image.addEventListener(
            "blur",
            zevPwUpdateImagePreview
        );

    }


    if (title) {

        title.addEventListener(
            "input",
            zevPwUpdateCounters
        );

    }


    if (shortDescription) {

        shortDescription.addEventListener(
            "input",
            zevPwUpdateCounters
        );

    }


    if (description) {

        description.addEventListener(
            "input",
            zevPwUpdateCounters
        );

    }

}


/* =========================================
   INITIALIZE
========================================= */

async function zevPwInitialize() {

    try {

        zevPwSetupEvents();

        await zevPwSetupAuth();

        await zevPwLoadProject();


    } catch (error) {

        console.error(
            "ZEVQYN Project Workspace initialization error:",
            error
        );


        if (
            error.message !==
            "Authentication required."
        ) {

            zevPwShowError(
                error.message ||
                "Could not initialize Project Workspace."
            );

        }

    }

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            zevPwInitialize();
        }
    );

} else {

    zevPwInitialize();

}
