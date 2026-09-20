
const ZEV_PF_API =
    "https://zevqyn-backend.onrender.com/api/v1";

const ZEV_PF_SUPABASE_URL =
    "https://phjizxajnigiiawitkyx.supabase.co";

const ZEV_PF_SUPABASE_KEY =
    "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

let zevPfSupabase = null;
let zevPfSession = null;

let zevPfPortfolios = [];
let zevPfCurrentPortfolio = null;
let zevPfCurrentTab = "projects";

let zevPfSources = {
    projects: [],
    skills: [],
    education: [],
    certificates: []
};

let zevPfAttached = {
    projects: [],
    skills: [],
    education: [],
    certificates: []
};


function zevPfEl(id) {
    return document.getElementById(id);
}


async function zevPfRequireSession() {

    if (!window.supabase) {
        throw new Error(
            "Supabase client is not available."
        );
    }

    zevPfSupabase =
        window.supabase.createClient(
            ZEV_PF_SUPABASE_URL,
            ZEV_PF_SUPABASE_KEY
        );

    const result =
        await zevPfSupabase.auth
            .getSession();

    zevPfSession =
        result.data.session;

    if (!zevPfSession) {
        window.location.assign(
            "/login/"
        );

        throw new Error(
            "Authentication required."
        );
    }
}

async function zevPfRequest(
    path,
    options
) {
    const requestOptions =
        options || {};

   if (!zevPfSession) {
    await zevPfRequireSession();
}

const token =
    zevPfSession.access_token;

    if (!requestOptions.headers) {
        requestOptions.headers = {};
    }

    requestOptions.headers[
        "Content-Type"
    ] = "application/json";

    if (token) {
        requestOptions.headers[
            "Authorization"
        ] = "Bearer " + token;
    }

    const response =
        await fetch(
            ZEV_PF_API + path,
            requestOptions
        );

    let data = null;

    try {
        data = await response.json();
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
                    message = data.detail;
                } else {
                    message =
                        JSON.stringify(
                            data.detail
                        );
                }
            }
        }

        throw new Error(message);
    }

    return data;
}


function zevPfStatus(
    message,
    type
) {
    const status =
        zevPfEl("zevqyn-pf-status");

    status.textContent = message;
    status.className =
        "zev-pf-status " +
        (type || "");

    status.hidden = false;

    window.setTimeout(
        function () {
            status.hidden = true;
        },
        3500
    );
}


function zevPfValue(id) {
    const element = zevPfEl(id);

    if (!element) {
        return "";
    }

    return element.value.trim();
}


function zevPfSetValue(
    id,
    value
) {
    const element = zevPfEl(id);

    if (!element) {
        return;
    }

    element.value =
        value || "";
}


function zevPfSlugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9_-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}


function zevPfEscape(value) {
    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}


async function zevPfLoadPortfolios() {
    try {
        zevPfPortfolios =
            await zevPfRequest(
                "/portfolios",
                {
                    method: "GET"
                }
            );

        zevPfRenderSelector();

        if (zevPfPortfolios.length > 0) {
            await zevPfSelectPortfolio(
                zevPfPortfolios[0].id
            );
        } else {
            zevPfCurrentPortfolio = null;
            zevPfResetForm();
            zevPfUpdatePreview();
            zevPfRenderItems();
        }
    } catch (error) {
        zevPfStatus(
            error.message,
            "error"
        );

        zevPfEl(
            "zevqyn-pf-selector"
        ).innerHTML =
            '<option value="">' +
            "Unable to load portfolios" +
            "</option>";
    }
}


function zevPfRenderSelector() {
    const selector =
        zevPfEl(
            "zevqyn-pf-selector"
        );

    selector.innerHTML = "";

    if (zevPfPortfolios.length === 0) {
        const option =
            document.createElement(
                "option"
            );

        option.value = "";
        option.textContent =
            "No portfolios yet";

        selector.appendChild(option);
        return;
    }

    zevPfPortfolios.forEach(
        function (portfolio) {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                portfolio.id;

            option.textContent =
                portfolio.display_name +
                " — " +
                portfolio.slug;

            selector.appendChild(
                option
            );
        }
    );

    if (zevPfCurrentPortfolio) {
        selector.value =
            zevPfCurrentPortfolio.id;
    }
}


