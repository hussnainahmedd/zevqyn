
const ZPP_API =
    "https://zevqyn-backend.onrender.com/api/v1";

function zppEl(id) {
    return document.getElementById(id);
}

function zppEscape(value) {
    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}

function zppUrl(value) {
    if (!value) {
        return "";
    }

    try {
        const url =
            new URL(value);

        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {
            return url.href;
        }
    } catch (error) {
        return "";
    }

    return "";
}

function zppGetSlug() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    const querySlug =
        params.get("slug");

    if (querySlug) {
        return querySlug
            .trim()
            .toLowerCase();
    }

    const parts =
        window.location.pathname
            .split("/")
            .filter(
                function (part) {
                    return Boolean(part);
                }
            );

    const pIndex =
        parts.indexOf("p");

    if (pIndex === -1) {
        return "";
    }

    if (
        parts.length <=
        pIndex + 1
    ) {
        return "";
    }

    return decodeURIComponent(
        parts[pIndex + 1]
    )
        .trim()
        .toLowerCase();
}

function zppInitials(name) {
    const words =
        String(name || "Z")
            .trim()
            .split(/\s+/);

    let result = "";

    words
        .slice(0, 2)
        .forEach(
            function (word) {
                if (word) {
                    result +=
                        word.charAt(0);
                }
            }
        );

    return result || "Z";
}

