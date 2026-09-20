
(function () {
    "use strict";

    var API_BASE = "https://zevqyn-backend.onrender.com/api/v1";
    var SUPABASE_URL = "https://phjizxajnigiiawitkyx.supabase.co";
    var SUPABASE_KEY = "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

    var supabaseClient = null;
    var accessToken = "";
    var activeConversationId = null;
    var isSending = false;
    var activeTool = null;

    var TOOL_CONFIG = {
        analyze: {
            title: "Profile Analysis",
            kicker: "CAREER READINESS"
        },
        "skill-gap": {
            title: "Skill Gap Analysis",
            kicker: "TARGET ROLE"
        },
        projects: {
            title: "Personalized Project Ideas",
            kicker: "PROJECT STRATEGY"
        },
        resume: {
            title: "Resume Review",
            kicker: "RESUME AI"
        },
        portfolio: {
            title: "Portfolio Review",
            kicker: "PORTFOLIO AI"
        },
        plan: {
            title: "30 / 60 / 90 Career Plan",
            kicker: "CAREER ROADMAP"
        }
    };

    function zevCaiInitialize() {
        loadSupabaseLibrary()
            .then(function () {
                supabaseClient = window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );

                return supabaseClient.auth.getSession();
            })
            .then(function (result) {
                var session = null;

                if (result.data) {
                    session = result.data.session;
                }

                if (!session) {
                    window.location.href = "/login/";
                    return;
                }

                accessToken = session.access_token;

                bindEvents();
                updateComposer();
                loadConversations();
            })
            .catch(function (error) {
                console.error("Career AI initialization error:", error);
                showToast("Could not initialize Career AI.");
            });
    }

    function loadSupabaseLibrary() {
        return new Promise(function (resolve, reject) {
            if (window.supabase) {
                resolve();
                return;
            }

            var existing = document.querySelector(
                'script[src*="supabase-js"]'
            );

            if (existing) {
                existing.addEventListener("load", resolve);
                existing.addEventListener("error", reject);
                return;
            }

            var script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });
    }

    function bindEvents() {
        var sendButton = document.getElementById("zev-cai-send");
        var input = document.getElementById("zev-cai-input");
        var newChat = document.getElementById("zev-cai-new-chat");
        var clearChat = document.getElementById("zev-cai-clear-chat");
        var modalClose = document.getElementById("zev-cai-modal-close");
        var backdrop = document.querySelector("[data-close-modal]");
        var toolCards = document.querySelectorAll(".zev-cai-tool-card");
        var prompts = document.querySelectorAll(".zev-cai-prompt");

        if (sendButton) {
            sendButton.addEventListener("click", sendMessage);
        }

        if (input) {
            input.addEventListener("input", updateComposer);

            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                }
            });
        }

        if (newChat) {
            newChat.addEventListener("click", startNewConversation);
        }

        if (clearChat) {
            clearChat.addEventListener("click", startNewConversation);
        }

        if (modalClose) {
            modalClose.addEventListener("click", closeModal);
        }

        if (backdrop) {
            backdrop.addEventListener("click", closeModal);
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeModal();
            }
        });

        prompts.forEach(function (button) {
            bindPrompt(button);
        });

        toolCards.forEach(function (card) {
            card.addEventListener("click", function () {
                openTool(card.getAttribute("data-tool"));
            });
        });
    }

    function bindPrompt(button) {
        button.addEventListener("click", function () {
            var input = document.getElementById("zev-cai-input");

            if (!input) {
                return;
            }

            input.value = button.textContent.trim();
            updateComposer();
            sendMessage();
        });
    }

    function apiRequest(path, options) {
        var requestOptions = options || {};
        var headers = requestOptions.headers || {};

        headers.Authorization = "Bearer " + accessToken;
        headers.Accept = "application/json";

        if (requestOptions.body) {
            headers["Content-Type"] = "application/json";
        }

        requestOptions.headers = headers;

        return fetch(API_BASE + path, requestOptions)
            .then(function (response) {
                if (response.status === 401) {
                    window.location.href = "/login/";
                    throw new Error("Authentication expired.");
                }

                return response.text().then(function (text) {
                    var data = null;

                    if (text) {
                        try {
                            data = JSON.parse(text);
                        } catch (error) {
                            data = null;
                        }
                    }

                    if (!response.ok) {
                        throw new Error(extractErrorMessage(data));
                    }

                    return data;
                });
            });
    }

    function extractErrorMessage(data) {
        if (!data) {
            return "Request failed. Please try again.";
        }

        if (typeof data.detail === "string") {
            return data.detail;
        }

        if (Array.isArray(data.detail)) {
            return data.detail
                .map(function (item) {
                    if (item.msg) {
                        return item.msg;
                    }

                    return "Invalid input.";
                })
                .join(" ");
        }

        return "Request failed. Please try again.";
    }

    /* =====================================================
       CHAT + CONVERSATIONS
       ===================================================== */

    function loadConversations() {
        return apiRequest("/career/ai/conversations", {
            method: "GET"
        })
            .then(function (conversations) {
                renderConversations(conversations || []);
            })
            .catch(function (error) {
                console.error("Conversation loading error:", error);
                showToast("Could not load previous conversations.");
            });
    }

    function renderConversations(conversations) {
        var container = document.getElementById(
            "zev-cai-conversations"
        );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (!conversations.length) {
            container.innerHTML =
                '<div class="zev-cai-history-placeholder">' +
                "No conversations yet. Start your first chat." +
                "</div>";
            return;
        }

        conversations.forEach(function (conversation) {
            var row = document.createElement("div");
            row.className = "zev-cai-conversation-item";

            if (conversation.id === activeConversationId) {
                row.classList.add("is-active");
            }

            var openButton = document.createElement("button");
            openButton.type = "button";
            openButton.className = "zev-cai-conversation-open";
            openButton.textContent =
                conversation.title || "Career conversation";

            openButton.addEventListener("click", function () {
                openConversation(conversation.id);
            });

            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "zev-cai-conversation-delete";
            deleteButton.textContent = "×";
            deleteButton.title = "Delete conversation";

            deleteButton.addEventListener("click", function (event) {
                event.stopPropagation();
                deleteConversation(conversation.id);
            });

            row.appendChild(openButton);
            row.appendChild(deleteButton);
            container.appendChild(row);
        });
    }

    function openConversation(conversationId) {
        apiRequest(
            "/career/ai/conversations/" +
                encodeURIComponent(conversationId),
            {
                method: "GET"
            }
        )
            .then(function (conversation) {
                activeConversationId = conversation.id;

                renderConversationMessages(
                    conversation.messages || []
                );

                return loadConversations();
            })
            .catch(function (error) {
                console.error("Conversation error:", error);
                showToast(error.message);
            });
    }

    function renderConversationMessages(messages) {
        var container = document.getElementById(
            "zev-cai-chat-messages"
        );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        messages.forEach(function (message) {
            appendMessage(message.role, message.content);
        });

        if (!messages.length) {
            restoreWelcome();
        }

        scrollChatToBottom();
    }

    function sendMessage() {
        if (isSending) {
            return;
        }

        var input = document.getElementById("zev-cai-input");

        if (!input) {
            return;
        }

        var message = input.value.trim();

        if (!message) {
            return;
        }

        if (message.length > 2000) {
            showToast("Message must be 2000 characters or less.");
            return;
        }

        isSending = true;
        setSendingState(true);

        removeWelcome();
        appendMessage("user", message);

        input.value = "";
        updateComposer();
        showTyping(true);

        var body = {
            message: message
        };

        if (activeConversationId) {
            body.conversation_id = activeConversationId;
        }

        apiRequest("/career/ai/chat", {
            method: "POST",
            body: JSON.stringify(body)
        })
            .then(function (response) {
                activeConversationId = response.conversation_id;

                showTyping(false);
                appendMessage("assistant", response.answer);

                return loadConversations();
            })
            .catch(function (error) {
                console.error("Career AI chat error:", error);

                showTyping(false);

                appendMessage(
                    "assistant",
                    "I couldn't complete that request. " +
                        error.message
                );
            })
            .finally(function () {
                isSending = false;
                setSendingState(false);
            });
    }

    function appendMessage(role, content) {
        var container = document.getElementById(
            "zev-cai-chat-messages"
        );

        if (!container) {
            return;
        }

        removeWelcome();

        var wrapper = document.createElement("div");
        wrapper.className = "zev-cai-message";

        if (role === "user") {
            wrapper.classList.add("zev-cai-message-user");
        } else {
            wrapper.classList.add("zev-cai-message-assistant");
        }

        if (role !== "user") {
            var avatar = document.createElement("div");
            avatar.className = "zev-cai-message-avatar";
            avatar.textContent = "✦";
            wrapper.appendChild(avatar);
        }

        var bubble = document.createElement("div");
        bubble.className = "zev-cai-message-content";

        if (role === "user") {
            bubble.textContent = content || "";
        } else {
            bubble.innerHTML = formatAiText(content || "");
        }

        wrapper.appendChild(bubble);
        container.appendChild(wrapper);

        scrollChatToBottom();
    }

    function startNewConversation() {
        activeConversationId = null;

        var container = document.getElementById(
            "zev-cai-chat-messages"
        );

        if (container) {
            container.innerHTML = "";
        }

        restoreWelcome();
        loadConversations();

        var input = document.getElementById("zev-cai-input");

        if (input) {
            input.value = "";
            updateComposer();
            input.focus();
        }
    }

    function deleteConversation(conversationId) {
        var confirmed = window.confirm(
            "Delete this Career AI conversation?"
        );

        if (!confirmed) {
            return;
        }

        apiRequest(
            "/career/ai/conversations/" +
                encodeURIComponent(conversationId),
            {
                method: "DELETE"
            }
        )
            .then(function () {
                if (activeConversationId === conversationId) {
                    activeConversationId = null;

                    var container = document.getElementById(
                        "zev-cai-chat-messages"
                    );

                    if (container) {
                        container.innerHTML = "";
                    }

                    restoreWelcome();
                }

                showToast("Conversation deleted.");
                return loadConversations();
            })
            .catch(function (error) {
                console.error("Delete conversation error:", error);
                showToast(error.message);
            });
    }

    function removeWelcome() {
        var welcome = document.getElementById("zev-cai-welcome");

        if (welcome) {
            welcome.remove();
        }
    }

    function restoreWelcome() {
        var container = document.getElementById(
            "zev-cai-chat-messages"
        );

        if (!container) {
            return;
        }

        if (document.getElementById("zev-cai-welcome")) {
            return;
        }

        var welcome = document.createElement("div");
        welcome.id = "zev-cai-welcome";
        welcome.className = "zev-cai-welcome";

        welcome.innerHTML =
            '<div class="zev-cai-welcome-icon">✦</div>' +
            "<h2>Where do you want your career to go?</h2>" +
            "<p>I can use your projects, skills, education, " +
            "certificates, resumes and portfolio to give you " +
            "personalized guidance.</p>" +
            '<div class="zev-cai-prompts">' +
            '<button type="button" class="zev-cai-prompt">' +
            "What should I learn next?" +
            "</button>" +
            '<button type="button" class="zev-cai-prompt">' +
            "How can I become a backend developer?" +
            "</button>" +
            '<button type="button" class="zev-cai-prompt">' +
            "Which project should I build next?" +
            "</button>" +
            '<button type="button" class="zev-cai-prompt">' +
            "What are the biggest gaps in my profile?" +
            "</button>" +
            "</div>";

        container.appendChild(welcome);

        welcome.querySelectorAll(".zev-cai-prompt")
            .forEach(function (button) {
                bindPrompt(button);
            });
    }

    /* =====================================================
       TOOLKIT
       ===================================================== */

    function openTool(tool) {
        if (!TOOL_CONFIG[tool]) {
            return;
        }

        activeTool = tool;

        var modal = document.getElementById("zev-cai-modal");
        var title = document.getElementById("zev-cai-modal-title");
        var kicker = document.getElementById(
            "zev-cai-modal-kicker"
        );
        var form = document.getElementById("zev-cai-modal-form");
        var result = document.getElementById(
            "zev-cai-modal-result"
        );

        title.textContent = TOOL_CONFIG[tool].title;
        kicker.textContent = TOOL_CONFIG[tool].kicker;
        form.innerHTML = "";
result.innerHTML = "";

/* Always restore the form when opening a tool */
form.style.display = "";

setModalLoading(false);
modal.hidden = false;

        if (tool === "analyze") {
            renderAnalyzeForm();
            return;
        }

        if (tool === "skill-gap") {
            renderRoleForm(
                "Target role",
                "e.g. Backend Engineer",
                "Analyze Skill Gap"
            );
            return;
        }

        if (tool === "projects") {
            renderProjectForm();
            return;
        }

        if (tool === "resume") {
            renderResumeSelector();
            return;
        }

        if (tool === "portfolio") {
            renderPortfolioSelector();
            return;
        }

        if (tool === "plan") {
            renderRoleForm(
                "Target role",
                "e.g. AI Engineer",
                "Generate Career Plan"
            );
        }
    }

    function closeModal() {
        var modal = document.getElementById("zev-cai-modal");

        if (modal) {
            modal.hidden = true;
        }

        activeTool = null;
    }

    function renderAnalyzeForm() {
        var form = getModalForm();

        form.innerHTML =
            '<div class="zev-cai-result-card">' +
            "<h3>Career readiness analysis</h3>" +
            "<p>Career AI will analyze your saved profile, " +
            "projects, skills, education, certificates, resumes " +
            "and portfolios.</p>" +
            "</div>" +
            '<button type="button" class="zev-cai-modal-action" ' +
            'id="zev-cai-run-tool">Analyze My Profile</button>';

        bindRunTool();
    }

    function renderRoleForm(label, placeholder, buttonText) {
        var form = getModalForm();

        form.innerHTML =
            '<div class="zev-cai-field">' +
            "<label>" + escapeHtml(label) + "</label>" +
            '<input id="zev-cai-target-role" type="text" ' +
            'maxlength="150" placeholder="' +
            escapeHtml(placeholder) + '">' +
            "</div>" +
            '<button type="button" class="zev-cai-modal-action" ' +
            'id="zev-cai-run-tool">' +
            escapeHtml(buttonText) +
            "</button>";

        bindRunTool();
    }

    function renderProjectForm() {
        var form = getModalForm();

        form.innerHTML =
            '<div class="zev-cai-field">' +
            "<label>Target role (optional)</label>" +
            '<input id="zev-cai-target-role" type="text" ' +
            'maxlength="150" placeholder="e.g. Full Stack Developer">' +
            "</div>" +
            '<div class="zev-cai-field">' +
            "<label>Number of ideas</label>" +
            '<select id="zev-cai-project-count">' +
            '<option value="1">1 project</option>' +
            '<option value="2">2 projects</option>' +
            '<option value="3" selected>3 projects</option>' +
            '<option value="4">4 projects</option>' +
            '<option value="5">5 projects</option>' +
            "</select>" +
            "</div>" +
            '<button type="button" class="zev-cai-modal-action" ' +
            'id="zev-cai-run-tool">Generate Project Ideas</button>';

        bindRunTool();
    }

    function renderResumeSelector() {
        var form = getModalForm();

        form.innerHTML =
            '<div class="zev-cai-result-card">' +
            "<p>Loading your resumes...</p>" +
            "</div>";

        apiRequest("/resumes", {
            method: "GET"
        })
            .then(function (resumes) {
                if (!resumes.length) {
                    form.innerHTML =
                        emptySelectorMessage(
                            "No resumes found.",
                            "/resume/",
                            "Open Resume Builder"
                        );
                    return;
                }

                var options = resumes.map(function (resume) {
                    var label = resume.name;

                    if (resume.professional_title) {
                        label += " — " + resume.professional_title;
                    }

                    return (
                        '<option value="' +
                        escapeAttribute(resume.id) +
                        '">' +
                        escapeHtml(label) +
                        "</option>"
                    );
                }).join("");

                form.innerHTML =
                    '<div class="zev-cai-field">' +
                    "<label>Select resume</label>" +
                    '<select id="zev-cai-resume-id">' +
                    options +
                    "</select>" +
                    "</div>" +
                    '<button type="button" ' +
                    'class="zev-cai-modal-action" ' +
                    'id="zev-cai-run-tool">Review Resume</button>';

                bindRunTool();
            })
            .catch(function (error) {
                form.innerHTML = errorCard(error.message);
            });
    }

    function renderPortfolioSelector() {
        var form = getModalForm();

        form.innerHTML =
            '<div class="zev-cai-result-card">' +
            "<p>Loading your portfolios...</p>" +
            "</div>";

        apiRequest("/portfolios", {
            method: "GET"
        })
            .then(function (portfolios) {
                if (!portfolios.length) {
                    form.innerHTML =
                        emptySelectorMessage(
                            "No portfolios found.",
                            "/portfolio/",
                            "Open Portfolio Builder"
                        );
                    return;
                }

                var options = portfolios.map(function (portfolio) {
                    var label = portfolio.display_name;

                    if (portfolio.headline) {
                        label += " — " + portfolio.headline;
                    }

                    return (
                        '<option value="' +
                        escapeAttribute(portfolio.id) +
                        '">' +
                        escapeHtml(label) +
                        "</option>"
                    );
                }).join("");

                form.innerHTML =
                    '<div class="zev-cai-field">' +
                    "<label>Select portfolio</label>" +
                    '<select id="zev-cai-portfolio-id">' +
                    options +
                    "</select>" +
                    "</div>" +
                    '<button type="button" ' +
                    'class="zev-cai-modal-action" ' +
                    'id="zev-cai-run-tool">Review Portfolio</button>';

                bindRunTool();
            })
            .catch(function (error) {
                form.innerHTML = errorCard(error.message);
            });
    }

    function bindRunTool() {
        var button = document.getElementById("zev-cai-run-tool");

        if (button) {
            button.addEventListener("click", runActiveTool);
        }
    }

    function runActiveTool() {
        if (activeTool === "analyze") {
            runToolRequest(
                "/career/ai/analyze",
                null,
                renderAnalysis
            );
            return;
        }

        if (activeTool === "skill-gap") {
            var skillRole = getTargetRole(true);

            if (!skillRole) {
                return;
            }

            runToolRequest(
                "/career/ai/skill-gap",
                {
                    target_role: skillRole
                },
                renderSkillGap
            );
            return;
        }

        if (activeTool === "projects") {
            var projectRole = getTargetRole(false);
            var countElement = document.getElementById(
                "zev-cai-project-count"
            );

            var projectBody = {
                count: Number(countElement.value)
            };

            if (projectRole) {
                projectBody.target_role = projectRole;
            }

            runToolRequest(
                "/career/ai/suggest-projects",
                projectBody,
                renderProjects
            );
            return;
        }

        if (activeTool === "resume") {
            var resume = document.getElementById(
                "zev-cai-resume-id"
            );

            if (!resume) {
                return;
            }

            runToolRequest(
                "/career/ai/review-resume",
                {
                    resume_id: resume.value
                },
                renderResumeReview
            );
            return;
        }

        if (activeTool === "portfolio") {
            var portfolio = document.getElementById(
                "zev-cai-portfolio-id"
            );

            if (!portfolio) {
                return;
            }

            runToolRequest(
                "/career/ai/review-portfolio",
                {
                    portfolio_id: portfolio.value
                },
                renderPortfolioReview
            );
            return;
        }

        if (activeTool === "plan") {
            var planRole = getTargetRole(true);

            if (!planRole) {
                return;
            }

            runToolRequest(
                "/career/ai/action-plan",
                {
                    target_role: planRole
                },
                renderActionPlan
            );
        }
    }

    function getTargetRole(required) {
        var element = document.getElementById(
            "zev-cai-target-role"
        );

        if (!element) {
            return "";
        }

        var value = element.value.trim();

        if (required && value.length < 2) {
            showToast("Enter a target role first.");
            element.focus();
            return "";
        }

        return value;
    }

    function runToolRequest(path, body, renderer) {
        var form = getModalForm();
        var result = getModalResult();

        form.style.display = "none";
        result.innerHTML = "";
        setModalLoading(true);

        var options = {
            method: "POST"
        };

        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        apiRequest(path, options)
            .then(function (data) {
                setModalLoading(false);
                renderer(data);
            })
            .catch(function (error) {
                console.error("Career AI tool error:", error);
                setModalLoading(false);

                result.innerHTML =
                    errorCard(error.message) +
                    '<button type="button" ' +
                    'class="zev-cai-modal-action" ' +
                    'id="zev-cai-try-again">Try Again</button>';

                var retry = document.getElementById(
                    "zev-cai-try-again"
                );

                if (retry) {
                    retry.addEventListener("click", function () {
                        result.innerHTML = "";
                        form.style.display = "";
                    });
                }
            });
    }

    /* =====================================================
       STRUCTURED RESULTS
       ===================================================== */

    function renderAnalysis(data) {
        var stats = data.profile_stats || {};

        getModalResult().innerHTML =
            scoreBlock(data.readiness_score, "Readiness") +
            summaryCard(data.summary) +
            listCard("Strengths", data.strengths) +
            listCard("Improvement Areas", data.improvement_areas) +
            listCard("Next Actions", data.next_actions) +
            '<div class="zev-cai-result-card">' +
            "<h3>Profile used</h3>" +
            '<div class="zev-cai-stat-grid">' +
            statItem("Projects", stats.projects) +
            statItem("Skills", stats.skills) +
            statItem("Education", stats.education) +
            statItem("Certificates", stats.certificates) +
            statItem("Resumes", stats.resumes) +
            statItem("Portfolios", stats.portfolios) +
            "</div></div>";
    }

    function renderSkillGap(data) {
        var gaps = "";

        (data.skill_gaps || []).forEach(function (gap) {
            gaps +=
                '<div class="zev-cai-result-card">' +
                '<div class="zev-cai-result-title-row">' +
                "<h3>" + escapeHtml(gap.skill) + "</h3>" +
                priorityBadge(gap.priority) +
                "</div>" +
                "<p>" + escapeHtml(gap.reason) + "</p>" +
                "<p><strong>Next step:</strong> " +
                escapeHtml(gap.suggested_action) +
                "</p></div>";
        });

        getModalResult().innerHTML =
            '<div class="zev-cai-result-card">' +
            "<h3>Target Role</h3>" +
            "<p>" + escapeHtml(data.target_role) + "</p>" +
            "</div>" +
            listCard("Current Strengths", data.current_strengths) +
            gaps +
            listCard(
                "Recommended Learning",
                data.recommended_learning
            ) +
            listCard(
                "Recommended Projects",
                data.recommended_projects
            );
    }

    function renderProjects(data) {
        var html = "";

        if (data.target_role) {
            html +=
                '<div class="zev-cai-result-card">' +
                "<h3>Target Role</h3>" +
                "<p>" + escapeHtml(data.target_role) + "</p>" +
                "</div>";
        }

        (data.suggestions || []).forEach(function (project, index) {
            html +=
                '<div class="zev-cai-result-card">' +
                '<div class="zev-cai-result-title-row">' +
                "<h3>" +
                (index + 1) +
                ". " +
                escapeHtml(project.title) +
                "</h3>" +
                '<span class="zev-cai-badge">' +
                escapeHtml(project.difficulty) +
                "</span>" +
                "</div>" +
                "<p>" + escapeHtml(project.description) + "</p>" +
                "<p><strong>Why it fits:</strong> " +
                escapeHtml(project.why_it_fits) +
                "</p>" +
                miniList("Features", project.suggested_features) +
                miniList("Technologies", project.technologies) +
                miniList(
                    "Skills developed",
                    project.skills_developed
                ) +
                "</div>";
        });

        getModalResult().innerHTML = html;
    }

    function renderResumeReview(data) {
        getModalResult().innerHTML =
            scoreBlock(data.score, "Resume Score") +
            summaryCard(data.summary) +
            listCard("Strengths", data.strengths) +
            listCard("Improvements", data.improvements) +
            listCard("ATS Suggestions", data.ats_suggestions) +
            listCard(
                "Content Suggestions",
                data.content_suggestions
            ) +
            listCard("Missing Elements", data.missing_elements);
    }

    function renderPortfolioReview(data) {
        getModalResult().innerHTML =
            scoreBlock(data.score, "Portfolio Score") +
            summaryCard(data.summary) +
            listCard("Strengths", data.strengths) +
            listCard("Improvements", data.improvements) +
            listCard(
                "Presentation Suggestions",
                data.presentation_suggestions
            ) +
            listCard("Missing Elements", data.missing_elements);
    }

    function renderActionPlan(data) {
        getModalResult().innerHTML =
            '<div class="zev-cai-result-card">' +
            "<h3>" + escapeHtml(data.target_role) + "</h3>" +
            "<p>" + escapeHtml(data.summary) + "</p>" +
            "</div>" +
            planSection("First 30 Days", data.days_30) +
            planSection("Days 31–60", data.days_60) +
            planSection("Days 61–90", data.days_90);
    }

    function scoreBlock(score, label) {
        return (
            '<div class="zev-cai-score-wrap">' +
            '<div class="zev-cai-score">' +
            escapeHtml(String(score)) +
            "</div>" +
            "<div><strong>" +
            escapeHtml(label) +
            "</strong><span>out of 100</span></div>" +
            "</div>"
        );
    }

    function summaryCard(summary) {
        return (
            '<div class="zev-cai-result-card">' +
            "<h3>AI Summary</h3>" +
            "<p>" + escapeHtml(summary || "") + "</p>" +
            "</div>"
        );
    }

    function listCard(title, items) {
        var list = items || [];

        if (!list.length) {
            return "";
        }

        return (
            '<div class="zev-cai-result-card">' +
            "<h3>" + escapeHtml(title) + "</h3>" +
            "<ul>" +
            list.map(function (item) {
                return "<li>" + escapeHtml(item) + "</li>";
            }).join("") +
            "</ul></div>"
        );
    }

    function miniList(title, items) {
        var list = items || [];

        if (!list.length) {
            return "";
        }

        return (
            '<div class="zev-cai-mini-list">' +
            "<strong>" + escapeHtml(title) + "</strong>" +
            "<div>" +
            list.map(function (item) {
                return (
                    '<span class="zev-cai-chip">' +
                    escapeHtml(item) +
                    "</span>"
                );
            }).join("") +
            "</div></div>"
        );
    }

    function planSection(title, items) {
        var html =
            '<div class="zev-cai-result-card">' +
            "<h3>" + escapeHtml(title) + "</h3>";

        (items || []).forEach(function (item) {
            html +=
                '<div class="zev-cai-plan-item">' +
                '<div class="zev-cai-result-title-row">' +
                "<strong>" + escapeHtml(item.title) + "</strong>" +
                priorityBadge(item.priority) +
                "</div>" +
                "<p>" + escapeHtml(item.description) + "</p>" +
                '<span class="zev-cai-badge">' +
                escapeHtml(item.category) +
                "</span>" +
                "</div>";
        });

        html += "</div>";
        return html;
    }

    function priorityBadge(priority) {
        return (
            '<span class="zev-cai-badge">' +
            escapeHtml(priority || "") +
            "</span>"
        );
    }

    function statItem(label, value) {
        return (
            '<div class="zev-cai-stat-item">' +
            "<strong>" +
            escapeHtml(String(value || 0)) +
            "</strong>" +
            "<span>" +
            escapeHtml(label) +
            "</span></div>"
        );
    }

    /* =====================================================
       AI TEXT FORMATTING
       ===================================================== */

    function formatAiText(text) {
        var safe = escapeHtml(text);

        safe = safe.replace(
            /\*\*(.+?)\*\*/g,
            "<strong>$1</strong>"
        );

        safe = safe.replace(
            /^### (.+)$/gm,
            '<div class="zev-cai-ai-heading">$1</div>'
        );

        safe = safe.replace(
            /^## (.+)$/gm,
            '<div class="zev-cai-ai-heading">$1</div>'
        );

        safe = safe.replace(
            /^# (.+)$/gm,
            '<div class="zev-cai-ai-heading">$1</div>'
        );

        safe = safe.replace(
            /^(\d+)\.\s+(.+)$/gm,
            '<div class="zev-cai-ai-list-item">' +
            '<span class="zev-cai-ai-list-number">$1.</span>' +
            "<span>$2</span></div>"
        );

        safe = safe.replace(
            /^[*-]\s+(.+)$/gm,
            '<div class="zev-cai-ai-list-item">' +
            '<span class="zev-cai-ai-list-number">•</span>' +
            "<span>$1</span></div>"
        );

        safe = safe.replace(/\n\n+/g, "<br><br>");
        safe = safe.replace(/\n/g, "<br>");

        return safe;
    }

    /* =====================================================
       UI HELPERS
       ===================================================== */

    function getModalForm() {
        return document.getElementById("zev-cai-modal-form");
    }

    function getModalResult() {
        return document.getElementById("zev-cai-modal-result");
    }

    function setModalLoading(show) {
        var loading = document.getElementById(
            "zev-cai-modal-loading"
        );

        if (loading) {
            loading.hidden = !show;
        }
    }

    function showTyping(show) {
        var typing = document.getElementById("zev-cai-typing");

        if (!typing) {
            return;
        }

        typing.hidden = !show;

        if (show) {
            scrollChatToBottom();
        }
    }

    function setSendingState(sending) {
        var sendButton = document.getElementById("zev-cai-send");
        var input = document.getElementById("zev-cai-input");

        if (sendButton) {
            sendButton.disabled = sending;
        }

        if (input) {
            input.disabled = sending;
        }
    }

    function updateComposer() {
        var input = document.getElementById("zev-cai-input");
        var counter = document.getElementById(
            "zev-cai-char-count"
        );

        if (!input) {
            return;
        }

        input.style.height = "auto";
        input.style.height =
            Math.min(input.scrollHeight, 130) + "px";

        if (counter) {
            counter.textContent =
                input.value.length + " / 2000";
        }
    }

    function scrollChatToBottom() {
        var container = document.getElementById(
            "zev-cai-chat-messages"
        );

        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    function showToast(message) {
        var toast = document.getElementById("zev-cai-toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.hidden = false;

        window.clearTimeout(showToast.timer);

        showToast.timer = window.setTimeout(function () {
            toast.hidden = true;
        }, 3500);
    }

    function errorCard(message) {
        return (
            '<div class="zev-cai-result-card zev-cai-error-card">' +
            "<h3>Something went wrong</h3>" +
            "<p>" + escapeHtml(message) + "</p>" +
            "</div>"
        );
    }

    function emptySelectorMessage(message, url, label) {
        return (
            '<div class="zev-cai-result-card">' +
            "<h3>" + escapeHtml(message) + "</h3>" +
            "<p>Create one first, then return here for an AI review.</p>" +
            "</div>" +
            '<a class="zev-cai-modal-action zev-cai-action-link" href="' +
            escapeAttribute(url) +
            '">' +
            escapeHtml(label) +
            "</a>"
        );
    }

    function escapeHtml(value) {
        return String(value === null || value === undefined ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            zevCaiInitialize
        );
    } else {
        zevCaiInitialize();
    }
})();