async function zevPfSelectPortfolio(
    portfolioId
) {
    if (!portfolioId) {
        return;
    }

    try {
        zevPfCurrentPortfolio =
            await zevPfRequest(
                "/portfolios/" +
                portfolioId,
                {
                    method: "GET"
                }
            );

        zevPfPopulateForm();
        zevPfRenderSelector();

        await zevPfLoadAllContent();

        zevPfUpdatePreview();
        zevPfRenderItems();
    } catch (error) {
        zevPfStatus(
            error.message,
            "error"
        );
    }
}


function zevPfPopulateForm() {
    const p =
        zevPfCurrentPortfolio;

    if (!p) {
        return;
    }

    zevPfSetValue(
        "zevqyn-pf-name",
        p.display_name
    );

    zevPfSetValue(
        "zevqyn-pf-headline",
        p.headline
    );

    zevPfSetValue(
        "zevqyn-pf-slug",
        p.slug
    );

    zevPfSetValue(
        "zevqyn-pf-about",
        p.about
    );

    zevPfSetValue(
        "zevqyn-pf-image",
        p.profile_image_url
    );

    zevPfSetValue(
        "zevqyn-pf-github",
        p.github_url
    );

    zevPfSetValue(
        "zevqyn-pf-linkedin",
        p.linkedin_url
    );

    zevPfSetValue(
        "zevqyn-pf-website",
        p.website_url
    );

    zevPfEl(
        "zevqyn-pf-published"
    ).checked =
        Boolean(p.is_published);

    zevPfEl(
        "zevqyn-pf-contact"
    ).checked =
        Boolean(p.show_contact);

    zevPfEl(
        "zevqyn-pf-certificates-toggle"
    ).checked =
        Boolean(p.show_certificates);

    zevPfUpdatePublishState();
}


function zevPfResetForm() {
    const fields = [
        "zevqyn-pf-name",
        "zevqyn-pf-headline",
        "zevqyn-pf-slug",
        "zevqyn-pf-about",
        "zevqyn-pf-image",
        "zevqyn-pf-github",
        "zevqyn-pf-linkedin",
        "zevqyn-pf-website"
    ];

    fields.forEach(
        function (id) {
            zevPfSetValue(id, "");
        }
    );

    zevPfEl(
        "zevqyn-pf-published"
    ).checked = false;

    zevPfEl(
        "zevqyn-pf-contact"
    ).checked = false;

    zevPfEl(
        "zevqyn-pf-certificates-toggle"
    ).checked = false;

    zevPfUpdatePublishState();
}


function zevPfUpdatePublishState() {
    const badge =
        zevPfEl(
            "zevqyn-pf-publish-badge"
        );

    const publicButton =
        zevPfEl(
            "zevqyn-pf-open-public"
        );

    const published =
        zevPfEl(
            "zevqyn-pf-published"
        ).checked;

    if (published) {
        badge.textContent = "Published";
        badge.className =
            "zev-pf-badge " +
            "zev-pf-badge-live";

        if (zevPfCurrentPortfolio) {
            publicButton.hidden = false;
        }
    } else {
        badge.textContent = "Draft";
        badge.className =
            "zev-pf-badge " +
            "zev-pf-badge-draft";

        publicButton.hidden = true;
    }
}


async function zevPfLoadAllContent() {
    if (!zevPfCurrentPortfolio) {
        return;
    }

    const id =
        zevPfCurrentPortfolio.id;

    try {
        const results =
            await Promise.all([
                zevPfRequest(
                    "/projects",
                    {method: "GET"}
                ),
                zevPfRequest(
                    "/career/skills",
                    {method: "GET"}
                ),
                zevPfRequest(
                    "/career/education",
                    {method: "GET"}
                ),
                zevPfRequest(
                    "/career/certificates",
                    {method: "GET"}
                ),
                zevPfRequest(
                    "/portfolios/" +
                    id +
                    "/projects",
                    {method: "GET"}
                ),
                zevPfRequest(
                    "/portfolios/" +
                    id +
                    "/skills",
                    {method: "GET"}
                ),
                zevPfRequest(
                    "/portfolios/" +
                    id +
                    "/education",
                    {method: "GET"}
                ),
                zevPfRequest(
                    "/portfolios/" +
                    id +
                    "/certificates",
                    {method: "GET"}
                )
            ]);

        zevPfSources.projects =
            results[0] || [];

        zevPfSources.skills =
            results[1] || [];

        zevPfSources.education =
            results[2] || [];

        zevPfSources.certificates =
            results[3] || [];

        zevPfAttached.projects =
            results[4] || [];

        zevPfAttached.skills =
            results[5] || [];

        zevPfAttached.education =
            results[6] || [];

        zevPfAttached.certificates =
            results[7] || [];
    } catch (error) {
        zevPfStatus(
            error.message,
            "error"
        );
    }
}


