
const ZEV_CAREER_API =
    "https://zevqyn-backend.onrender.com/api/v1";

const ZEV_CAREER_SUPABASE_URL =
    "https://phjizxajnigiiawitkyx.supabase.co";

const ZEV_CAREER_SUPABASE_KEY =
    "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";


let zevCareerSupabase = null;
let zevCareerSession = null;

let zevCareerProfile = null;
let zevCareerProjects = [];
let zevCareerSkills = [];
let zevCareerEducation = [];
let zevCareerCertificates = [];

let zevCareerModalType = null;
let zevCareerEditingId = null;


/* =========================================================
   HELPERS
   ========================================================= */

function zevCareerEl(id) {
    return document.getElementById(id);
}


function zevCareerEscape(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value === null ||
        value === undefined
            ? ""
            : String(value);

    return div.innerHTML;
}


function zevCareerValue(value) {

    if (value === null) {
        return "";
    }

    if (value === undefined) {
        return "";
    }

    return value;
}


function zevCareerStatus(message, type) {

    const status =
        zevCareerEl(
            "zev-career-status"
        );

    status.className =
        "zev-career-status";

    status.textContent = "";

    if (!message) {
        return;
    }

    status.textContent =
        message;

    status.classList.add(
        type || "success"
    );

    window.setTimeout(
        function () {

            if (
                status.textContent ===
                message
            ) {
                status.className =
                    "zev-career-status";

                status.textContent = "";
            }

        },
        4500
    );
}


function zevCareerFormatDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(
            value + "T00:00:00"
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short"
        }
    );
}


function zevCareerNullable(value) {

    const clean =
        String(value || "").trim();

    if (!clean) {
        return null;
    }

    return clean;
}


function zevCareerArray(value) {

    return String(value || "")
        .split(",")
        .map(
            function (item) {
                return item.trim();
            }
        )
        .filter(
            function (item) {
                return Boolean(item);
            }
        );
}


/* =========================================================
   AUTH
   ========================================================= */

async function zevCareerRequireSession() {

    if (!window.supabase) {
        throw new Error(
            "Supabase client is not available."
        );
    }

    zevCareerSupabase =
        window.supabase.createClient(
            ZEV_CAREER_SUPABASE_URL,
            ZEV_CAREER_SUPABASE_KEY
        );

    const result =
        await zevCareerSupabase.auth
            .getSession();

    zevCareerSession =
        result.data.session;

    if (!zevCareerSession) {

        window.location.assign(
            "/login/"
        );

        throw new Error(
            "Authentication required."
        );
    }
}


/* =========================================================
   API
   ========================================================= */