function zppFormatDate(value) {
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

function zppSocialLink(
    label,
    url
) {
    const safeUrl =
        zppUrl(url);

    if (!safeUrl) {
        return "";
    }

    return (
        '<a class="zpp-social-btn" ' +
        'href="' +
        zppEscape(safeUrl) +
        '" target="_blank" ' +
        'rel="noopener noreferrer">' +
        zppEscape(label) +
        " ↗</a>"
    );
}

function zppRenderHero(data) {
    const name =
        data.display_name ||
        "ZEVQYN Creator";

    zppEl("zpp-name").textContent =
        name;

    zppEl("zpp-headline").textContent =
        data.headline ||
        "Creative Developer";

    zppEl("zpp-hero-about").textContent =
        data.about ||
        "Building ideas into digital experiences.";

    zppEl("zpp-footer-name").textContent =
        name;

    document.title =
        name + " — Portfolio";

    const avatar =
        zppEl("zpp-avatar");

    const image =
        zppUrl(
            data.profile_image_url
        );

    if (image) {
        const img =
            document.createElement(
                "img"
            );

        img.src = image;
        img.alt = name;

        img.addEventListener(
            "error",
            function () {
                avatar.innerHTML = "";
                avatar.textContent =
                    zppInitials(name);
            }
        );

        avatar.innerHTML = "";
        avatar.appendChild(img);
    } else {
        avatar.textContent =
            zppInitials(name);
    }

    let socials = "";

    socials +=
        zppSocialLink(
            "GitHub",
            data.github_url
        );

    socials +=
        zppSocialLink(
            "LinkedIn",
            data.linkedin_url
        );

    socials +=
        zppSocialLink(
            "Website",
            data.website_url
        );

    zppEl("zpp-socials").innerHTML =
        socials;

    zppEl(
        "zpp-footer-socials"
    ).innerHTML =
        socials;
}

function zppRenderAbout(data) {
    const about =
        data.about ||
        "This creator hasn't added an introduction yet.";

    zppEl(
        "zpp-about-text"
    ).textContent =
        about;
}

function zppRenderProjects(data) {
    const projects =
        Array.isArray(data.projects)
            ? data.projects
            : [];

    const grid =
        zppEl(
            "zpp-project-grid"
        );

    if (!projects.length) {
        zppEl(
            "zpp-projects"
        ).hidden = true;

        return;
    }

    let html = "";

    projects.forEach(
        function (project, index) {
            const technologies =
                Array.isArray(
                    project.technologies
                )
                    ? project.technologies
                    : [];

            let techHtml = "";

            technologies.forEach(
                function (technology) {
                    techHtml +=
                        '<span class="zpp-tech">' +
                        zppEscape(
                            technology
                        ) +
                        "</span>";
                }
            );

            let links = "";

            const github =
                zppUrl(
                    project.github_url
                );

            const live =
                zppUrl(
                    project.live_url
                );

            if (github) {
                links +=
                    '<a class="zpp-project-link" ' +
                    'href="' +
                    zppEscape(github) +
                    '" target="_blank" ' +
                    'rel="noopener noreferrer">' +
                    "GitHub ↗</a>";
            }

            if (live) {
                links +=
                    '<a class="zpp-project-link" ' +
                    'href="' +
                    zppEscape(live) +
                    '" target="_blank" ' +
                    'rel="noopener noreferrer">' +
                    "Live project ↗</a>";
            }

            const description =
                project.short_description ||
                project.description ||
                "A project built with curiosity and code.";

            html +=
                '<article class="zpp-project-card zpp-reveal">' +
                    '<span class="zpp-project-index">' +
                        "PROJECT / " +
                        String(index + 1)
                            .padStart(2, "0") +
                    "</span>" +

                    "<h3>" +
                        zppEscape(
                            project.title ||
                            "Untitled Project"
                        ) +
                    "</h3>" +

                    "<p>" +
                        zppEscape(
                            description
                        ) +
                    "</p>" +

                    '<div class="zpp-project-tech">' +
                        techHtml +
                    "</div>" +

                    '<div class="zpp-project-actions">' +
                        links +
                    "</div>" +
                "</article>";
        }
    );

    grid.innerHTML = html;
}

function zppRenderSkills(data) {
    const skills =
        Array.isArray(data.skills)
            ? data.skills
            : [];

    if (!skills.length) {
        zppEl(
            "zpp-skills"
        ).hidden = true;

        return;
    }

    let html = "";

    skills.forEach(
        function (skill) {
            html +=
                '<span class="zpp-skill zpp-reveal">' +
                    zppEscape(
                        skill.name ||
                        "Skill"
                    ) +
                "</span>";
        }
    );

    zppEl(
        "zpp-skill-cloud"
    ).innerHTML = html;
}

function zppRenderEducation(data) {
    const education =
        Array.isArray(
            data.education
        )
            ? data.education
            : [];

    if (!education.length) {
        zppEl(
            "zpp-education"
        ).hidden = true;

        return;
    }

    let html = "";

    education.forEach(
        function (item) {
            const start =
                zppFormatDate(
                    item.start_date
                );

            const end =
                item.end_date
                    ? zppFormatDate(
                        item.end_date
                    )
                    : "Present";

            let dates = "";

            if (start) {
                dates =
                    start +
                    " — " +
                    end;
            }

            const study =
                [
                    item.degree,
                    item.field_of_study
                ]
                    .filter(
                        function (value) {
                            return Boolean(
                                value
                            );
                        }
                    )
                    .join(" · ");

            html +=
                '<div class="zpp-timeline-item zpp-reveal">' +
                    '<span class="zpp-timeline-dot"></span>' +

                    '<span class="zpp-timeline-date">' +
                        zppEscape(dates) +
                    "</span>" +

                    "<h3>" +
                        zppEscape(
                            item.institution ||
                            "Education"
                        ) +
                    "</h3>" +

                    "<strong>" +
                        zppEscape(study) +
                    "</strong>" +

                    (
                        item.description
                            ? "<p>" +
                                zppEscape(
                                    item.description
                                ) +
                              "</p>"
                            : ""
                    ) +
                "</div>";
        }
    );

    zppEl(
        "zpp-education-list"
    ).innerHTML = html;
}

function zppRenderCertificates(
    data
) {
    const certificates =
        Array.isArray(
            data.certificates
        )
            ? data.certificates
            : [];

    const section =
        zppEl(
            "zpp-certificates"
        );

    if (!certificates.length) {
        section.hidden = true;
        return;
    }

    section.hidden = false;

    let html = "";

    certificates.forEach(
        function (certificate) {
            const date =
                zppFormatDate(
                    certificate.issue_date
                );

            const credential =
                zppUrl(
                    certificate.credential_url
                );

            html +=
                '<article class="zpp-certificate zpp-reveal">' +
                    '<span class="zpp-certificate-icon">✦</span>' +

                    "<h3>" +
                        zppEscape(
                            certificate.title ||
                            "Certificate"
                        ) +
                    "</h3>" +

                    "<p>" +
                        zppEscape(
                            certificate.issuer ||
                            ""
                        ) +
                        (
                            date
                                ? " · " +
                                  zppEscape(
                                      date
                                  )
                                : ""
                        ) +
                    "</p>" +

                    (
                        credential
                            ? '<div class="zpp-project-actions">' +
                                '<a class="zpp-project-link" ' +
                                'href="' +
                                zppEscape(
                                    credential
                                ) +
                                '" target="_blank" ' +
                                'rel="noopener noreferrer">' +
                                "View credential ↗</a>" +
                              "</div>"
                            : ""
                    ) +
                "</article>";
        }
    );

    zppEl(
        "zpp-certificate-grid"
    ).innerHTML = html;
}

function zppSetupReveal() {
    const elements =
        document.querySelectorAll(
            "#zevqyn-public-portfolio .zpp-reveal"
        );

    if (
        !("IntersectionObserver" in window)
    ) {
        elements.forEach(
            function (element) {
                element.classList.add(
                    "zpp-visible"
                );
            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            function (entries) {
                entries.forEach(
                    function (entry) {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target
                                .classList.add(
                                    "zpp-visible"
                                );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.12
            }
        );

    elements.forEach(
        function (element) {
            observer.observe(
                element
            );
        }
    );
}

function zppShowError(error) {
    console.error(
        "ZEVQYN PUBLIC PORTFOLIO ERROR:",
        error
    );

    zppEl(
        "zpp-loading"
    ).hidden = true;

    zppEl(
        "zpp-content"
    ).hidden = true;

    zppEl(
        "zpp-error"
    ).hidden = false;
}
async function zppInitialize() {
    const slug =
        zppGetSlug();

    if (!slug) {
        zppShowError();
        return;
    }

    try {
        const response =
            await fetch(
                ZPP_API +
                "/public/portfolios/" +
                encodeURIComponent(
                    slug
                )
            );

        if (!response.ok) {
            throw new Error(
                "Portfolio unavailable."
            );
        }

        const data =
            await response.json();

        zppRenderHero(data);
        zppRenderAbout(data);
        zppRenderProjects(data);
        zppRenderSkills(data);
        zppRenderEducation(data);
        zppRenderCertificates(data);

        zppEl(
            "zpp-loading"
        ).hidden = true;

        zppEl(
            "zpp-error"
        ).hidden = true;

        zppEl(
            "zpp-content"
        ).hidden = false;

        zppSetupReveal();
   } catch (error) {
    zppShowError(error);
}
}

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        function () {
            zppInitialize();
        }
    );
} else {
    zppInitialize();
}