function zevPfSourceId(
    type,
    item
) {
    if (type === "projects") {
        return item.id;
    }

    if (type === "skills") {
        return item.id;
    }

    if (type === "education") {
        return item.id;
    }

    return item.id;
}


function zevPfAttachedSourceId(
    type,
    item
) {
    if (type === "projects") {
        return item.project_id;
    }

    if (type === "skills") {
        return item.skill_id;
    }

    if (type === "education") {
        return item.education_id;
    }

    return item.certificate_id;
}


function zevPfIsAttached(
    type,
    sourceId
) {
    const list =
        zevPfAttached[type] || [];

    for (
        let i = 0;
        i < list.length;
        i += 1
    ) {
        if (
            zevPfAttachedSourceId(
                type,
                list[i]
            ) === sourceId
        ) {
            return true;
        }
    }

    return false;
}


function zevPfItemTitle(
    type,
    item
) {
    if (type === "projects") {
        return item.title ||
            "Untitled Project";
    }

    if (type === "skills") {
        return item.name ||
            "Unnamed Skill";
    }

    if (type === "education") {
        return item.institution ||
            "Education";
    }

    return item.title ||
        "Certificate";
}


function zevPfItemSubtitle(
    type,
    item
) {
    if (type === "projects") {
        return item.short_description ||
            item.description ||
            "Project";
    }

    if (type === "skills") {
        return item.category ||
            "Skill";
    }

    if (type === "education") {
        let text =
            item.degree || "";

        if (item.field_of_study) {
            if (text) {
                text +=
                    " · " +
                    item.field_of_study;
            } else {
                text =
                    item.field_of_study;
            }
        }

        return text ||
            "Education";
    }

    return item.issuer ||
        "Certificate";
}


function zevPfRenderItems() {
    const container =
        zevPfEl(
            "zevqyn-pf-items"
        );

    container.innerHTML = "";

    if (!zevPfCurrentPortfolio) {
        container.innerHTML =
            '<div class="zev-pf-empty">' +
            "Create or select a portfolio first." +
            "</div>";

        return;
    }

    const source =
        zevPfSources[
            zevPfCurrentTab
        ] || [];

    if (source.length === 0) {
        container.innerHTML =
            '<div class="zev-pf-empty">' +
            "No saved " +
            zevPfCurrentTab +
            " found in your ZEVQYN account." +
            "</div>";

        return;
    }

    source.forEach(
        function (item) {
            const sourceId =
                zevPfSourceId(
                    zevPfCurrentTab,
                    item
                );

            const attached =
                zevPfIsAttached(
                    zevPfCurrentTab,
                    sourceId
                );

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "zev-pf-item";

            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "zev-pf-item-info";

            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                zevPfItemTitle(
                    zevPfCurrentTab,
                    item
                );

            const subtitle =
                document.createElement(
                    "span"
                );

            subtitle.textContent =
                zevPfItemSubtitle(
                    zevPfCurrentTab,
                    item
                );

            info.appendChild(title);
            info.appendChild(subtitle);

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "zev-pf-item-action";

            if (attached) {
                button.className +=
                    " attached";

                button.textContent =
                    "Remove";
            } else {
                button.textContent =
                    "Add";
            }

            button.addEventListener(
                "click",
                function () {
                    zevPfToggleAttachment(
                        zevPfCurrentTab,
                        sourceId,
                        attached,
                        button
                    );
                }
            );

            row.appendChild(info);
            row.appendChild(button);

            container.appendChild(row);
        }
    );
}


function zevPfEndpointName(type) {
    if (type === "projects") {
        return "projects";
    }

    if (type === "skills") {
        return "skills";
    }

    if (type === "education") {
        return "education";
    }

    return "certificates";
}


function zevPfRequestKey(type) {
    if (type === "projects") {
        return "project_id";
    }

    if (type === "skills") {
        return "skill_id";
    }

    if (type === "education") {
        return "education_id";
    }

    return "certificate_id";
}