async function zevCareerRequest(
    path,
    options
) {

    if (!zevCareerSession) {
        throw new Error(
            "Authentication required."
        );
    }

    const config =
        options || {};

    const headers = {
        Authorization:
            "Bearer " +
            zevCareerSession.access_token
    };

    if (config.body !== undefined) {
        headers["Content-Type"] =
            "application/json";
    }

    const response =
        await fetch(
            ZEV_CAREER_API + path,
            {
                method:
                    config.method ||
                    "GET",

                headers: headers,

                body:
                    config.body !== undefined
                        ? JSON.stringify(
                            config.body
                        )
                        : undefined
            }
        );

    if (!response.ok) {

        let message =
            "Request failed.";

        try {

            const errorData =
                await response.json();

            if (
                typeof errorData.detail ===
                "string"
            ) {
                message =
                    errorData.detail;
            } else if (
                Array.isArray(
                    errorData.detail
                )
            ) {
                message =
                    errorData.detail
                        .map(
                            function (item) {
                                return item.msg;
                            }
                        )
                        .join(", ");
            }

        } catch (error) {
            message =
                "Request failed with status " +
                response.status +
                ".";
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    const text =
        await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}


/* =========================================================
   LOAD DATA
   ========================================================= */

async function zevCareerLoadAll() {

    const results =
        await Promise.all([
            zevCareerRequest(
                "/profile"
            ),
            zevCareerRequest(
                "/projects"
            ),
            zevCareerRequest(
                "/career/skills"
            ),
            zevCareerRequest(
                "/career/education"
            ),
            zevCareerRequest(
                "/career/certificates"
            )
        ]);

    zevCareerProfile =
        results[0];

    zevCareerProjects =
        Array.isArray(results[1])
            ? results[1]
            : [];

    zevCareerSkills =
        Array.isArray(results[2])
            ? results[2]
            : [];

    zevCareerEducation =
        Array.isArray(results[3])
            ? results[3]
            : [];

    zevCareerCertificates =
        Array.isArray(results[4])
            ? results[4]
            : [];
}


/* =========================================================
   PROFILE
   ========================================================= */

function zevCareerPopulateProfile() {

    const profile =
        zevCareerProfile || {};

    zevCareerEl(
        "zev-profile-full-name"
    ).value =
        zevCareerValue(
            profile.full_name
        );

    zevCareerEl(
        "zev-profile-username"
    ).value =
        zevCareerValue(
            profile.username
        );

    zevCareerEl(
        "zev-profile-location"
    ).value =
        zevCareerValue(
            profile.location
        );

    zevCareerEl(
        "zev-profile-phone"
    ).value =
        zevCareerValue(
            profile.phone
        );

    zevCareerEl(
        "zev-profile-bio"
    ).value =
        zevCareerValue(
            profile.bio
        );

    zevCareerEl(
        "zev-profile-avatar"
    ).value =
        zevCareerValue(
            profile.avatar_url
        );

    zevCareerEl(
        "zev-profile-github"
    ).value =
        zevCareerValue(
            profile.github_url
        );

    zevCareerEl(
        "zev-profile-linkedin"
    ).value =
        zevCareerValue(
            profile.linkedin_url
        );

    zevCareerEl(
        "zev-profile-website"
    ).value =
        zevCareerValue(
            profile.website
        );

    zevCareerUpdateProfilePreview();
}


function zevCareerUpdateProfilePreview() {

    const name =
        zevCareerEl(
            "zev-profile-full-name"
        ).value.trim();

    const username =
        zevCareerEl(
            "zev-profile-username"
        ).value.trim();

    const location =
        zevCareerEl(
            "zev-profile-location"
        ).value.trim();

    const avatarUrl =
        zevCareerEl(
            "zev-profile-avatar"
        ).value.trim();

    zevCareerEl(
        "zev-career-preview-name"
    ).textContent =
        name || "Your Name";

    zevCareerEl(
        "zev-career-preview-username"
    ).textContent =
        username
            ? "@" + username
            : "@username";

    zevCareerEl(
        "zev-career-preview-location"
    ).textContent =
        location ||
        "Add your location";

    const fallback =
        zevCareerEl(
            "zev-career-avatar-fallback"
        );

    const image =
        zevCareerEl(
            "zev-career-avatar"
        );

    fallback.textContent =
        name
            ? name.charAt(0).toUpperCase()
            : "Z";

    if (avatarUrl) {

        image.src =
            avatarUrl;

        image.style.display =
            "block";

        fallback.style.display =
            "none";

    } else {

        image.removeAttribute(
            "src"
        );

        image.style.display =
            "none";

        fallback.style.display =
            "flex";
    }
}


async function zevCareerSaveProfile() {

    const button =
        zevCareerEl(
            "zev-career-save-profile"
        );

    button.disabled = true;
    button.textContent =
        "Saving...";

    const payload = {
        full_name:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-full-name"
                ).value
            ),

        username:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-username"
                ).value
            ),

        location:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-location"
                ).value
            ),

        phone:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-phone"
                ).value
            ),

        bio:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-bio"
                ).value
            ),

        avatar_url:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-avatar"
                ).value
            ),

        github_url:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-github"
                ).value
            ),

        linkedin_url:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-linkedin"
                ).value
            ),

        website:
            zevCareerNullable(
                zevCareerEl(
                    "zev-profile-website"
                ).value
            )
    };

    try {

        zevCareerProfile =
            await zevCareerRequest(
                "/profile",
                {
                    method: "PATCH",
                    body: payload
                }
            );

        zevCareerPopulateProfile();

        zevCareerStatus(
            "Career profile saved successfully.",
            "success"
        );

    } catch (error) {

        zevCareerStatus(
            error.message,
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent =
            "Save Profile";
    }
}


/* =========================================================
   STATS
   ========================================================= */

