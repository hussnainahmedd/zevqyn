
/* =========================================
   ZEVQYN RESUME BUILDER
========================================= */


/* CONFIG */

const ZEV_RB_SUPABASE_URL =
    "https://phjizxajnigiiawitkyx.supabase.co";

const ZEV_RB_SUPABASE_KEY =
    "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

const ZEV_RB_API_BASE =
    "https://zevqyn-backend.onrender.com";


/* STATE */

let zevRbSupabase = null;
let zevRbSession = null;

let zevRbResumes = [];
let zevRbResume = null;
let zevRbItems = [];

let zevRbSources = {
    project: [],
    skill: [],
    education: [],
    certificate: []
};

let zevRbActiveSource =
    "project";

let zevRbToastTimer = null;


/* =========================================
   HELPERS
========================================= */

function zevRbEl(id) {

    return document.getElementById(id);

}


function zevRbEscape(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value || "");

    return div.innerHTML;

}


function zevRbToast(
    message,
    type
) {

    const toast =
        zevRbEl(
            "zevqyn-resume-toast"
        );

    if (!toast) {
        return;
    }


    if (zevRbToastTimer) {

        clearTimeout(
            zevRbToastTimer
        );

    }


    toast.textContent =
        message;

    toast.className =
        "zev-rb-toast " +
        (type || "");

    toast.hidden = false;


    zevRbToastTimer =
        setTimeout(
            function () {

                toast.hidden = true;

            },
            3500
        );

}


/* =========================================
   SUPABASE
========================================= */