async function zevPfToggleAttachment(
    type,
    sourceId,
    attached,
    button
) {
    if (!zevPfCurrentPortfolio) {
        return;
    }

    button.disabled = true;

    const endpoint =
        zevPfEndpointName(type);

    const portfolioId =
        zevPfCurrentPortfolio.id;

    try {
        if (attached) {
            await zevPfRequest(
                "/portfolios/" +
                portfolioId +
                "/" +
                endpoint +
                "/" +
                sourceId,
                {
                    method: "DELETE"
                }
            );

            zevPfStatus(
                "Removed from portfolio.",
                "success"
            );
        } else {
            const payload = {
                sort_order: 0
            };

            payload[
                zevPfRequestKey(type)
            ] = sourceId;

            await zevPfRequest(
                "/portfolios/" +
                portfolioId +
                "/" +
                endpoint,
                {
                    method: "POST",
                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

            zevPfStatus(
                "Added to portfolio.",
                "success"
            );
        }

     zevPfAttached[type] =
    await zevPfRequest(
        "/portfolios/" +
        portfolioId +
        "/" +
        endpoint,
        {
            method: "GET"
        }
    );

zevPfRenderItems();
zevPfUpdatePreview();
    } catch (error) {
        zevPfStatus(
            error.message,
            "error"
        );

        button.disabled = false;
    }
}


function zevPfGetAttachedSources(
    type
) {
    const source =
        zevPfSources[type] || [];

    return source.filter(
        function (item) {
            return zevPfIsAttached(
                type,
                item.id
            );
        }
    );
}


function zevPfPreviewSection(
    title
) {
    const section =
        document.createElement(
            "div"
        );

    section.className =
        "zev-pf-preview-section";

    const kicker =
        document.createElement(
            "span"
        );

    kicker.className =
        "zev-pf-preview-kicker";

    kicker.textContent =
        title.toUpperCase();

    section.appendChild(kicker);

    return section;
}


function zevPfUpdatePreview() {
    const name =
        zevPfValue(
            "zevqyn-pf-name"
        ) || "Your Name";

    const headline =
        zevPfValue(
            "zevqyn-pf-headline"
        ) ||
        "Your professional headline";

    const about =
        zevPfValue(
            "zevqyn-pf-about"
        ) ||
        "Tell visitors about yourself, your experience and what you are building.";

    zevPfEl(
        "zevqyn-pf-preview-name"
    ).textContent = name;

    zevPfEl(
        "zevqyn-pf-preview-headline"
    ).textContent = headline;

    zevPfEl(
        "zevqyn-pf-preview-about"
    ).textContent = about;

    zevPfUpdateAvatar();
    zevPfUpdatePreviewLinks();
    zevPfUpdatePreviewContent();
    zevPfUpdatePublishState();
}


function zevPfUpdateAvatar() {
    const avatar =
        zevPfEl(
            "zevqyn-pf-preview-avatar"
        );

    const image =
        zevPfValue(
            "zevqyn-pf-image"
        );

    const name =
        zevPfValue(
            "zevqyn-pf-name"
        );

    avatar.innerHTML = "";

    if (image) {
        const img =
            document.createElement(
                "img"
            );

        img.src = image;
        img.alt =
            name || "Profile";

        avatar.appendChild(img);
        return;
    }

    avatar.textContent =
        name
            ? name.charAt(0).toUpperCase()
            : "Z";
}


function zevPfUpdatePreviewLinks() {
    const container =
        zevPfEl(
            "zevqyn-pf-preview-links"
        );

    container.innerHTML = "";

    if (
        !zevPfEl(
            "zevqyn-pf-contact"
        ).checked
    ) {
        return;
    }

    const links = [
        {
            label: "GitHub",
            url:
                zevPfValue(
                    "zevqyn-pf-github"
                )
        },
        {
            label: "LinkedIn",
            url:
                zevPfValue(
                    "zevqyn-pf-linkedin"
                )
        },
        {
            label: "Website",
            url:
                zevPfValue(
                    "zevqyn-pf-website"
                )
        }
    ];

    links.forEach(
        function (link) {
            if (!link.url) {
                return;
            }

            const anchor =
                document.createElement(
                    "a"
                );

            anchor.href = link.url;
            anchor.target = "_blank";
            anchor.rel =
                "noopener noreferrer";

            anchor.textContent =
                link.label;

            container.appendChild(
                anchor
            );
        }
    );
}


function zevPfUpdatePreviewContent() {
    const container =
        zevPfEl(
            "zevqyn-pf-preview-content"
        );

    container.innerHTML = "";

    const projects =
        zevPfGetAttachedSources(
            "projects"
        );

    const skills =
        zevPfGetAttachedSources(
            "skills"
        );

    const education =
        zevPfGetAttachedSources(
            "education"
        );

    let certificates = [];

    if (
        zevPfEl(
            "zevqyn-pf-certificates-toggle"
        ).checked
    ) {
        certificates =
            zevPfGetAttachedSources(
                "certificates"
            );
    }

    if (projects.length > 0) {
        const section =
            zevPfPreviewSection(
                "Projects"
            );

        projects.forEach(
            function (project) {
                const record =
                    document.createElement(
                        "div"
                    );

                record.className =
                    "zev-pf-preview-record";

                const title =
                    document.createElement(
                        "strong"
                    );

                title.textContent =
                    project.title ||
                    "Project";

                record.appendChild(title);

                const description =
                    document.createElement(
                        "span"
                    );

                description.textContent =
                    project.short_description ||
                    project.description ||
                    "";

                record.appendChild(
                    description
                );

                section.appendChild(
                    record
                );
            }
        );

        container.appendChild(section);
    }

    if (skills.length > 0) {
        const section =
            zevPfPreviewSection(
                "Skills"
            );

        const tags =
            document.createElement(
                "div"
            );

        tags.className =
            "zev-pf-preview-tags";

        skills.forEach(
            function (skill) {
                const tag =
                    document.createElement(
                        "span"
                    );

                tag.className =
                    "zev-pf-preview-tag";

                tag.textContent =
                    skill.name ||
                    "Skill";

                tags.appendChild(tag);
            }
        );

        section.appendChild(tags);
        container.appendChild(section);
    }

    if (education.length > 0) {
        const section =
            zevPfPreviewSection(
                "Education"
            );

        education.forEach(
            function (item) {
                const record =
                    document.createElement(
                        "div"
                    );

                record.className =
                    "zev-pf-preview-record";

                const title =
                    document.createElement(
                        "strong"
                    );

                title.textContent =
                    item.institution ||
                    "Education";

                const subtitle =
                    document.createElement(
                        "span"
                    );

                let text =
                    item.degree || "";

                if (item.field_of_study) {
                    if (text) {
                        text +=
                            " · " +
                            item.field_of_study;
                    } else {
                        text =
                            item.field_of_study;
                    }
                }

                subtitle.textContent =
                    text;

                record.appendChild(title);
                record.appendChild(
                    subtitle
                );

                section.appendChild(
                    record
                );
            }
        );

        container.appendChild(section);
    }

    if (certificates.length > 0) {
        const section =
            zevPfPreviewSection(
                "Certificates"
            );

        certificates.forEach(
            function (item) {
                const record =
                    document.createElement(
                        "div"
                    );

                record.className =
                    "zev-pf-preview-record";

                const title =
                    document.createElement(
                        "strong"
                    );

                title.textContent =
                    item.title ||
                    "Certificate";

                const subtitle =
                    document.createElement(
                        "span"
                    );

                subtitle.textContent =
                    item.issuer || "";

                record.appendChild(title);
                record.appendChild(
                    subtitle
                );

                section.appendChild(
                    record
                );
            }
        );

        container.appendChild(section);
    }
}


async function zevPfSavePortfolio() {
    if (!zevPfCurrentPortfolio) {
        zevPfStatus(
            "Create a portfolio first.",
            "error"
        );
        return;
    }

    const slug =
        zevPfSlugify(
            zevPfValue(
                "zevqyn-pf-slug"
            )
        );

    const displayName =
        zevPfValue(
            "zevqyn-pf-name"
        );

    if (!displayName) {
        zevPfStatus(
            "Display name is required.",
            "error"
        );
        return;
    }

    if (slug.length < 3) {
        zevPfStatus(
            "Portfolio slug must be at least 3 characters.",
            "error"
        );
        return;
    }

    const payload = {
        display_name:
            displayName,

        slug:
            slug,

        headline:
            zevPfValue(
                "zevqyn-pf-headline"
            ) || null,

        about:
            zevPfValue(
                "zevqyn-pf-about"
            ) || null,

        profile_image_url:
            zevPfValue(
                "zevqyn-pf-image"
            ) || null,

        github_url:
            zevPfValue(
                "zevqyn-pf-github"
            ) || null,

        linkedin_url:
            zevPfValue(
                "zevqyn-pf-linkedin"
            ) || null,

        website_url:
            zevPfValue(
                "zevqyn-pf-website"
            ) || null,

        is_published:
            zevPfEl(
                "zevqyn-pf-published"
            ).checked,

        show_contact:
            zevPfEl(
                "zevqyn-pf-contact"
            ).checked,

        show_certificates:
            zevPfEl(
                "zevqyn-pf-certificates-toggle"
            ).checked
    };

    const button =
        zevPfEl(
            "zevqyn-pf-save"
        );

    button.disabled = true;
    button.textContent = "Saving...";

    try {
        zevPfCurrentPortfolio =
            await zevPfRequest(
                "/portfolios/" +
                zevPfCurrentPortfolio.id,
                {
                    method: "PATCH",
                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        const index =
            zevPfPortfolios.findIndex(
                function (portfolio) {
                    return (
                        portfolio.id ===
                        zevPfCurrentPortfolio.id
                    );
                }
            );

        if (index !== -1) {
            zevPfPortfolios[index] =
                zevPfCurrentPortfolio;
        }

        zevPfSetValue(
            "zevqyn-pf-slug",
            zevPfCurrentPortfolio.slug
        );

        zevPfRenderSelector();
        zevPfUpdatePublishState();
        zevPfUpdatePreview();

        zevPfStatus(
            "Portfolio saved successfully.",
            "success"
        );
    } catch (error) {
        zevPfStatus(
            error.message,
            "error"
        );
    }

    button.disabled = false;
    button.textContent =
        "Save Portfolio";
}


function zevPfOpenModal() {
    zevPfEl(
        "zevqyn-pf-create-name"
    ).value = "";

    zevPfEl(
        "zevqyn-pf-create-slug"
    ).value = "";

    zevPfEl(
        "zevqyn-pf-modal"
    ).hidden = false;

    zevPfEl(
        "zevqyn-pf-create-name"
    ).focus();
}


function zevPfCloseModal() {
    zevPfEl(
        "zevqyn-pf-modal"
    ).hidden = true;
}


async function zevPfCreatePortfolio() {
    const displayName =
        zevPfValue(
            "zevqyn-pf-create-name"
        );

    const slug =
        zevPfSlugify(
            zevPfValue(
                "zevqyn-pf-create-slug"
            )
        );

    if (!displayName) {
        zevPfStatus(
            "Enter a display name.",
            "error"
        );
        return;
    }

    if (slug.length < 3) {
        zevPfStatus(
            "Slug must be at least 3 characters.",
            "error"
        );
        return;
    }

    const button =
        zevPfEl(
            "zevqyn-pf-create"
        );

    button.disabled = true;
    button.textContent = "Creating...";

    try {
        const portfolio =
            await zevPfRequest(
                "/portfolios",
                {
                    method: "POST",
                    body:
                        JSON.stringify({
                            slug: slug,
                            display_name:
                                displayName,
                            theme: "light",
                            is_published:
                                false,
                            show_resume:
                                false,
                            show_research:
                                false,
                            show_certificates:
                                false,
                            show_contact:
                                false
                        })
                }
            );

        zevPfPortfolios.unshift(
            portfolio
        );

        zevPfCloseModal();

        await zevPfSelectPortfolio(
            portfolio.id
        );

        zevPfStatus(
            "Portfolio created successfully.",
            "success"
        );
    } catch (error) {
        zevPfStatus(
            error.message,
            "error"
        );
    }

    button.disabled = false;
    button.textContent =
        "Create Portfolio";
}


function zevPfSetupTabs() {
    const tabs =
        document.querySelectorAll(
            "#zevqyn-portfolio-app " +
            ".zev-pf-tab"
        );

    tabs.forEach(
        function (tab) {
            tab.addEventListener(
                "click",
                function () {
                    tabs.forEach(
                        function (other) {
                            other.classList
                                .remove(
                                    "active"
                                );
                        }
                    );

                    tab.classList.add(
                        "active"
                    );

                    zevPfCurrentTab =
                        tab.getAttribute(
                            "data-pf-tab"
                        );

                    zevPfRenderItems();
                }
            );
        }
    );
}


function zevPfSetupLivePreview() {
    const ids = [
        "zevqyn-pf-name",
        "zevqyn-pf-headline",
        "zevqyn-pf-about",
        "zevqyn-pf-image",
        "zevqyn-pf-github",
        "zevqyn-pf-linkedin",
        "zevqyn-pf-website"
    ];

    ids.forEach(
        function (id) {
            zevPfEl(id)
                .addEventListener(
                    "input",
                    zevPfUpdatePreview
                );
        }
    );

    const toggles = [
        "zevqyn-pf-published",
        "zevqyn-pf-contact",
        "zevqyn-pf-certificates-toggle"
    ];

    toggles.forEach(
        function (id) {
            zevPfEl(id)
                .addEventListener(
                    "change",
                    zevPfUpdatePreview
                );
        }
    );
}

async function zevPfDeletePortfolio() {
    if (!zevPfCurrentPortfolio) {
        return;
    }

    const portfolioId =
        zevPfCurrentPortfolio.id;

    const portfolioName =
        zevPfCurrentPortfolio.display_name ||
        zevPfCurrentPortfolio.slug;

    const confirmed =
        window.confirm(
            'Delete "' +
            portfolioName +
            '"?\n\n' +
            "This action cannot be undone."
        );

    if (!confirmed) {
        return;
    }

    const button =
        zevPfEl(
            "zevqyn-pf-delete"
        );

    button.disabled = true;
    button.textContent =
        "Deleting...";

    try {
        await zevPfRequest(
            "/portfolios/" +
            portfolioId,
            {
                method: "DELETE"
            }
        );

        zevPfCurrentPortfolio = null;

        zevPfStatus(
            "Portfolio deleted successfully.",
            "success"
        );

        await zevPfLoadPortfolios();
    } catch (error) {
        zevPfStatus(
            error.message,
            "error"
        );
    } finally {
        button.disabled = false;
        button.textContent =
            "Delete Portfolio";
    }
}

function zevPfSetupEvents() {
    zevPfEl(
        "zevqyn-pf-new"
    ).addEventListener(
        "click",
        zevPfOpenModal
    );

zevPfEl(
    "zevqyn-pf-delete"
).addEventListener(
    "click",
    zevPfDeletePortfolio
);

    zevPfEl(
        "zevqyn-pf-modal-close"
    ).addEventListener(
        "click",
        zevPfCloseModal
    );

    zevPfEl(
        "zevqyn-pf-modal"
    ).querySelector(
        ".zev-pf-modal-backdrop"
    ).addEventListener(
        "click",
        zevPfCloseModal
    );

    zevPfEl(
        "zevqyn-pf-create"
    ).addEventListener(
        "click",
        zevPfCreatePortfolio
    );

    zevPfEl(
        "zevqyn-pf-save"
    ).addEventListener(
        "click",
        zevPfSavePortfolio
    );

    zevPfEl(
        "zevqyn-pf-selector"
    ).addEventListener(
        "change",
        function (event) {
            zevPfSelectPortfolio(
                event.target.value
            );
        }
    );

    zevPfEl(
        "zevqyn-pf-create-name"
    ).addEventListener(
        "input",
        function () {
            const slugInput =
                zevPfEl(
                    "zevqyn-pf-create-slug"
                );

            if (!slugInput.value) {
                slugInput.value =
                    zevPfSlugify(
                        zevPfValue(
                            "zevqyn-pf-create-name"
                        )
                    );
            }
        }
    );

    zevPfEl(
        "zevqyn-pf-slug"
    ).addEventListener(
        "blur",
        function () {
            this.value =
                zevPfSlugify(
                    this.value
                );
        }
    );

    zevPfEl(
        "zevqyn-pf-create-slug"
    ).addEventListener(
        "blur",
        function () {
            this.value =
                zevPfSlugify(
                    this.value
                );
        }
    );

    zevPfEl(
        "zevqyn-pf-open-public"
    ).addEventListener(
        "click",
        function () {
            if (!zevPfCurrentPortfolio) {
                return;
            }

            const slug =
                zevPfCurrentPortfolio.slug;

            window.open(
    "/p/?slug=" +
    encodeURIComponent(slug),
    "_blank"
);
        }
    );

    zevPfSetupTabs();
    zevPfSetupLivePreview();
}


async function zevPfInitialize() {
    const app =
        zevPfEl(
            "zevqyn-portfolio-app"
        );

    if (!app) {
        return;
    }

   zevPfSetupEvents();
zevPfUpdatePreview();

try {
    await zevPfRequireSession();
    await zevPfLoadPortfolios();
} catch (error) {
    zevPfStatus(
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
            zevPfInitialize();
        }
    );
} else {
    zevPfInitialize();
}