function zevCareerRenderStats() {

    zevCareerEl(
        "zev-career-project-count"
    ).textContent =
        zevCareerProjects.length;

    zevCareerEl(
        "zev-career-skill-count"
    ).textContent =
        zevCareerSkills.length;

    zevCareerEl(
        "zev-career-education-count"
    ).textContent =
        zevCareerEducation.length;

    zevCareerEl(
        "zev-career-certificate-count"
    ).textContent =
        zevCareerCertificates.length;
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function zevCareerEmpty(
    title,
    message
) {

    return (
        '<div class="zev-career-empty">' +
            "<strong>" +
                zevCareerEscape(title) +
            "</strong>" +
            "<span>" +
                zevCareerEscape(message) +
            "</span>" +
        "</div>"
    );
}


/* =========================================================
   PROJECTS
   ========================================================= */

function zevCareerRenderProjects() {

    const container =
        zevCareerEl(
            "zev-career-projects"
        );

    if (!zevCareerProjects.length) {

        container.innerHTML =
            zevCareerEmpty(
                "No projects yet",
                "Add your first project to your career library."
            );

        return;
    }

    container.innerHTML =
        zevCareerProjects
            .map(
                function (project) {

                    const technologies =
                        Array.isArray(
                            project.technologies
                        )
                            ? project.technologies
                            : [];

                    const tags =
                        technologies
                            .map(
                                function (item) {

                                    return (
                                        '<span class="zev-career-tag">' +
                                        zevCareerEscape(item) +
                                        "</span>"
                                    );
                                }
                            )
                            .join("");

                    return (
                        '<article class="zev-career-record">' +

                            '<div class="zev-career-record-top">' +
                                "<div>" +
                                    '<span class="zev-career-record-label">' +
                                        "PROJECT" +
                                    "</span>" +

                                    "<h4>" +
                                        zevCareerEscape(
                                            project.title
                                        ) +
                                    "</h4>" +

                                    '<div class="zev-career-record-subtitle">' +
                                        zevCareerEscape(
                                            project.short_description ||
                                            ""
                                        ) +
                                    "</div>" +
                                "</div>" +
                            "</div>" +

                            '<p class="zev-career-record-description">' +
                                zevCareerEscape(
                                    project.description ||
                                    "No description added."
                                ) +
                            "</p>" +

                            '<div class="zev-career-record-tags">' +
                                tags +
                            "</div>" +

                            '<div class="zev-career-record-actions">' +

                                '<button type="button" ' +
                                    'class="zev-career-btn zev-career-btn-secondary" ' +
                                    'data-career-edit="project" ' +
                                    'data-career-id="' +
                                    zevCareerEscape(
                                        project.id
                                    ) +
                                    '">' +
                                    "Edit" +
                                "</button>" +

                                '<button type="button" ' +
                                    'class="zev-career-btn zev-career-btn-danger" ' +
                                    'data-career-delete="project" ' +
                                    'data-career-id="' +
                                    zevCareerEscape(
                                        project.id
                                    ) +
                                    '">' +
                                    "Delete" +
                                "</button>" +

                            "</div>" +

                        "</article>"
                    );
                }
            )
            .join("");
}


/* =========================================================
   SKILLS
   ========================================================= */

function zevCareerRenderSkills() {

    const container =
        zevCareerEl(
            "zev-career-skills"
        );

    if (!zevCareerSkills.length) {

        container.innerHTML =
            zevCareerEmpty(
                "No skills yet",
                "Add your first professional skill."
            );

        return;
    }

    container.innerHTML =
        zevCareerSkills
            .map(
                function (skill) {

                    const level =
                        "★".repeat(
                            Number(
                                skill.proficiency ||
                                1
                            )
                        );

                    return (
                        '<article class="zev-career-record">' +

                            '<span class="zev-career-record-label">' +
                                "SKILL" +
                            "</span>" +

                            "<h4>" +
                                zevCareerEscape(
                                    skill.name
                                ) +
                            "</h4>" +

                            '<div class="zev-career-record-subtitle">' +
                                zevCareerEscape(
                                    skill.category ||
                                    "General"
                                ) +
                            "</div>" +

                            '<div class="zev-career-record-tags">' +
                                '<span class="zev-career-tag">' +
                                    "Proficiency " +
                                    zevCareerEscape(
                                        skill.proficiency
                                    ) +
                                    "/5" +
                                "</span>" +

                                '<span class="zev-career-tag">' +
                                    level +
                                "</span>" +
                            "</div>" +

                            '<div class="zev-career-record-actions">' +

                                '<button type="button" ' +
                                    'class="zev-career-btn zev-career-btn-secondary" ' +
                                    'data-career-edit="skill" ' +
                                    'data-career-id="' +
                                    zevCareerEscape(
                                        skill.id
                                    ) +
                                    '">' +
                                    "Edit" +
                                "</button>" +

                                '<button type="button" ' +
                                    'class="zev-career-btn zev-career-btn-danger" ' +
                                    'data-career-delete="skill" ' +
                                    'data-career-id="' +
                                    zevCareerEscape(
                                        skill.id
                                    ) +
                                    '">' +
                                    "Delete" +
                                "</button>" +

                            "</div>" +

                        "</article>"
                    );
                }
            )
            .join("");
}


/* =========================================================
   EDUCATION
   ========================================================= */

function zevCareerRenderEducation() {

    const container =
        zevCareerEl(
            "zev-career-education"
        );

    if (!zevCareerEducation.length) {

        container.innerHTML =
            zevCareerEmpty(
                "No education yet",
                "Add your academic background."
            );

        return;
    }

    container.innerHTML =
        zevCareerEducation
            .map(
                function (education) {

                    const dates =
                        zevCareerFormatDate(
                            education.start_date
                        ) +
                        " — " +
                        (
                            education.end_date
                                ? zevCareerFormatDate(
                                    education.end_date
                                )
                                : "Present"
                        );

                    return (
                        '<article class="zev-career-record">' +

                            '<span class="zev-career-record-label">' +
                                "EDUCATION" +
                            "</span>" +

                            "<h4>" +
                                zevCareerEscape(
                                    education.degree
                                ) +
                            "</h4>" +

                            '<div class="zev-career-record-subtitle">' +
                                zevCareerEscape(
                                    education.institution
                                ) +
                                " · " +
                                zevCareerEscape(
                                    education.field_of_study
                                ) +
                            "</div>" +

                            '<div class="zev-career-record-tags">' +
                                '<span class="zev-career-tag">' +
                                    zevCareerEscape(
                                        dates
                                    ) +
                                "</span>" +
                            "</div>" +

                            '<p class="zev-career-record-description">' +
                                zevCareerEscape(
                                    education.description ||
                                    ""
                                ) +
                            "</p>" +

                            '<div class="zev-career-record-actions">' +

                                '<button type="button" ' +
                                    'class="zev-career-btn zev-career-btn-secondary" ' +
                                    'data-career-edit="education" ' +
                                    'data-career-id="' +
                                    zevCareerEscape(
                                        education.id
                                    ) +
                                    '">' +
                                    "Edit" +
                                "</button>" +

                                '<button type="button" ' +
                                    'class="zev-career-btn zev-career-btn-danger" ' +
                                    'data-career-delete="education" ' +
                                    'data-career-id="' +
                                    zevCareerEscape(
                                        education.id
                                    ) +
                                    '">' +
                                    "Delete" +
                                "</button>" +

                            "</div>" +

                        "</article>"
                    );
                }
            )
            .join("");
}


/* =========================================================
   CERTIFICATES
   ========================================================= */

function zevCareerRenderCertificates() {

    const container =
        zevCareerEl(
            "zev-career-certificates"
        );

    if (!zevCareerCertificates.length) {

        container.innerHTML =
            zevCareerEmpty(
                "No certificates yet",
                "Add your certifications and achievements."
            );

        return;
    }

    container.innerHTML =
        zevCareerCertificates
            .map(
                function (certificate) {

                    return (
                        '<article class="zev-career-record">' +

                            '<span class="zev-career-record-label">' +
                                "CERTIFICATE" +
                            "</span>" +

                            "<h4>" +
                                zevCareerEscape(
                                    certificate.title
                                ) +
                            "</h4>" +

                            '<div class="zev-career-record-subtitle">' +
                                zevCareerEscape(
                                    certificate.issuer
                                ) +
                            "</div>" +

                            '<div class="zev-career-record-tags">' +

                                '<span class="zev-career-tag">' +
                                    zevCareerEscape(
                                        zevCareerFormatDate(
                                            certificate.issue_date
                                        )
                                    ) +
                                "</span>" +

                            "</div>" +

                            '<p class="zev-career-record-description">' +
                                zevCareerEscape(
                                    certificate.description ||
                                    ""
                                ) +
                            "</p>" +

                            '<div class="zev-career-record-actions">' +

                                '<button type="button" ' +
                                    'class="zev-career-btn zev-career-btn-secondary" ' +
                                    'data-career-edit="certificate" ' +
                                    'data-career-id="' +
                                    zevCareerEscape(
                                        certificate.id
                                    ) +
                                    '">' +
                                    "Edit" +
                                "</button>" +

                                '<button type="button" ' +
                                    'class="zev-career-btn zev-career-btn-danger" ' +
                                    'data-career-delete="certificate" ' +
                                    'data-career-id="' +
                                    zevCareerEscape(
                                        certificate.id
                                    ) +
                                    '">' +
                                    "Delete" +
                                "</button>" +

                            "</div>" +

                        "</article>"
                    );
                }
            )
            .join("");
}


/* =========================================================
   RENDER ALL
   ========================================================= */

function zevCareerRenderAll() {

    zevCareerPopulateProfile();

    zevCareerRenderStats();

    zevCareerRenderProjects();
    zevCareerRenderSkills();
    zevCareerRenderEducation();
    zevCareerRenderCertificates();
}


/* =========================================================
   RECORD LOOKUP
   ========================================================= */

function zevCareerFindRecord(
    type,
    id
) {

    let list = [];

    if (type === "project") {
        list =
            zevCareerProjects;
    }

    if (type === "skill") {
        list =
            zevCareerSkills;
    }

    if (type === "education") {
        list =
            zevCareerEducation;
    }

    if (type === "certificate") {
        list =
            zevCareerCertificates;
    }

    return list.find(
        function (item) {
            return item.id === id;
        }
    ) || null;
}


/* =========================================================
   MODAL FIELDS
   ========================================================= */

function zevCareerProjectFields(record) {

    const item =
        record || {};

    return (
        '<div class="zev-career-form-grid">' +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Project Title</label>" +
                '<input id="zev-modal-title" type="text" required value="' +
                    zevCareerEscape(
                        item.title || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Short Description</label>" +
                '<input id="zev-modal-short-description" type="text" value="' +
                    zevCareerEscape(
                        item.short_description ||
                        ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Description</label>" +
                '<textarea id="zev-modal-description" rows="5">' +
                    zevCareerEscape(
                        item.description || ""
                    ) +
                "</textarea>" +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Technologies</label>" +
                '<input id="zev-modal-technologies" type="text" placeholder="Python, FastAPI, JavaScript" value="' +
                    zevCareerEscape(
                        Array.isArray(
                            item.technologies
                        )
                            ? item.technologies.join(", ")
                            : ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Skills</label>" +
                '<input id="zev-modal-skills" type="text" placeholder="Backend, APIs" value="' +
                    zevCareerEscape(
                        Array.isArray(
                            item.skills
                        )
                            ? item.skills.join(", ")
                            : ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>GitHub URL</label>" +
                '<input id="zev-modal-github" type="url" value="' +
                    zevCareerEscape(
                        item.github_url || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Live URL</label>" +
                '<input id="zev-modal-live" type="url" value="' +
                    zevCareerEscape(
                        item.live_url || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Image URL</label>" +
                '<input id="zev-modal-image" type="url" value="' +
                    zevCareerEscape(
                        item.image_url || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Visibility</label>" +
                '<select id="zev-modal-visibility">' +
                    '<option value="private"' +
                        (
                            item.visibility === "private"
                                ? " selected"
                                : ""
                        ) +
                    ">Private</option>" +

                    '<option value="public"' +
                        (
                            item.visibility === "public"
                                ? " selected"
                                : ""
                        ) +
                    ">Public</option>" +
                "</select>" +
            "</div>" +

        "</div>"
    );
}


function zevCareerSkillFields(record) {

    const item =
        record || {};

    const proficiency =
        Number(
            item.proficiency || 3
        );

    return (
        '<div class="zev-career-form-grid">' +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Skill Name</label>" +
                '<input id="zev-modal-name" type="text" required value="' +
                    zevCareerEscape(
                        item.name || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Category</label>" +
                '<input id="zev-modal-category" type="text" required placeholder="Programming Language" value="' +
                    zevCareerEscape(
                        item.category || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Proficiency</label>" +
                '<select id="zev-modal-proficiency">' +

                    [1, 2, 3, 4, 5]
                        .map(
                            function (number) {

                                return (
                                    '<option value="' +
                                    number +
                                    '"' +
                                    (
                                        proficiency === number
                                            ? " selected"
                                            : ""
                                    ) +
                                    ">" +
                                    number +
                                    " / 5" +
                                    "</option>"
                                );
                            }
                        )
                        .join("") +

                "</select>" +
            "</div>" +

        "</div>"
    );
}


function zevCareerEducationFields(record) {

    const item =
        record || {};

    return (
        '<div class="zev-career-form-grid">' +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Institution</label>" +
                '<input id="zev-modal-institution" type="text" required value="' +
                    zevCareerEscape(
                        item.institution || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Degree</label>" +
                '<input id="zev-modal-degree" type="text" required value="' +
                    zevCareerEscape(
                        item.degree || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Field of Study</label>" +
                '<input id="zev-modal-field-study" type="text" required value="' +
                    zevCareerEscape(
                        item.field_of_study || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Start Date</label>" +
                '<input id="zev-modal-start-date" type="date" required value="' +
                    zevCareerEscape(
                        item.start_date || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>End Date</label>" +
                '<input id="zev-modal-end-date" type="date" value="' +
                    zevCareerEscape(
                        item.end_date || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Description</label>" +
                '<textarea id="zev-modal-description" rows="4">' +
                    zevCareerEscape(
                        item.description || ""
                    ) +
                "</textarea>" +
            "</div>" +

        "</div>"
    );
}


function zevCareerCertificateFields(record) {

    const item =
        record || {};

    return (
        '<div class="zev-career-form-grid">' +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Certificate Title</label>" +
                '<input id="zev-modal-title" type="text" required value="' +
                    zevCareerEscape(
                        item.title || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Issuer</label>" +
                '<input id="zev-modal-issuer" type="text" required value="' +
                    zevCareerEscape(
                        item.issuer || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Issue Date</label>" +
                '<input id="zev-modal-issue-date" type="date" required value="' +
                    zevCareerEscape(
                        item.issue_date || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Expiry Date</label>" +
                '<input id="zev-modal-expiry-date" type="date" value="' +
                    zevCareerEscape(
                        item.expiry_date || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Credential ID</label>" +
                '<input id="zev-modal-credential-id" type="text" value="' +
                    zevCareerEscape(
                        item.credential_id || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field">' +
                "<label>Credential URL</label>" +
                '<input id="zev-modal-credential-url" type="url" value="' +
                    zevCareerEscape(
                        item.credential_url || ""
                    ) +
                '">' +
            "</div>" +

            '<div class="zev-career-field zev-career-field-full">' +
                "<label>Description</label>" +
                '<textarea id="zev-modal-description" rows="4">' +
                    zevCareerEscape(
                        item.description || ""
                    ) +
                "</textarea>" +
            "</div>" +

        "</div>"
    );
}


/* =========================================================
   OPEN / CLOSE MODAL
   ========================================================= */

function zevCareerOpenModal(
    type,
    id
) {

    zevCareerModalType =
        type;

    zevCareerEditingId =
        id || null;

    const record =
        id
            ? zevCareerFindRecord(
                type,
                id
            )
            : null;

    const editing =
        Boolean(record);

    let label = "";
    let fields = "";

    if (type === "project") {
        label = "Project";
        fields =
            zevCareerProjectFields(
                record
            );
    }

    if (type === "skill") {
        label = "Skill";
        fields =
            zevCareerSkillFields(
                record
            );
    }

    if (type === "education") {
        label = "Education";
        fields =
            zevCareerEducationFields(
                record
            );
    }

    if (type === "certificate") {
        label = "Certificate";
        fields =
            zevCareerCertificateFields(
                record
            );
    }

    zevCareerEl(
        "zev-career-modal-title"
    ).textContent =
        editing
            ? "Edit " + label
            : "Add " + label;

    zevCareerEl(
        "zev-career-modal-fields"
    ).innerHTML =
        fields;

    zevCareerEl(
        "zev-career-modal-save"
    ).textContent =
        editing
            ? "Save Changes"
            : "Create " + label;

    zevCareerEl(
        "zev-career-modal"
    ).classList.add(
        "open"
    );

    document.body.style.overflow =
        "hidden";
}


function zevCareerCloseModal() {

    zevCareerEl(
        "zev-career-modal"
    ).classList.remove(
        "open"
    );

    document.body.style.overflow =
        "";

    zevCareerModalType = null;
    zevCareerEditingId = null;
}


/* =========================================================
   PAYLOADS
   ========================================================= */

function zevCareerBuildPayload(type) {

    if (type === "project") {

        return {
            title:
                zevCareerEl(
                    "zev-modal-title"
                ).value.trim(),

            short_description:
                zevCareerEl(
                    "zev-modal-short-description"
                ).value.trim(),

            description:
                zevCareerEl(
                    "zev-modal-description"
                ).value.trim(),

            technologies:
                zevCareerArray(
                    zevCareerEl(
                        "zev-modal-technologies"
                    ).value
                ),

            skills:
                zevCareerArray(
                    zevCareerEl(
                        "zev-modal-skills"
                    ).value
                ),

            github_url:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-github"
                    ).value
                ),

            live_url:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-live"
                    ).value
                ),

            image_url:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-image"
                    ).value
                ),

            visibility:
                zevCareerEl(
                    "zev-modal-visibility"
                ).value
        };
    }


    if (type === "skill") {

        return {
            name:
                zevCareerEl(
                    "zev-modal-name"
                ).value.trim(),

            category:
                zevCareerEl(
                    "zev-modal-category"
                ).value.trim(),

            proficiency:
                Number(
                    zevCareerEl(
                        "zev-modal-proficiency"
                    ).value
                )
        };
    }


    if (type === "education") {

        return {
            institution:
                zevCareerEl(
                    "zev-modal-institution"
                ).value.trim(),

            degree:
                zevCareerEl(
                    "zev-modal-degree"
                ).value.trim(),

            field_of_study:
                zevCareerEl(
                    "zev-modal-field-study"
                ).value.trim(),

            start_date:
                zevCareerEl(
                    "zev-modal-start-date"
                ).value,

            end_date:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-end-date"
                    ).value
                ),

            description:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-description"
                    ).value
                )
        };
    }


    if (type === "certificate") {

        return {
            title:
                zevCareerEl(
                    "zev-modal-title"
                ).value.trim(),

            issuer:
                zevCareerEl(
                    "zev-modal-issuer"
                ).value.trim(),

            issue_date:
                zevCareerEl(
                    "zev-modal-issue-date"
                ).value,

            expiry_date:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-expiry-date"
                    ).value
                ),

            credential_id:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-credential-id"
                    ).value
                ),

            credential_url:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-credential-url"
                    ).value
                ),

            description:
                zevCareerNullable(
                    zevCareerEl(
                        "zev-modal-description"
                    ).value
                )
        };
    }


    return {};
}


/* =========================================================
   ENDPOINTS
   ========================================================= */

function zevCareerEndpoint(type) {

    if (type === "project") {
        return "/projects";
    }

    if (type === "skill") {
        return "/career/skills";
    }

    if (type === "education") {
        return "/career/education";
    }

    if (type === "certificate") {
        return "/career/certificates";
    }

    return "";
}


/* =========================================================
   SAVE RECORD
   ========================================================= */

async function zevCareerSaveRecord(event) {

    event.preventDefault();

    if (!zevCareerModalType) {
        return;
    }

    const form =
        zevCareerEl(
            "zev-career-modal-form"
        );

    if (!form.reportValidity()) {
        return;
    }

    const button =
        zevCareerEl(
            "zev-career-modal-save"
        );

    button.disabled = true;
    button.textContent =
        "Saving...";

    try {

        const endpoint =
            zevCareerEndpoint(
                zevCareerModalType
            );

        const payload =
            zevCareerBuildPayload(
                zevCareerModalType
            );

        if (zevCareerEditingId) {

            await zevCareerRequest(
                endpoint +
                "/" +
                zevCareerEditingId,
                {
                    method: "PATCH",
                    body: payload
                }
            );

        } else {

            await zevCareerRequest(
                endpoint,
                {
                    method: "POST",
                    body: payload
                }
            );
        }

        const message =
            zevCareerEditingId
                ? "Record updated successfully."
                : "Record created successfully.";

        zevCareerCloseModal();

        await zevCareerRefreshRecords();

        zevCareerStatus(
            message,
            "success"
        );

    } catch (error) {

        zevCareerStatus(
            error.message,
            "error"
        );

    } finally {

        button.disabled = false;
    }
}


/* =========================================================
   DELETE RECORD
   ========================================================= */

async function zevCareerDeleteRecord(
    type,
    id
) {

    const record =
        zevCareerFindRecord(
            type,
            id
        );

    if (!record) {
        return;
    }

    const label =
        record.title ||
        record.name ||
        record.degree ||
        record.institution ||
        "this record";

    const confirmed =
        window.confirm(
            'Delete "' +
            label +
            '"?\n\n' +
            "This action cannot be undone."
        );

    if (!confirmed) {
        return;
    }

    try {

        const endpoint =
            zevCareerEndpoint(type);

        await zevCareerRequest(
            endpoint +
            "/" +
            id,
            {
                method: "DELETE"
            }
        );

        await zevCareerRefreshRecords();

        zevCareerStatus(
            "Record deleted successfully.",
            "success"
        );

    } catch (error) {

        zevCareerStatus(
            error.message,
            "error"
        );
    }
}


/* =========================================================
   REFRESH RECORDS
   ========================================================= */

async function zevCareerRefreshRecords() {

    const results =
        await Promise.all([
            zevCareerRequest(
                "/projects"
            ),
            zevCareerRequest(
                "/career/skills"
            ),
            zevCareerRequest(
                "/career/education"
            ),
            zevCareerRequest(
                "/career/certificates"
            )
        ]);

    zevCareerProjects =
        Array.isArray(results[0])
            ? results[0]
            : [];

    zevCareerSkills =
        Array.isArray(results[1])
            ? results[1]
            : [];

    zevCareerEducation =
        Array.isArray(results[2])
            ? results[2]
            : [];

    zevCareerCertificates =
        Array.isArray(results[3])
            ? results[3]
            : [];

    zevCareerRenderStats();

    zevCareerRenderProjects();
    zevCareerRenderSkills();
    zevCareerRenderEducation();
    zevCareerRenderCertificates();
}


/* =========================================================
   TABS
   ========================================================= */

function zevCareerActivateTab(name) {

    document
        .querySelectorAll(
            ".zev-career-tab"
        )
        .forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

                if (
                    button.dataset.careerTab ===
                    name
                ) {
                    button.classList.add(
                        "active"
                    );
                }
            }
        );

    document
        .querySelectorAll(
            ".zev-career-tab-content"
        )
        .forEach(
            function (panel) {

                panel.classList.remove(
                    "active"
                );
            }
        );

    const target =
        zevCareerEl(
            "zev-career-tab-" +
            name
        );

    if (target) {
        target.classList.add(
            "active"
        );
    }
}


/* =========================================================
   EVENTS
   ========================================================= */

function zevCareerSetupEvents() {

    zevCareerEl(
        "zev-career-save-profile"
    ).addEventListener(
        "click",
        zevCareerSaveProfile
    );


    [
        "zev-profile-full-name",
        "zev-profile-username",
        "zev-profile-location",
        "zev-profile-avatar"
    ].forEach(
        function (id) {

            zevCareerEl(id)
                .addEventListener(
                    "input",
                    zevCareerUpdateProfilePreview
                );
        }
    );


    zevCareerEl(
        "zev-career-avatar"
    ).addEventListener(
        "error",
        function () {

            this.style.display =
                "none";

            zevCareerEl(
                "zev-career-avatar-fallback"
            ).style.display =
                "flex";
        }
    );


    document
        .querySelectorAll(
            ".zev-career-tab"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        zevCareerActivateTab(
                            this.dataset.careerTab
                        );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-career-add]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        zevCareerOpenModal(
                            this.dataset.careerAdd
                        );
                    }
                );
            }
        );


    zevCareerEl(
        "zev-career-modal-form"
    ).addEventListener(
        "submit",
        zevCareerSaveRecord
    );


    zevCareerEl(
        "zev-career-modal-close"
    ).addEventListener(
        "click",
        zevCareerCloseModal
    );


    zevCareerEl(
        "zev-career-modal-cancel"
    ).addEventListener(
        "click",
        zevCareerCloseModal
    );


    document
        .querySelectorAll(
            "[data-career-close-modal]"
        )
        .forEach(
            function (element) {

                element.addEventListener(
                    "click",
                    zevCareerCloseModal
                );
            }
        );


    document.addEventListener(
        "click",
        function (event) {

            const editButton =
                event.target.closest(
                    "[data-career-edit]"
                );

            if (editButton) {

                zevCareerOpenModal(
                    editButton.dataset.careerEdit,
                    editButton.dataset.careerId
                );

                return;
            }


            const deleteButton =
                event.target.closest(
                    "[data-career-delete]"
                );

            if (deleteButton) {

                zevCareerDeleteRecord(
                    deleteButton.dataset.careerDelete,
                    deleteButton.dataset.careerId
                );
            }
        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                const modal =
                    zevCareerEl(
                        "zev-career-modal"
                    );

                if (
                    modal.classList.contains(
                        "open"
                    )
                ) {
                    zevCareerCloseModal();
                }
            }
        }
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

async function zevCareerInitialize() {

    const app =
        zevCareerEl(
            "zev-career-app"
        );

    if (!app) {
        return;
    }

    try {

        await zevCareerRequireSession();

        zevCareerSetupEvents();

        await zevCareerLoadAll();

        zevCareerRenderAll();

        zevCareerEl(
            "zev-career-loading"
        ).style.display =
            "none";

        zevCareerEl(
            "zev-career-content"
        ).style.display =
            "block";

    } catch (error) {

        zevCareerEl(
            "zev-career-loading"
        ).style.display =
            "none";

        zevCareerStatus(
            error.message,
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
            zevCareerInitialize();
        }
    );

} else {

    zevCareerInitialize();
}