function zevRbLoadSupabase() {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (window.supabase) {

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
                    resolve
                );

                existing.addEventListener(
                    "error",
                    function () {

                        reject(
                            new Error(
                                "Could not load authentication."
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
                resolve;

            script.onerror =
                function () {

                    reject(
                        new Error(
                            "Could not load authentication."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


async function zevRbSetupAuth() {

    await zevRbLoadSupabase();


    zevRbSupabase =
        window.supabase.createClient(
            ZEV_RB_SUPABASE_URL,
            ZEV_RB_SUPABASE_KEY
        );


    const result =
        await zevRbSupabase.auth
            .getSession();


    zevRbSession =
        result.data.session;


    if (!zevRbSession) {

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

async function zevRbApi(
    path,
    options
) {

    if (!zevRbSession) {

        throw new Error(
            "Your session has expired."
        );

    }


    const request =
        options || {};


    const headers =
        new Headers(
            request.headers || {}
        );


    headers.set(
        "Authorization",
        "Bearer " +
        zevRbSession.access_token
    );


    const response =
        await fetch(
            ZEV_RB_API_BASE + path,
            {
                method:
                    request.method ||
                    "GET",

                headers:
                    headers,

                body:
                    request.body
            }
        );


    let data = null;


    if (
        response.status !== 204
    ) {

        const type =
            response.headers.get(
                "content-type"
            ) || "";


        if (
            type.indexOf(
                "application/json"
            ) !== -1
        ) {

            try {

                data =
                    await response.json();

            } catch (error) {

                data = null;

            }

        }

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
   LOAD RESUMES
========================================= */

async function zevRbLoadResumes() {

    zevRbResumes =
        await zevRbApi(
            "/api/v1/resumes"
        );


    if (
        !Array.isArray(
            zevRbResumes
        )
    ) {

        zevRbResumes = [];

    }


    zevRbRenderResumeSelect();


    if (
        zevRbResumes.length === 0
    ) {

        zevRbResume = null;


        zevRbEl(
            "zevqyn-resume-empty"
        ).hidden = false;


        zevRbEl(
            "zevqyn-resume-workspace"
        ).hidden = true;


        return;

    }


    zevRbEl(
        "zevqyn-resume-empty"
    ).hidden = true;


    zevRbEl(
        "zevqyn-resume-workspace"
    ).hidden = false;


    await zevRbOpenResume(
        zevRbResumes[0].id
    );

}


function zevRbRenderResumeSelect() {

    const select =
        zevRbEl(
            "zevqyn-resume-select"
        );


    if (!select) {
        return;
    }


    select.innerHTML = "";


    zevRbResumes.forEach(
        function (resume) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                resume.id;

            option.textContent =
                resume.name;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================
   OPEN RESUME
========================================= */

async function zevRbOpenResume(
    resumeId
) {

    if (!resumeId) {
        return;
    }


    try {

        const results =
            await Promise.all([

                zevRbApi(
                    "/api/v1/resumes/" +
                    encodeURIComponent(
                        resumeId
                    )
                ),

                zevRbApi(
                    "/api/v1/resumes/" +
                    encodeURIComponent(
                        resumeId
                    ) +
                    "/items"
                )

            ]);


        zevRbResume =
            results[0];


        zevRbItems =
            Array.isArray(
                results[1]
            )
                ? results[1]
                : [];


        const select =
            zevRbEl(
                "zevqyn-resume-select"
            );


        if (select) {

            select.value =
                zevRbResume.id;

        }


        zevRbPopulateResume();

        zevRbRenderItems();

        zevRbRenderSourceList();

        zevRbUpdatePreview();

        zevRbUpdateStats();


    } catch (error) {

        console.error(
            "Resume load error:",
            error
        );


        zevRbToast(
            error.message ||
            "Could not load resume.",
            "error"
        );

    }

}


/* =========================================
   POPULATE RESUME
========================================= */

function zevRbPopulateResume() {

    if (!zevRbResume) {
        return;
    }


    const name =
        zevRbEl(
            "zevqyn-resume-name"
        );

    const template =
        zevRbEl(
            "zevqyn-resume-template"
        );

    const visibility =
        zevRbEl(
            "zevqyn-resume-visibility"
        );

    const summary =
        zevRbEl(
            "zevqyn-resume-summary"
        );


    /* PERSONAL INFORMATION */

    const fullName =
        zevRbEl(
            "zevqyn-resume-full-name"
        );

    const professionalTitle =
        zevRbEl(
            "zevqyn-resume-professional-title"
        );

    const email =
        zevRbEl(
            "zevqyn-resume-email"
        );

    const phone =
        zevRbEl(
            "zevqyn-resume-phone"
        );

    const location =
        zevRbEl(
            "zevqyn-resume-location"
        );

    const linkedin =
        zevRbEl(
            "zevqyn-resume-linkedin"
        );

    const github =
        zevRbEl(
            "zevqyn-resume-github"
        );

    const portfolio =
        zevRbEl(
            "zevqyn-resume-portfolio"
        );


    if (name) {

        name.value =
            zevRbResume.name ||
            "";

    }


    if (template) {

        template.value =
            zevRbResume.template ||
            "professional";

    }


    if (visibility) {

        visibility.value =
            zevRbResume.visibility ||
            "private";

    }


    if (fullName) {

        fullName.value =
            zevRbResume.full_name ||
            "";

    }


    if (professionalTitle) {

        professionalTitle.value =
            zevRbResume.professional_title ||
            "";

    }


    if (email) {

        email.value =
            zevRbResume.email ||
            "";

    }


    if (phone) {

        phone.value =
            zevRbResume.phone ||
            "";

    }


    if (location) {

        location.value =
            zevRbResume.location ||
            "";

    }


    if (linkedin) {

        linkedin.value =
            zevRbResume.linkedin_url ||
            "";

    }


    if (github) {

        github.value =
            zevRbResume.github_url ||
            "";

    }


    if (portfolio) {

        portfolio.value =
            zevRbResume.portfolio_url ||
            "";

    }


    if (summary) {

        summary.value =
            zevRbResume
                .professional_summary ||
            "";

    }


    zevRbUpdateSummaryCount();

}


/* =========================================
   CREATE RESUME MODAL
========================================= */

function zevRbOpenCreateModal() {

    const modal =
        zevRbEl(
            "zevqyn-resume-modal"
        );

    const input =
        zevRbEl(
            "zevqyn-new-resume-name"
        );


    if (modal) {

        modal.hidden = false;

    }


    if (input) {

        input.value = "";


        setTimeout(
            function () {

                input.focus();

            },
            50
        );

    }

}


function zevRbCloseCreateModal() {

    const modal =
        zevRbEl(
            "zevqyn-resume-modal"
        );


    if (modal) {

        modal.hidden = true;

    }

}


/* =========================================
   CREATE RESUME
========================================= */

async function zevRbCreateResume() {

    const input =
        zevRbEl(
            "zevqyn-new-resume-name"
        );

    const button =
        zevRbEl(
            "zevqyn-create-resume"
        );


    const name =
        input
            ? input.value.trim()
            : "";


    if (!name) {

        zevRbToast(
            "Resume name is required.",
            "error"
        );

        return;

    }


    if (button) {

        button.disabled = true;

        button.textContent =
            "Creating...";

    }


    try {

        const resume =
            await zevRbApi(
                "/api/v1/resumes",
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            name:
                                name,

                            template:
                                "professional",

                            visibility:
                                "private"
                        })
                }
            );


        zevRbResumes.push(
            resume
        );


        zevRbRenderResumeSelect();

        zevRbCloseCreateModal();


        zevRbEl(
            "zevqyn-resume-empty"
        ).hidden = true;


        zevRbEl(
            "zevqyn-resume-workspace"
        ).hidden = false;


        await zevRbOpenResume(
            resume.id
        );


        zevRbToast(
            "Resume created successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Resume create error:",
            error
        );


        zevRbToast(
            error.message ||
            "Could not create resume.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Create Resume";

        }

    }

}


/* =========================================
   SAVE RESUME
========================================= */

async function zevRbSaveResume() {

    if (!zevRbResume) {
        return;
    }


    const name =
        zevRbEl(
            "zevqyn-resume-name"
        );

    const template =
        zevRbEl(
            "zevqyn-resume-template"
        );

    const visibility =
        zevRbEl(
            "zevqyn-resume-visibility"
        );

    const summary =
        zevRbEl(
            "zevqyn-resume-summary"
        );


    /* PERSONAL INFORMATION */

    const fullName =
        zevRbEl(
            "zevqyn-resume-full-name"
        );

    const professionalTitle =
        zevRbEl(
            "zevqyn-resume-professional-title"
        );

    const email =
        zevRbEl(
            "zevqyn-resume-email"
        );

    const phone =
        zevRbEl(
            "zevqyn-resume-phone"
        );

    const location =
        zevRbEl(
            "zevqyn-resume-location"
        );

    const linkedin =
        zevRbEl(
            "zevqyn-resume-linkedin"
        );

    const github =
        zevRbEl(
            "zevqyn-resume-github"
        );

    const portfolio =
        zevRbEl(
            "zevqyn-resume-portfolio"
        );

    const button =
        zevRbEl(
            "zevqyn-save-resume"
        );


    const cleanName =
        name
            ? name.value.trim()
            : "";


    if (!cleanName) {

        zevRbToast(
            "Resume name is required.",
            "error"
        );

        return;

    }


    if (button) {

        button.disabled = true;

        button.textContent =
            "Saving...";

    }


    try {

        const updated =
            await zevRbApi(
                "/api/v1/resumes/" +
                encodeURIComponent(
                    zevRbResume.id
                ),
                {
                    method:
                        "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            name:
                                cleanName,

                            template:
                                template
                                    ? template.value
                                    : "professional",

                            professional_summary:
                                summary
                                    ? summary.value.trim() || null
                                    : null,

                            visibility:
                                visibility
                                    ? visibility.value
                                    : "private",

                            full_name:
                                fullName
                                    ? fullName.value.trim() || null
                                    : null,

                            professional_title:
                                professionalTitle
                                    ? professionalTitle.value.trim() || null
                                    : null,

                            email:
                                email
                                    ? email.value.trim() || null
                                    : null,

                            phone:
                                phone
                                    ? phone.value.trim() || null
                                    : null,

                            location:
                                location
                                    ? location.value.trim() || null
                                    : null,

                            linkedin_url:
                                linkedin
                                    ? linkedin.value.trim() || null
                                    : null,

                            github_url:
                                github
                                    ? github.value.trim() || null
                                    : null,

                            portfolio_url:
                                portfolio
                                    ? portfolio.value.trim() || null
                                    : null

                        })
                }
            );


        zevRbResume =
            updated;


        const index =
            zevRbResumes.findIndex(
                function (resume) {

                    return (
                        resume.id ===
                        updated.id
                    );

                }
            );


        if (index !== -1) {

            zevRbResumes[index] =
                updated;

        }


        zevRbRenderResumeSelect();

        zevRbPopulateResume();

        zevRbUpdatePreview();


        zevRbToast(
            "Resume saved successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Resume save error:",
            error
        );


        zevRbToast(
            error.message ||
            "Could not save resume.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Save";

        }

    }

}


/* =========================================
   DELETE RESUME
========================================= */

async function zevRbDeleteResume() {

    if (!zevRbResume) {
        return;
    }


    const confirmed =
        window.confirm(
            "Delete this resume? This cannot be undone."
        );

    if (!confirmed) {
        return;
    }


    try {

        await zevRbApi(
            "/api/v1/resumes/" +
            encodeURIComponent(
                zevRbResume.id
            ),
            {
                method:
                    "DELETE"
            }
        );


        zevRbToast(
            "Resume deleted.",
            "success"
        );


        await zevRbLoadResumes();


    } catch (error) {

        zevRbToast(
            error.message ||
            "Could not delete resume.",
            "error"
        );

    }

}


/* =========================================
   LOAD CAREER SOURCES
========================================= */

async function zevRbLoadSources() {

    try {

        const results =
            await Promise.all([

                zevRbApi(
                    "/api/v1/projects"
                ),

                zevRbApi(
                    "/api/v1/career/skills"
                ),

                zevRbApi(
                    "/api/v1/career/education"
                ),

                zevRbApi(
                    "/api/v1/career/certificates"
                )

            ]);


        zevRbSources.project =
            Array.isArray(
                results[0]
            )
                ? results[0]
                : [];


        zevRbSources.skill =
            Array.isArray(
                results[1]
            )
                ? results[1]
                : [];


        zevRbSources.education =
            Array.isArray(
                results[2]
            )
                ? results[2]
                : [];


        zevRbSources.certificate =
            Array.isArray(
                results[3]
            )
                ? results[3]
                : [];


        zevRbRenderSourceList();


    } catch (error) {

        console.error(
            "Career source load error:",
            error
        );


        const list =
            zevRbEl(
                "zevqyn-source-list"
            );


        if (list) {

            list.textContent =
                "Could not load career records.";

        }

    }

}


/* =========================================
   SOURCE LABELS
========================================= */

function zevRbSourceTitle(
    type,
    source
) {

    if (
        type === "project"
    ) {

        return (
            source.title ||
            "Untitled Project"
        );

    }


    if (
        type === "skill"
    ) {

        return (
            source.name ||
            "Skill"
        );

    }


    if (
        type === "education"
    ) {

        return (
            source.institution ||
            "Education"
        );

    }


    return (
        source.title ||
        "Certificate"
    );

}


function zevRbSourceSubtitle(
    type,
    source
) {

    if (
        type === "project"
    ) {

        if (
            Array.isArray(
                source.technologies
            )
        ) {

            return source.technologies
                .join(", ");

        }


        return "";

    }


    if (
        type === "skill"
    ) {

        return (
            source.category ||
            ""
        );

    }


    if (
        type === "education"
    ) {

        return (
            (source.degree || "") +
            (
                source.field_of_study
                    ? " · " +
                      source.field_of_study
                    : ""
            )
        );

    }


    return (
        source.issuer ||
        ""
    );

}


/* =========================================
   CHECK IF RECORD IS ALREADY ATTACHED
========================================= */

function zevRbIsAttached(
    type,
    sourceId
) {

    return zevRbItems.some(
        function (item) {

            if (
                item.section_type !==
                type
            ) {

                return false;

            }


            if (!item.metadata) {

                return false;

            }


            return (
                String(
                    item.metadata.source_id
                ) ===
                String(sourceId)
            );

        }
    );

}


/* =========================================
   RENDER CAREER SOURCE LIST
========================================= */

function zevRbRenderSourceList() {

    const list =
        zevRbEl(
            "zevqyn-source-list"
        );


    if (!list) {

        return;

    }


    list.innerHTML = "";


    const sources =
        zevRbSources[
            zevRbActiveSource
        ] || [];


    if (
        sources.length === 0
    ) {

        list.textContent =
            "No " +
            zevRbActiveSource +
            " records available.";

        return;

    }


    sources.forEach(
        function (source) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "zev-rb-source";


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "zev-rb-source-info";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                zevRbSourceTitle(
                    zevRbActiveSource,
                    source
                );


            const subtitle =
                document.createElement(
                    "span"
                );


            subtitle.textContent =
                zevRbSourceSubtitle(
                    zevRbActiveSource,
                    source
                );


            info.appendChild(
                title
            );


            info.appendChild(
                subtitle
            );


            const button =
                document.createElement(
                    "button"
                );


            const attached =
                zevRbIsAttached(
                    zevRbActiveSource,
                    source.id
                );


            button.type =
                "button";


            button.textContent =
                attached
                    ? "Added"
                    : "+ Add";


            button.disabled =
                attached;


            if (!attached) {

                button.addEventListener(
                    "click",
                    function () {

                        zevRbAddItem(
                            zevRbActiveSource,
                            source.id,
                            button
                        );

                    }
                );

            }


            row.appendChild(
                info
            );


            row.appendChild(
                button
            );


            list.appendChild(
                row
            );

        }
    );

}


/* =========================================
   ADD CAREER RECORD TO RESUME
========================================= */

async function zevRbAddItem(
    type,
    sourceId,
    button
) {

    if (!zevRbResume) {

        zevRbToast(
            "Create a resume first.",
            "error"
        );

        return;

    }


    if (button) {

        button.disabled = true;

        button.textContent =
            "Adding...";

    }


    try {

        const item =
            await zevRbApi(
                "/api/v1/resumes/" +
                encodeURIComponent(
                    zevRbResume.id
                ) +
                "/items",
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            section_type:
                                type,

                            source_id:
                                sourceId,

                            sort_order:
                                zevRbItems.length
                        })
                }
            );


        zevRbItems.push(
            item
        );


        zevRbRenderItems();

        zevRbRenderSourceList();

        zevRbUpdatePreview();

        zevRbUpdateStats();


        zevRbToast(
            "Added to resume.",
            "success"
        );


    } catch (error) {

        console.error(
            "Resume item error:",
            error
        );


        zevRbToast(
            error.message ||
            "Could not add item.",
            "error"
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                "+ Add";

        }

    }

}


/* =========================================
   REMOVE CAREER RECORD FROM RESUME
========================================= */

async function zevRbRemoveItem(
    itemId
) {

    if (!zevRbResume) {

        return;

    }


    try {

        await zevRbApi(
            "/api/v1/resumes/" +
            encodeURIComponent(
                zevRbResume.id
            ) +
            "/items/" +
            encodeURIComponent(
                itemId
            ),
            {
                method:
                    "DELETE"
            }
        );


        zevRbItems =
            zevRbItems.filter(
                function (item) {

                    return (
                        item.id !==
                        itemId
                    );

                }
            );


        zevRbRenderItems();

        zevRbRenderSourceList();

        zevRbUpdatePreview();

        zevRbUpdateStats();


        zevRbToast(
            "Removed from resume.",
            "success"
        );


    } catch (error) {

        zevRbToast(
            error.message ||
            "Could not remove item.",
            "error"
        );

    }

}


/* =========================================
   RENDER ATTACHED RESUME ITEMS
========================================= */

function zevRbRenderItems() {

    const container =
        zevRbEl(
            "zevqyn-resume-items"
        );

    const empty =
        zevRbEl(
            "zevqyn-no-resume-items"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        zevRbItems.length === 0
    ) {

        if (empty) {
            empty.hidden = false;
        }

        return;

    }


    if (empty) {
        empty.hidden = true;
    }


    zevRbItems.forEach(
        function (item) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "zev-rb-item";


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "zev-rb-item-info";


            const type =
                document.createElement(
                    "span"
                );

            type.className =
                "zev-rb-item-type";

            type.textContent =
                item.section_type ||
                "record";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                zevRbItemTitle(
                    item
                );


            const subtitle =
                document.createElement(
                    "span"
                );

            subtitle.className =
                "zev-rb-item-subtitle";

            subtitle.textContent =
                zevRbItemSubtitle(
                    item
                );


            const description =
                document.createElement(
                    "p"
                );

            description.className =
                "zev-rb-item-description";

            description.textContent =
                zevRbItemDescription(
                    item
                );


            info.appendChild(
                type
            );

            info.appendChild(
                title
            );


            if (
                subtitle.textContent
            ) {

                info.appendChild(
                    subtitle
                );

            }


            if (
                description.textContent
            ) {

                info.appendChild(
                    description
                );

            }


            const remove =
                document.createElement(
                    "button"
                );

            remove.type =
                "button";

            remove.className =
                "zev-rb-item-remove";

            remove.textContent =
                "Remove";


            remove.addEventListener(
                "click",
                function () {

                    zevRbRemoveItem(
                        item.id
                    );

                }
            );


            row.appendChild(
                info
            );

            row.appendChild(
                remove
            );


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================
   ITEM DATA HELPERS
========================================= */

function zevRbItemData(item) {

    if (!item) {
        return {};
    }

    return item;

}


function zevRbItemTitle(item) {

    if (!item) {
        return "Career Record";
    }


    if (item.title) {
        return item.title;
    }


    if (
        item.section_type ===
        "project"
    ) {

        return "Project";

    }


    if (
        item.section_type ===
        "skill"
    ) {

        return "Skill";

    }


    if (
        item.section_type ===
        "education"
    ) {

        return "Education";

    }


    if (
        item.section_type ===
        "certificate"
    ) {

        return "Certificate";

    }


    return "Career Record";

}


function zevRbItemSubtitle(item) {

    if (!item) {
        return "";
    }


    return (
        item.subtitle ||
        ""
    );

}


function zevRbItemDescription(item) {

    if (!item) {
        return "";
    }


    return (
        item.description ||
        ""
    );

}


/* =========================================
   UPDATE STAT COUNTERS
========================================= */

function zevRbUpdateStats() {

    const counts = {
        project: 0,
        skill: 0,
        education: 0,
        certificate: 0
    };


    zevRbItems.forEach(
        function (item) {

            if (
                Object.prototype
                    .hasOwnProperty.call(
                        counts,
                        item.section_type
                    )
            ) {

                counts[
                    item.section_type
                ] += 1;

            }

        }
    );


    const project =
        zevRbEl(
            "zevqyn-resume-project-count"
        );

    const skill =
        zevRbEl(
            "zevqyn-resume-skill-count"
        );

    const education =
        zevRbEl(
            "zevqyn-resume-education-count"
        );

    const certificate =
        zevRbEl(
            "zevqyn-resume-certificate-count"
        );


    if (project) {

        project.textContent =
            counts.project;

    }


    if (skill) {

        skill.textContent =
            counts.skill;

    }


    if (education) {

        education.textContent =
            counts.education;

    }


    if (certificate) {

        certificate.textContent =
            counts.certificate;

    }

}


/* =========================================
   SUMMARY CHARACTER COUNT
========================================= */

function zevRbUpdateSummaryCount() {

    const summary =
        zevRbEl(
            "zevqyn-resume-summary"
        );

    const count =
        zevRbEl(
            "zevqyn-summary-count"
        );


    if (!count) {
        return;
    }


    count.textContent =
        summary
            ? summary.value.length
            : 0;

}


/* =========================================
   PREVIEW CONTACT HELPERS
========================================= */

function zevRbPreviewText(id) {

    const element =
        zevRbEl(id);


    if (!element) {

        return "";

    }


    return element.value.trim();

}


function zevRbPreviewLinkLabel(
    value,
    type
) {

    if (!value) {

        return "";

    }


    try {

        const parsed =
            new URL(value);


        let path =
            parsed.pathname || "";


        path =
            path.replace(
                /^\/|\/$/g,
                ""
            );


        if (
            type === "linkedin"
        ) {

            if (path) {

                return (
                    "linkedin.com/" +
                    path
                );

            }


            return "LinkedIn";

        }


        if (
            type === "github"
        ) {

            if (path) {

                return (
                    "github.com/" +
                    path
                );

            }


            return "GitHub";

        }


        if (
            type === "portfolio"
        ) {

            let host =
                parsed.hostname || "";


            host =
                host.replace(
                    /^www\./i,
                    ""
                );


            return (
                host ||
                "Portfolio"
            );

        }


    } catch (error) {

        return value;

    }


    return value;

}


/* =========================================
   LIVE PREVIEW
========================================= */

function zevRbUpdatePreview() {

    const previewName =
        zevRbEl(
            "zevqyn-preview-name"
        );

    const previewProfessionalTitle =
        zevRbEl(
            "zevqyn-preview-professional-title"
        );

    const previewContact =
        zevRbEl(
            "zevqyn-preview-contact"
        );

    const previewLinks =
        zevRbEl(
            "zevqyn-preview-links"
        );

    const previewSummary =
        zevRbEl(
            "zevqyn-preview-summary"
        );

    const previewContent =
        zevRbEl(
            "zevqyn-preview-content"
        );


    const fullName =
        zevRbPreviewText(
            "zevqyn-resume-full-name"
        );

    const professionalTitle =
        zevRbPreviewText(
            "zevqyn-resume-professional-title"
        );

    const email =
        zevRbPreviewText(
            "zevqyn-resume-email"
        );

    const phone =
        zevRbPreviewText(
            "zevqyn-resume-phone"
        );

    const location =
        zevRbPreviewText(
            "zevqyn-resume-location"
        );

    const linkedin =
        zevRbPreviewText(
            "zevqyn-resume-linkedin"
        );

    const github =
        zevRbPreviewText(
            "zevqyn-resume-github"
        );

    const portfolio =
        zevRbPreviewText(
            "zevqyn-resume-portfolio"
        );

    const summary =
        zevRbEl(
            "zevqyn-resume-summary"
        );


    /* NAME */

    if (previewName) {

        previewName.textContent =
            fullName ||
            "Your Name";

    }


    /* PROFESSIONAL TITLE */

    if (previewProfessionalTitle) {

        previewProfessionalTitle.textContent =
            professionalTitle;

        if (professionalTitle) {

            previewProfessionalTitle.hidden =
                false;

        } else {

            previewProfessionalTitle.hidden =
                true;

        }

    }


    /* CONTACT LINE */

    if (previewContact) {

        const contactParts = [];


        if (email) {

            contactParts.push(
                email
            );

        }


        if (phone) {

            contactParts.push(
                phone
            );

        }


        if (location) {

            contactParts.push(
                location
            );

        }


        previewContact.textContent =
            contactParts.join(" • ");


        if (
            contactParts.length > 0
        ) {

            previewContact.hidden =
                false;

        } else {

            previewContact.hidden =
                true;

        }

    }


    /* PROFESSIONAL LINKS */

    if (previewLinks) {

        previewLinks.innerHTML = "";


        const links = [];


        if (linkedin) {

            links.push({
                value:
                    linkedin,

               label:
    "LinkedIn"
            });

        }


        if (github) {

            links.push({
                value:
                    github,

                label:
    "GitHub"
            });

        }


        if (portfolio) {

            links.push({
                value:
                    portfolio,

             label:
    "Portfolio"
            });

        }


        links.forEach(
            function (
                link,
                index
            ) {

                if (index > 0) {

                    const separator =
                        document.createElement(
                            "span"
                        );

                    separator.className =
                        "zev-rb-preview-link-separator";

                    separator.textContent =
                        " • ";

                    previewLinks.appendChild(
                        separator
                    );

                }


                const anchor =
                    document.createElement(
                        "a"
                    );

                anchor.href =
                    link.value;

                anchor.textContent =
                    link.label;

                anchor.target =
                    "_blank";

                anchor.rel =
                    "noopener noreferrer";


                previewLinks.appendChild(
                    anchor
                );

            }
        );


        if (
            links.length > 0
        ) {

            previewLinks.hidden =
                false;

        } else {

            previewLinks.hidden =
                true;

        }

    }


    /* SUMMARY */

    if (previewSummary) {

        previewSummary.textContent =
            summary
                ? summary.value.trim() ||
                  "Add your professional summary."
                : "Add your professional summary.";

    }


    if (!previewContent) {
        return;
    }


    previewContent.innerHTML = "";


    const sections = [
        {
            type:
                "project",

            title:
                "PROJECTS"
        },
        {
            type:
                "skill",

            title:
                "SKILLS"
        },
        {
            type:
                "education",

            title:
                "EDUCATION"
        },
        {
            type:
                "certificate",

            title:
                "CERTIFICATES"
        }
    ];


    sections.forEach(
        function (section) {

            const records =
                zevRbItems.filter(
                    function (item) {

                        return (
                            item.section_type ===
                            section.type
                        );

                    }
                );


            if (
                records.length === 0
            ) {

                return;

            }


            const sectionElement =
                document.createElement(
                    "div"
                );

            sectionElement.className =
                "zev-rb-preview-section";


            const heading =
                document.createElement(
                    "h3"
                );

            heading.textContent =
                section.title;


            sectionElement.appendChild(
                heading
            );


            records.forEach(
                function (item) {
if (
    section.type ===
    "skill"
) {

    const skillRow =
        document.createElement(
            "div"
        );

    skillRow.className =
        "zev-rb-preview-skill-row";


    const skillCategory =
        document.createElement(
            "strong"
        );

    skillCategory.textContent =
        item.subtitle
            ? item.subtitle.charAt(0).toUpperCase() +
              item.subtitle.slice(1) +
              ": "
            : "Skills: ";


    const skillName =
        document.createElement(
            "span"
        );

    skillName.textContent =
        item.title || "Skill";


    skillRow.appendChild(
        skillCategory
    );

    skillRow.appendChild(
        skillName
    );

    sectionElement.appendChild(
        skillRow
    );

    return;
}

if (
    section.type ===
    "education"
) {

    const educationEntry =
        document.createElement(
            "div"
        );

    educationEntry.className =
        "zev-rb-preview-education";


    const educationTop =
        document.createElement(
            "div"
        );

    educationTop.className =
        "zev-rb-preview-education-top";


    const institution =
        document.createElement(
            "strong"
        );

    institution.textContent =
        item.title ||
        "Institution";


    const descriptionParts =
        (item.description || "")
            .split("|");


    let dateText =
        descriptionParts[0]
            ? descriptionParts[0].trim()
            : "";


    const educationDescription =
        descriptionParts[1]
            ? descriptionParts
                .slice(1)
                .join("|")
                .trim()
            : "";


    dateText =
        dateText.replace(
            /(\d{4})-(\d{2})-(\d{2})/g,
            function (
                match,
                year,
                month
            ) {

                const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ];

                return (
                    months[
                        Number(month) - 1
                    ] +
                    " " +
                    year
                );

            }
        );


    const dates =
        document.createElement(
            "span"
        );

    dates.className =
        "zev-rb-preview-education-date";

    dates.textContent =
        dateText;


    educationTop.appendChild(
        institution
    );

    educationTop.appendChild(
        dates
    );

    educationEntry.appendChild(
        educationTop
    );


    if (item.subtitle) {

        const degree =
            document.createElement(
                "div"
            );

        degree.className =
            "zev-rb-preview-degree";

        let degreeText =
            item.subtitle.trim();


        const degreeMatch =
    degreeText.match(
        /^(BS\s+.+?)\s+in\s+(.+)$/i
    );


      if (
    degreeMatch &&
    degreeMatch[1]
        .toLowerCase()
        .endsWith(
            degreeMatch[2]
                .toLowerCase()
        )
) {

    degreeText =
        degreeMatch[1];

}


        degree.textContent =
            degreeText;

        educationEntry.appendChild(
            degree
        );

    }


    if (educationDescription) {

        const description =
            document.createElement(
                "div"
            );

        description.className =
            "zev-rb-preview-education-description";

        description.textContent =
            educationDescription;

        educationEntry.appendChild(
            description
        );

    }


    sectionElement.appendChild(
        educationEntry
    );

    return;
}

if (
    section.type ===
    "project"
) {

    const projectEntry =
        document.createElement(
            "div"
        );

    projectEntry.className =
        "zev-rb-preview-project";


    const projectTitle =
        document.createElement(
            "strong"
        );

    projectTitle.className =
        "zev-rb-preview-project-title";

    projectTitle.textContent =
        item.title ||
        "Project";

    projectEntry.appendChild(
        projectTitle
    );


    if (item.subtitle) {

        const technologies =
            document.createElement(
                "div"
            );

        technologies.className =
            "zev-rb-preview-project-tech";

        technologies.textContent =
            item.subtitle
                .split(",")
                .map(
                    function (technology) {
                        return technology.trim();
                    }
                )
                .filter(
                    function (technology) {
                        return technology.length > 0;
                    }
                )
                .join(" · ");

        projectEntry.appendChild(
            technologies
        );

    }


    if (item.description) {

        const description =
            document.createElement(
                "div"
            );

        description.className =
            "zev-rb-preview-project-description";

        description.textContent =
            "• " +
            item.description;

        projectEntry.appendChild(
            description
        );

    }


    sectionElement.appendChild(
        projectEntry
    );

    return;
}

if (
    section.type ===
    "certificate"
) {

    const certificateEntry =
        document.createElement(
            "div"
        );

    certificateEntry.className =
        "zev-rb-preview-certificate";


    const certificateTop =
        document.createElement(
            "div"
        );

    certificateTop.className =
        "zev-rb-preview-certificate-top";


    const certificateName =
        document.createElement(
            "strong"
        );

    certificateName.className =
        "zev-rb-preview-certificate-name";

    certificateName.textContent =
        item.title || "Certificate";


    if (item.subtitle) {

        certificateName.textContent +=
            " - " + item.subtitle;

    }


    const certificateDate =
        document.createElement(
            "span"
        );

    certificateDate.className =
        "zev-rb-preview-certificate-date";


    let dateText =
        (item.description || "")
            .replace(
                /^Issued:\s*/i,
                ""
            )
            .trim();


    dateText =
        dateText.replace(
            /^(\d{4})-(\d{2})-(\d{2})$/,
            function (
                match,
                year,
                month
            ) {

                const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ];

                return (
                    months[
                        Number(month) - 1
                    ] +
                    " " +
                    year
                );

            }
        );


    certificateDate.textContent =
        dateText;


    certificateTop.appendChild(
        certificateName
    );

    certificateTop.appendChild(
        certificateDate
    );

    certificateEntry.appendChild(
        certificateTop
    );

    sectionElement.appendChild(
        certificateEntry
    );

    return;
}

                    const entry =
                        document.createElement(
                            "div"
                        );

                    entry.className =
                        "zev-rb-preview-entry";


                    const title =
                        document.createElement(
                            "strong"
                        );

                    title.textContent =
                        zevRbItemTitle(
                            item
                        );


                    entry.appendChild(
                        title
                    );


                    const subtitleText =
                        zevRbItemSubtitle(
                            item
                        );


                    if (subtitleText) {

                        const subtitle =
                            document.createElement(
                                "span"
                            );

                        subtitle.textContent =
                            subtitleText;

                        entry.appendChild(
                            subtitle
                        );

                    }


                    const descriptionText =
                        zevRbItemDescription(
                            item
                        );


                    if (descriptionText) {

                        const description =
                            document.createElement(
                                "p"
                            );

                        description.textContent =
                            descriptionText;

                        entry.appendChild(
                            description
                        );

                    }


                    sectionElement.appendChild(
                        entry
                    );

                }
            );


            previewContent.appendChild(
                sectionElement
            );

        }
    );

}


/* =========================================
   PDF EXPORT
========================================= */

async function zevRbExportPdf() {

    if (!zevRbResume) {

        zevRbToast(
            "Create a resume first.",
            "error"
        );

        return;

    }


    const button =
        zevRbEl(
            "zevqyn-export-pdf"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "Exporting...";

    }


    try {

        const response =
            await fetch(
                ZEV_RB_API_BASE +
                "/api/v1/resumes/" +
                encodeURIComponent(
                    zevRbResume.id
                ) +
                "/pdf",
                {
                    method:
                        "GET",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            zevRbSession
                                .access_token
                    }
                }
            );


        if (!response.ok) {

            let message =
                "Could not export PDF.";


            try {

                const data =
                    await response.json();


                if (data.detail) {

                    if (
                        typeof data.detail ===
                        "string"
                    ) {

                        message =
                            data.detail;

                    }

                }


            } catch (error) {

                console.error(
                    "PDF response parse error:",
                    error
                );

            }


            throw new Error(
                message
            );

        }


        const blob =
            await response.blob();


        const url =
            URL.createObjectURL(
                blob
            );


        const anchor =
            document.createElement(
                "a"
            );


        anchor.href =
            url;


        let filename =
            zevRbResume.name ||
            "resume";


        filename =
            filename
                .replace(
                    /[^a-z0-9]+/gi,
                    "-"
                )
                .replace(
                    /^-|-$/g,
                    ""
                )
                .toLowerCase();


        anchor.download =
            (filename || "resume") +
            ".pdf";


        document.body.appendChild(
            anchor
        );


        anchor.click();

        anchor.remove();


        setTimeout(
            function () {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );


        zevRbToast(
            "Resume PDF exported.",
            "success"
        );


    } catch (error) {

        console.error(
            "PDF export error:",
            error
        );


        zevRbToast(
            error.message ||
            "Could not export PDF.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Export PDF ↓";

        }

    }

}


/* =========================================
   SOURCE TAB
========================================= */

function zevRbSetSource(
    type,
    button
) {

    zevRbActiveSource =
        type;


    const tabs =
        document.querySelectorAll(
            ".zev-rb-source-tabs button"
        );


    tabs.forEach(
        function (tab) {

            tab.classList.remove(
                "active"
            );

        }
    );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    zevRbRenderSourceList();

}


/* =========================================
   MANUAL CAREER RECORDS
========================================= */

function zevRbManualField(
    id,
    label,
    type,
    placeholder,
    required,
    full,
    extra
) {

    const requiredMark =
        required
            ? ' <span class="zev-rb-manual-required">*</span>'
            : "";


    const fullClass =
        full
            ? " full"
            : "";


    const safeExtra =
        extra || "";


    if (
        type === "textarea"
    ) {

        return (
            '<div class="zev-rb-field' +
            fullClass +
            '">' +

                '<label for="' +
                id +
                '">' +
                label +
                requiredMark +
                '</label>' +

                '<textarea id="' +
                id +
                '" placeholder="' +
                placeholder +
                '" ' +
                safeExtra +
                '></textarea>' +

            '</div>'
        );

    }


    return (
        '<div class="zev-rb-field' +
        fullClass +
        '">' +

            '<label for="' +
            id +
            '">' +
            label +
            requiredMark +
            '</label>' +

            '<input type="' +
            type +
            '" id="' +
            id +
            '" placeholder="' +
            placeholder +
            '" ' +
                 safeExtra +
            '>' +

        '</div>'
    );

}




/* =========================================
   MANUAL PROJECT FORM
========================================= */

function zevRbManualProjectForm() {

    return (

        zevRbManualField(
            "zevqyn-manual-project-title",
            "Project Title",
            "text",
            "Example: AI Research Assistant",
            true,
            true,
            'maxlength="200"'
        ) +


        zevRbManualField(
            "zevqyn-manual-project-short",
            "Short Description",
            "textarea",
            "A concise description of the project",
            true,
            true,
            'maxlength="500"'
        ) +


        zevRbManualField(
            "zevqyn-manual-project-description",
            "Full Description",
            "textarea",
            "Explain what you built, the problem and your contribution",
            true,
            true,
            'maxlength="5000"'
        ) +


        zevRbManualField(
            "zevqyn-manual-project-tech",
            "Technologies",
            "text",
            "Python, FastAPI, JavaScript",
            false,
            false,
            ""
        ) +


        zevRbManualField(
            "zevqyn-manual-project-skills",
            "Skills Demonstrated",
            "text",
            "REST APIs, Backend Development",
            false,
            false,
            ""
        ) +


        zevRbManualField(
            "zevqyn-manual-project-github",
            "GitHub URL",
            "url",
            "https://github.com/...",
            false,
            false,
            'maxlength="500"'
        ) +


        zevRbManualField(
            "zevqyn-manual-project-live",
            "Live Project URL",
            "url",
            "https://...",
            false,
            false,
            'maxlength="500"'
        ) +


        zevRbManualField(
            "zevqyn-manual-project-image",
            "Project Image URL",
            "url",
            "https://...",
            false,
            true,
            'maxlength="500"'
        ) +


        '<div class="zev-rb-field full">' +

            '<label for="zevqyn-manual-project-visibility">' +
                'Visibility' +
            '</label>' +

            '<select id="zevqyn-manual-project-visibility">' +
                '<option value="private">Private</option>' +
                '<option value="public">Public</option>' +
            '</select>' +

        '</div>'

    );

}


/* =========================================
   MANUAL SKILL FORM
========================================= */

function zevRbManualSkillForm() {

    return (

        zevRbManualField(
            "zevqyn-manual-skill-name",
            "Skill Name",
            "text",
            "Example: FastAPI",
            true,
            true,
            'maxlength="100"'
        ) +


        zevRbManualField(
            "zevqyn-manual-skill-category",
            "Category",
            "text",
            "Example: Backend Development",
            true,
            false,
            'maxlength="50"'
        ) +


        '<div class="zev-rb-field">' +

            '<label for="zevqyn-manual-skill-proficiency">' +
                'Proficiency ' +
                '<span class="zev-rb-manual-required">*</span>' +
            '</label>' +

            '<select id="zevqyn-manual-skill-proficiency">' +

                '<option value="1">' +
                    '1 - Beginner' +
                '</option>' +

                '<option value="2">' +
                    '2 - Basic' +
                '</option>' +

                '<option value="3" selected>' +
                    '3 - Intermediate' +
                '</option>' +

                '<option value="4">' +
                    '4 - Advanced' +
                '</option>' +

                '<option value="5">' +
                    '5 - Expert' +
                '</option>' +

            '</select>' +

        '</div>'

    );

}


/* =========================================
   MANUAL EDUCATION FORM
========================================= */

function zevRbManualEducationForm() {

    return (

        zevRbManualField(
            "zevqyn-manual-education-institution",
            "Institution",
            "text",
            "Example: Air University",
            true,
            true,
            'maxlength="200"'
        ) +


        zevRbManualField(
            "zevqyn-manual-education-degree",
            "Degree",
            "text",
            "Example: BS Computer Science",
            true,
            false,
            'maxlength="200"'
        ) +


        zevRbManualField(
            "zevqyn-manual-education-field",
            "Field of Study",
            "text",
            "Example: Computer Science",
            true,
            false,
            'maxlength="200"'
        ) +


        zevRbManualField(
            "zevqyn-manual-education-start",
            "Start Date",
            "date",
            "",
            true,
            false,
            ""
        ) +


        zevRbManualField(
            "zevqyn-manual-education-end",
            "End Date",
            "date",
            "",
            false,
            false,
            ""
        ) +


        zevRbManualField(
            "zevqyn-manual-education-description",
            "Description",
            "textarea",
            "Optional academic details, achievements or coursework",
            false,
            true,
            'maxlength="2000"'
        )

    );

}


/* =========================================
   MANUAL CERTIFICATE FORM
========================================= */

function zevRbManualCertificateForm() {

    return (

        zevRbManualField(
            "zevqyn-manual-certificate-title",
            "Certificate Title",
            "text",
            "Example: Python Programming",
            true,
            true,
            'maxlength="200"'
        ) +


        zevRbManualField(
            "zevqyn-manual-certificate-issuer",
            "Issuer",
            "text",
            "Example: Coursera",
            true,
            true,
            'maxlength="200"'
        ) +


        zevRbManualField(
            "zevqyn-manual-certificate-issue",
            "Issue Date",
            "date",
            "",
            true,
            false,
            ""
        ) +


        zevRbManualField(
            "zevqyn-manual-certificate-expiry",
            "Expiry Date",
            "date",
            "",
            false,
            false,
            ""
        ) +


        zevRbManualField(
            "zevqyn-manual-certificate-id",
            "Credential ID",
            "text",
            "Optional credential ID",
            false,
            false,
            'maxlength="200"'
        ) +


        zevRbManualField(
            "zevqyn-manual-certificate-url",
            "Credential URL",
            "url",
            "https://...",
            false,
            false,
            'maxlength="500"'
        ) +


        zevRbManualField(
            "zevqyn-manual-certificate-description",
            "Description",
            "textarea",
            "Optional certificate details",
            false,
            true,
            'maxlength="2000"'
        )

    );

}


/* =========================================
   OPEN MANUAL MODAL
========================================= */

function zevRbOpenManualModal() {

    if (!zevRbResume) {

        zevRbToast(
            "Create a resume first.",
            "error"
        );

        return;

    }


    const modal =
        zevRbEl(
            "zevqyn-manual-modal"
        );

    const title =
        zevRbEl(
            "zevqyn-manual-title"
        );

    const description =
        zevRbEl(
            "zevqyn-manual-description"
        );

    const form =
        zevRbEl(
            "zevqyn-manual-form"
        );


    if (!modal) {
        return;
    }


    if (!form) {
        return;
    }


    if (
        zevRbActiveSource ===
        "project"
    ) {

        if (title) {

            title.textContent =
                "Add Project Manually";

        }


        if (description) {

            description.textContent =
                "Create a real ZEVQYN project and attach it to this resume.";

        }


        form.innerHTML =
            zevRbManualProjectForm();


    } else if (
        zevRbActiveSource ===
        "skill"
    ) {

        if (title) {

            title.textContent =
                "Add Skill Manually";

        }


        if (description) {

            description.textContent =
                "Create a skill record and attach it to this resume.";

        }


        form.innerHTML =
            zevRbManualSkillForm();


    } else if (
        zevRbActiveSource ===
        "education"
    ) {

        if (title) {

            title.textContent =
                "Add Education Manually";

        }


        if (description) {

            description.textContent =
                "Create an education record and attach it to this resume.";

        }


        form.innerHTML =
            zevRbManualEducationForm();


    } else {

        if (title) {

            title.textContent =
                "Add Certificate Manually";

        }


        if (description) {

            description.textContent =
                "Create a certificate record and attach it to this resume.";

        }


        form.innerHTML =
            zevRbManualCertificateForm();

    }


    modal.hidden = false;

}


/* =========================================
   CLOSE MANUAL MODAL
========================================= */

function zevRbCloseManualModal() {

    const modal =
        zevRbEl(
            "zevqyn-manual-modal"
        );


    if (modal) {

        modal.hidden = true;

    }

}


/* =========================================
   MANUAL VALUE HELPERS
========================================= */

function zevRbManualValue(id) {

    const element =
        zevRbEl(id);


    return element
        ? element.value.trim()
        : "";

}


function zevRbManualList(value) {

    if (!value) {

        return [];

    }


    return value
        .split(",")
        .map(
            function (item) {

                return item.trim();

            }
        )
        .filter(
            function (item) {

                return (
                    item.length > 0
                );

            }
        )
        .slice(
            0,
            20
        );

}


function zevRbManualNull(value) {

    return value
        ? value
        : null;

}


/* =========================================
   BUILD MANUAL REQUEST
========================================= */

function zevRbBuildManualRequest() {

    /* PROJECT */

    if (
        zevRbActiveSource ===
        "project"
    ) {

        const title =
            zevRbManualValue(
                "zevqyn-manual-project-title"
            );

        const shortDescription =
            zevRbManualValue(
                "zevqyn-manual-project-short"
            );

        const description =
            zevRbManualValue(
                "zevqyn-manual-project-description"
            );


        if (!title) {

            throw new Error(
                "Project title is required."
            );

        }


        if (!shortDescription) {

            throw new Error(
                "Short description is required."
            );

        }


        if (!description) {

            throw new Error(
                "Full project description is required."
            );

        }


        return {

            path:
                "/api/v1/projects",

            payload: {

                title:
                    title,

                short_description:
                    shortDescription,

                description:
                    description,

                technologies:
                    zevRbManualList(
                        zevRbManualValue(
                            "zevqyn-manual-project-tech"
                        )
                    ),

                skills:
                    zevRbManualList(
                        zevRbManualValue(
                            "zevqyn-manual-project-skills"
                        )
                    ),

                github_url:
                    zevRbManualNull(
                        zevRbManualValue(
                            "zevqyn-manual-project-github"
                        )
                    ),

                live_url:
                    zevRbManualNull(
                        zevRbManualValue(
                            "zevqyn-manual-project-live"
                        )
                    ),

                image_url:
                    zevRbManualNull(
                        zevRbManualValue(
                            "zevqyn-manual-project-image"
                        )
                    ),

                visibility:
                    zevRbManualValue(
                        "zevqyn-manual-project-visibility"
                    ) ||
                    "private"

            }

        };

    }


    /* SKILL */

    if (
        zevRbActiveSource ===
        "skill"
    ) {

        const name =
            zevRbManualValue(
                "zevqyn-manual-skill-name"
            );

        const category =
            zevRbManualValue(
                "zevqyn-manual-skill-category"
            );

        const proficiency =
            Number(
                zevRbManualValue(
                    "zevqyn-manual-skill-proficiency"
                )
            );


        if (!name) {

            throw new Error(
                "Skill name is required."
            );

        }


        if (!category) {

            throw new Error(
                "Skill category is required."
            );

        }


        return {

            path:
                "/api/v1/career/skills",

            payload: {

                name:
                    name,

                category:
                    category,

                proficiency:
                    proficiency

            }

        };

    }


    /* EDUCATION */

    if (
        zevRbActiveSource ===
        "education"
    ) {

        const institution =
            zevRbManualValue(
                "zevqyn-manual-education-institution"
            );

        const degree =
            zevRbManualValue(
                "zevqyn-manual-education-degree"
            );

        const field =
            zevRbManualValue(
                "zevqyn-manual-education-field"
            );

        const startDate =
            zevRbManualValue(
                "zevqyn-manual-education-start"
            );

        const endDate =
            zevRbManualValue(
                "zevqyn-manual-education-end"
            );


        if (!institution) {

            throw new Error(
                "Institution is required."
            );

        }


        if (!degree) {

            throw new Error(
                "Degree is required."
            );

        }


        if (!field) {

            throw new Error(
                "Field of study is required."
            );

        }


        if (!startDate) {

            throw new Error(
                "Education start date is required."
            );

        }


        if (endDate) {

            if (
                endDate < startDate
            ) {

                throw new Error(
                    "Education end date cannot be before the start date."
                );

            }

        }


        return {

            path:
                "/api/v1/career/education",

            payload: {

                institution:
                    institution,

                degree:
                    degree,

                field_of_study:
                    field,

                start_date:
                    startDate,

                end_date:
                    zevRbManualNull(
                        endDate
                    ),

                description:
                    zevRbManualNull(
                        zevRbManualValue(
                            "zevqyn-manual-education-description"
                        )
                    )

            }

        };

    }


    /* CERTIFICATE */

    const certificateTitle =
        zevRbManualValue(
            "zevqyn-manual-certificate-title"
        );

    const issuer =
        zevRbManualValue(
            "zevqyn-manual-certificate-issuer"
        );

    const issueDate =
        zevRbManualValue(
            "zevqyn-manual-certificate-issue"
        );

    const expiryDate =
        zevRbManualValue(
            "zevqyn-manual-certificate-expiry"
        );


    if (!certificateTitle) {

        throw new Error(
            "Certificate title is required."
        );

    }


    if (!issuer) {

        throw new Error(
            "Certificate issuer is required."
        );

    }


    if (!issueDate) {

        throw new Error(
            "Certificate issue date is required."
        );

    }

if (expiryDate) {
  
        if (
            expiryDate < issueDate
        ) {

            throw new Error(
                "Certificate expiry date cannot be before the issue date."
            );

        }

    }


    return {

        path:
            "/api/v1/career/certificates",

        payload: {

            title:
                certificateTitle,

            issuer:
                issuer,

            issue_date:
                issueDate,

            expiry_date:
                zevRbManualNull(
                    expiryDate
                ),

            credential_id:
                zevRbManualNull(
                    zevRbManualValue(
                        "zevqyn-manual-certificate-id"
                    )
                ),

            credential_url:
                zevRbManualNull(
                    zevRbManualValue(
                        "zevqyn-manual-certificate-url"
                    )
                ),

            description:
                zevRbManualNull(
                    zevRbManualValue(
                        "zevqyn-manual-certificate-description"
                    )
                )

        }

    };

}


/* =========================================
   SAVE MANUAL RECORD + ATTACH TO RESUME
========================================= */

async function zevRbSaveManualRecord() {

    const button =
        zevRbEl(
            "zevqyn-manual-save"
        );


    if (!zevRbResume) {

        zevRbToast(
            "Create a resume first.",
            "error"
        );

        return;

    }


    let request = null;


    try {

        request =
            zevRbBuildManualRequest();


    } catch (error) {

        zevRbToast(
            error.message,
            "error"
        );

        return;

    }


    if (button) {

        button.disabled = true;

        button.textContent =
            "Saving...";

    }


    try {

        const created =
            await zevRbApi(
                request.path,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            request.payload
                        )
                }
            );


        zevRbSources[
            zevRbActiveSource
        ].push(
            created
        );


        await zevRbAddItem(
            zevRbActiveSource,
            created.id,
            null
        );


        zevRbCloseManualModal();

        zevRbRenderSourceList();


        zevRbToast(
            "Record created and added to resume.",
            "success"
        );


    } catch (error) {

        console.error(
            "Manual career record error:",
            error
        );


        zevRbToast(
            error.message ||
            "Could not create career record.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Save & Add";

        }

    }

}


/* =========================================
   EVENTS
========================================= */

function zevRbSetupEvents() {

    const newResume =
        zevRbEl(
            "zevqyn-new-resume"
        );

    const emptyCreate =
        zevRbEl(
            "zevqyn-empty-create"
        );

    const cancelResume =
        zevRbEl(
            "zevqyn-cancel-resume"
        );

    const createResume =
        zevRbEl(
            "zevqyn-create-resume"
        );

    const saveResume =
        zevRbEl(
            "zevqyn-save-resume"
        );

    const deleteResume =
        zevRbEl(
            "zevqyn-delete-resume"
        );

    const exportPdf =
        zevRbEl(
            "zevqyn-export-pdf"
        );

    const resumeSelect =
        zevRbEl(
            "zevqyn-resume-select"
        );

    const resumeSummary =
        zevRbEl(
            "zevqyn-resume-summary"
        );

    const newName =
        zevRbEl(
            "zevqyn-new-resume-name"
        );


    /* PERSONAL INFORMATION INPUTS */

    const personalFields = [
        "zevqyn-resume-full-name",
        "zevqyn-resume-professional-title",
        "zevqyn-resume-email",
        "zevqyn-resume-phone",
        "zevqyn-resume-location",
        "zevqyn-resume-linkedin",
        "zevqyn-resume-github",
        "zevqyn-resume-portfolio"
    ];


    /* MANUAL ENTRY ELEMENTS */

    const manualEntry =
        zevRbEl(
            "zevqyn-manual-entry"
        );

    const manualCancel =
        zevRbEl(
            "zevqyn-manual-cancel"
        );

    const manualSave =
        zevRbEl(
            "zevqyn-manual-save"
        );


    /* NEW RESUME */

    if (newResume) {

        newResume.addEventListener(
            "click",
            zevRbOpenCreateModal
        );

    }


    if (emptyCreate) {

        emptyCreate.addEventListener(
            "click",
            zevRbOpenCreateModal
        );

    }


    if (cancelResume) {

        cancelResume.addEventListener(
            "click",
            zevRbCloseCreateModal
        );

    }


    if (createResume) {

        createResume.addEventListener(
            "click",
            zevRbCreateResume
        );

    }


    /* SAVE */

    if (saveResume) {

        saveResume.addEventListener(
            "click",
            zevRbSaveResume
        );

    }


    /* DELETE */

    if (deleteResume) {

        deleteResume.addEventListener(
            "click",
            zevRbDeleteResume
        );

    }


    /* EXPORT */

    if (exportPdf) {

        exportPdf.addEventListener(
            "click",
            zevRbExportPdf
        );

    }


    /* RESUME SELECTOR */

    if (resumeSelect) {

        resumeSelect.addEventListener(
            "change",
            function () {

                zevRbOpenResume(
                    resumeSelect.value
                );

            }
        );

    }


    /* LIVE PERSONAL INFORMATION PREVIEW */

    personalFields.forEach(
        function (fieldId) {

            const field =
                zevRbEl(
                    fieldId
                );


            if (field) {

                field.addEventListener(
                    "input",
                    function () {

                        zevRbUpdatePreview();

                    }
                );

            }

        }
    );


    /* LIVE SUMMARY PREVIEW */

    if (resumeSummary) {

        resumeSummary.addEventListener(
            "input",
            function () {

                zevRbUpdateSummaryCount();

                zevRbUpdatePreview();

            }
        );

    }


    /* CREATE RESUME WITH ENTER */

    if (newName) {

        newName.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    zevRbCreateResume();

                }

            }
        );

    }


    /* MANUAL ENTRY */

    if (manualEntry) {

        manualEntry.addEventListener(
            "click",
            zevRbOpenManualModal
        );

    }


    if (manualCancel) {

        manualCancel.addEventListener(
            "click",
            zevRbCloseManualModal
        );

    }


    if (manualSave) {

        manualSave.addEventListener(
            "click",
            zevRbSaveManualRecord
        );

    }


    /* CAREER RECORD TABS */

    const tabs =
        document.querySelectorAll(
            ".zev-rb-source-tabs button"
        );


    tabs.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    zevRbSetSource(
                        button.getAttribute(
                            "data-source"
                        ),
                        button
                    );

                }
            );

        }
    );


    /* CLOSE CREATE MODAL BY CLICKING BACKDROP */

    const createModal =
        zevRbEl(
            "zevqyn-resume-modal"
        );


    if (createModal) {

        createModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    createModal
                ) {

                    zevRbCloseCreateModal();

                }

            }
        );

    }


    /* CLOSE MANUAL MODAL BY CLICKING BACKDROP */

    const manualModal =
        zevRbEl(
            "zevqyn-manual-modal"
        );


    if (manualModal) {

        manualModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    manualModal
                ) {

                    zevRbCloseManualModal();

                }

            }
        );

    }


    /* ESC KEY CLOSES MODALS */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                zevRbCloseCreateModal();

                zevRbCloseManualModal();

            }

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

async function zevRbInitialize() {

    const root =
        zevRbEl(
            "zevqyn-resume-builder"
        );


    if (!root) {

        return;

    }


    try {

        await zevRbSetupAuth();


        zevRbSetupEvents();


        await zevRbLoadSources();


        await zevRbLoadResumes();


    } catch (error) {

        console.error(
            "Resume Builder initialization error:",
            error
        );


        zevRbToast(
            error.message ||
            "Could not initialize Resume Builder.",
            "error"
        );

    }

}


/* =========================================
   WORDPRESS-SAFE START
========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            zevRbInitialize();

        }
    );

} else {

    zevRbInitialize();

}
