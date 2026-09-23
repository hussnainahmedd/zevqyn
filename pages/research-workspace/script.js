
(function () {

    /* =========================================
       ZEVQYN RESEARCH WORKSPACE
    ========================================= */

    const SUPABASE_URL =
        "https://phjizxajnigiiawitkyx.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

    const API_BASE =
        "https://zevqyn-backend.onrender.com";


    let supabaseClient = null;
    let currentSession = null;
    let workspaceId = null;

    let currentWorkspace = null;
    let documents = [];
    let conversations = [];

    let currentConversationId = null;
    let pendingDeleteDocumentId = null;


    /* =========================================
       BASIC HELPERS
    ========================================= */

    function el(id) {
        return document.getElementById(id);
    }


    function escapeHTML(value) {

        const div = document.createElement("div");

        div.textContent =
            value === null ||
            value === undefined
                ? ""
                : String(value);

        return div.innerHTML;

    }


    function getWorkspaceId() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        return params.get("id");

    }


    function showToast(message, type) {

        const toast = el("zevqyn-toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.className =
            "zev-toast " + (type || "");

        toast.hidden = false;


        setTimeout(
            function () {

                toast.hidden = true;

            },
            3500
        );

    }


    function formatBytes(bytes) {

        const size = Number(bytes || 0);

        if (size < 1024) {
            return size + " B";
        }

        if (size < 1048576) {

            return (
                size / 1024
            ).toFixed(1) + " KB";

        }

        return (
            size / 1048576
        ).toFixed(1) + " MB";

    }


    /* =========================================
       LOAD SUPABASE
    ========================================= */

    function loadSupabase() {

        return new Promise(
            function (resolve, reject) {

                if (window.supabase) {
                    resolve();
                    return;
                }


                const script =
                    document.createElement("script");

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


                document.head.appendChild(script);

            }
        );

    }


    /* =========================================
       API
    ========================================= */

    async function apiRequest(path, options) {

        if (!currentSession) {

            throw new Error(
                "Your login session has expired."
            );

        }


        const settings = options || {};

        if (!settings.headers) {
            settings.headers = {};
        }


        settings.headers["Authorization"] =
            "Bearer " +
            currentSession.access_token;


        const response =
            await fetch(
                API_BASE + path,
                settings
            );


        if (response.status === 401) {

            await supabaseClient.auth.signOut();

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
                /* use default */
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
       LOAD WORKSPACE
    ========================================= */

    async function loadWorkspace() {

        currentWorkspace =
            await apiRequest(
                "/api/v1/workspaces/" +
                workspaceId,
                {
                    method: "GET"
                }
            );


        const name =
            el("zevqyn-workspace-name");

        const description =
            el(
                "zevqyn-workspace-description"
            );


        if (name) {

            name.textContent =
                currentWorkspace.name ||
                "Research Workspace";

        }


        if (description) {

            description.textContent =
                currentWorkspace.description ||
                "Your ZEVQYN research workspace.";

        }


        document.title =
            (currentWorkspace.name ||
            "Research Workspace") +
            " | ZEVQYN";

    }


    /* =========================================
       LOAD DOCUMENTS
    ========================================= */

    async function loadDocuments() {

        const loading =
            el("zevqyn-documents-loading");

        const noDocuments =
            el("zevqyn-no-documents");


        if (loading) {
            loading.style.display = "flex";
        }


        if (noDocuments) {
            noDocuments.hidden = true;
        }


        try {

            const result =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/documents",
                    {
                        method: "GET"
                    }
                );


            if (Array.isArray(result)) {
                documents = result;
            } else {
                documents = [];
            }


            renderDocuments();
            updateStats();


        } catch (error) {

            console.error(
                "Documents error:",
                error
            );

            showToast(
                "Could not load documents.",
                "error"
            );

        } finally {

            if (loading) {
                loading.style.display = "none";
            }

        }

    }


    /* =========================================
       DOCUMENT RENDER
    ========================================= */

    function renderDocuments() {

        const list =
            el("zevqyn-document-list");

        const empty =
            el("zevqyn-no-documents");

        const label =
            el("zevqyn-documents-label");


        if (label) {

            label.textContent =
                documents.length +
                (
                    documents.length === 1
                        ? " source"
                        : " sources"
                );

        }


        if (!list) {
            return;
        }


        list.innerHTML = "";


        if (documents.length === 0) {

    if (empty) {

        empty.hidden = false;

        empty.style.display = "";

    }

    return;

}


if (empty) {

    empty.hidden = true;

    empty.style.display = "none";

}


        documents.forEach(
            function (documentItem) {

                const item =
                    document.createElement("div");

                item.className =
                    "zev-document-item";


                const filename =
                    escapeHTML(
                        documentItem.original_filename
                    );

                const type =
                    escapeHTML(
                        documentItem.file_type ||
                        "FILE"
                    );

                const status =
                    escapeHTML(
                        documentItem.status ||
                        "uploaded"
                    );


                item.innerHTML =
                    '<div class="zev-document-main">' +

                        '<div class="zev-doc-file-icon">' +
                            '▤' +
                        '</div>' +

                        '<div class="zev-document-info">' +

                            '<div class="zev-document-name">' +
                                filename +
                            '</div>' +

                            '<div class="zev-document-meta">' +
                                type.toUpperCase() +
                                " · " +
                                formatBytes(
                                    documentItem.file_size
                                ) +
                            '</div>' +

                            '<span class="zev-document-status">' +
                                status +
                            '</span>' +

                        '</div>' +

                    '</div>' +

                    '<div class="zev-document-actions">' +

                        '<button type="button" class="zev-doc-action zev-doc-download">' +
                            'Download' +
                        '</button>' +

                        '<button type="button" class="zev-doc-action zev-doc-delete">' +
                            'Delete' +
                        '</button>' +

                    '</div>';


                const downloadButton =
                    item.querySelector(
                        ".zev-doc-download"
                    );

                const deleteButton =
                    item.querySelector(
                        ".zev-doc-delete"
                    );


                downloadButton.addEventListener(
                    "click",
                    function () {

                        downloadDocument(
                            documentItem.id
                        );

                    }
                );


                deleteButton.addEventListener(
                    "click",
                    function () {

                        openDeleteModal(
                            documentItem.id
                        );

                    }
                );


                list.appendChild(item);

            }
        );

    }


    /* =========================================
       UPLOAD DOCUMENT
    ========================================= */

    async function uploadFile(file) {

        if (!file) {
            return;
        }


        const allowed =
            [
                "pdf",
                "docx",
                "txt",
                "md"
            ];


        const filename =
            file.name || "";

        const extension =
            filename
                .split(".")
                .pop()
                .toLowerCase();


        if (
            allowed.indexOf(extension) === -1
        ) {

            showToast(
                "Please upload PDF, DOCX, TXT or MD.",
                "error"
            );

            return;

        }


        const progress =
            el("zevqyn-upload-progress");

        const progressBar =
            el("zevqyn-progress-bar");

        const percent =
            el("zevqyn-upload-percent");

        const uploadName =
            el("zevqyn-upload-name");

        const message =
            el("zevqyn-upload-message");


        if (progress) {
            progress.hidden = false;
        }


        if (uploadName) {
            uploadName.textContent =
                filename;
        }


        if (progressBar) {
            progressBar.style.width =
                "15%";
        }


        if (percent) {
            percent.textContent =
                "15%";
        }


        if (message) {
            message.textContent =
                "Uploading document...";
        }


        try {

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );


            const uploaded =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/documents",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            if (progressBar) {
                progressBar.style.width =
                    "55%";
            }


            if (percent) {
                percent.textContent =
                    "55%";
            }


            if (message) {

                message.textContent =
                    "Understanding and indexing document...";

            }


            await apiRequest(
                "/api/v1/workspaces/" +
                workspaceId +
                "/documents/" +
                uploaded.id +
                "/index",
                {
                    method: "POST"
                }
            );


            if (progressBar) {
                progressBar.style.width =
                    "100%";
            }


            if (percent) {
                percent.textContent =
                    "100%";
            }


            if (message) {

                message.textContent =
                    "Document ready for AI research.";

            }


            showToast(
                "Document uploaded and indexed successfully.",
                "success"
            );


            await loadDocuments();


            setTimeout(
                function () {

                    if (progress) {
                        progress.hidden = true;
                    }

                    if (progressBar) {
                        progressBar.style.width =
                            "0";
                    }

                },
                1200
            );


        } catch (error) {

            console.error(
                "Upload error:",
                error
            );


            if (message) {

                message.textContent =
                    error.message;

            }


            showToast(
                error.message ||
                "Document upload failed.",
                "error"
            );

        }

    }


    /* =========================================
       DOWNLOAD DOCUMENT
    ========================================= */

    async function downloadDocument(
        documentId
    ) {

        try {

            const result =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/documents/" +
                    documentId +
                    "/download",
                    {
                        method: "GET"
                    }
                );


            if (result.url) {

                window.open(
                    result.url,
                    "_blank"
                );

            }

        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        }

    }


    /* =========================================
       DELETE DOCUMENT
    ========================================= */

    function openDeleteModal(
        documentId
    ) {

        pendingDeleteDocumentId =
            documentId;

        const modal =
            el("zevqyn-delete-modal");

        if (modal) {
            modal.hidden = false;
        }

    }


    function closeDeleteModal() {

        pendingDeleteDocumentId =
            null;

        const modal =
            el("zevqyn-delete-modal");

        if (modal) {
            modal.hidden = true;
        }

    }


    async function confirmDeleteDocument() {

        if (!pendingDeleteDocumentId) {
            return;
        }


        const documentId =
            pendingDeleteDocumentId;


        try {

            await apiRequest(
                "/api/v1/workspaces/" +
                workspaceId +
                "/documents/" +
                documentId,
                {
                    method: "DELETE"
                }
            );


            closeDeleteModal();


            showToast(
                "Document deleted.",
                "success"
            );


            await loadDocuments();


        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        }

    }


    /* =========================================
       CONVERSATIONS
    ========================================= */

    let pendingDeleteConversationId = null;

    async function loadConversations() {

        try {

            const result =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/conversations",
                    {
                        method: "GET"
                    }
                );


            if (Array.isArray(result)) {
                conversations = result;
            } else {
                conversations = [];
            }


            updateStats();
            renderConversations();


        } catch (error) {

            conversations = [];

            console.error(
                "Conversation loading error:",
                error
            );

        }

    }

    function renderConversations() {
        const list = el("zevqyn-conversation-list");
        const empty = el("zevqyn-no-conversations");
        const label = el("zevqyn-conversations-label");

        if (!list) {
            return;
        }

        list.innerHTML = "";

        if (label) {
            const count = conversations.length;
            label.textContent = count + " chat" + (count === 1 ? "" : "s");
        }

        if (conversations.length === 0) {
            if (empty) {
                empty.hidden = false;
            }
            return;
        }

        if (empty) {
            empty.hidden = true;
        }

        conversations.forEach(function (conv) {
            const item = document.createElement("div");
            item.className = "zev-conv-item";
            if (conv.id === currentConversationId) {
                item.classList.add("active");
            }

            const mainBtn = document.createElement("button");
            mainBtn.type = "button";
            mainBtn.className = "zev-conv-select-btn";

            const titleSpan = document.createElement("span");
            titleSpan.className = "zev-conv-title";
            titleSpan.textContent = conv.title || "Research Conversation";

            const metaSpan = document.createElement("span");
            metaSpan.className = "zev-conv-meta";
            metaSpan.textContent = formatConvDate(conv.updated_at || conv.created_at);

            mainBtn.appendChild(titleSpan);
            mainBtn.appendChild(metaSpan);

            mainBtn.addEventListener("click", function () {
                openConversation(conv.id);
            });

            const delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.className = "zev-conv-delete-btn";
            delBtn.setAttribute("aria-label", "Delete conversation");
            delBtn.title = "Delete conversation";
            delBtn.textContent = "×";

            delBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                showDeleteConvModal(conv.id);
            });

            item.appendChild(mainBtn);
            item.appendChild(delBtn);
            list.appendChild(item);
        });
    }

    function formatConvDate(dateStr) {
        if (!dateStr) {
            return "";
        }
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        } catch (e) {
            return "";
        }
    }

    async function openConversation(conversationId) {
        if (currentConversationId === conversationId) {
            return;
        }

        try {
            const messages = await apiRequest(
                "/api/v1/workspaces/" +
                workspaceId +
                "/conversations/" +
                encodeURIComponent(conversationId) +
                "/messages",
                { method: "GET" }
            );

            currentConversationId = conversationId;
            renderConversations();

            const area = el("zevqyn-chat-area");
            if (!area) {
                return;
            }
            area.innerHTML = "";

            if (Array.isArray(messages)) {
                if (messages.length > 0) {
                    messages.forEach(function (msg) {
                        addChatMessage(
                            msg.role,
                            msg.content,
                            msg.citations || []
                        );
                    });
                    scrollChatToBottom();
                    return;
                }
            }

            clearChat();
        } catch (error) {
            console.error("Failed to load conversation messages:", error);
            showToast("Could not load chat messages: " + error.message, "error");
        }
    }

    function showDeleteConvModal(conversationId) {
        pendingDeleteConversationId = conversationId;
        const modal = el("zevqyn-delete-conv-modal");
        if (modal) {
            modal.hidden = false;
        }
    }

    function hideDeleteConvModal() {
        pendingDeleteConversationId = null;
        const modal = el("zevqyn-delete-conv-modal");
        if (modal) {
            modal.hidden = true;
        }
    }

    async function confirmDeleteConversation() {
        if (!pendingDeleteConversationId) {
            return;
        }

        const idToDelete = pendingDeleteConversationId;
        const confirmBtn = el("zevqyn-delete-conv-confirm");
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Deleting...";
        }

        try {
            await apiRequest(
                "/api/v1/workspaces/" +
                workspaceId +
                "/conversations/" +
                encodeURIComponent(idToDelete),
                {
                    method: "DELETE"
                }
            );

            conversations = conversations.filter(function (c) {
                return c.id !== idToDelete;
            });

            updateStats();
            renderConversations();

            if (currentConversationId === idToDelete) {
                clearChat();
            }

            hideDeleteConvModal();
            showToast("Conversation deleted successfully", "success");
        } catch (error) {
            console.error("Failed to delete conversation:", error);
            hideDeleteConvModal();
            showToast("Failed to delete conversation: " + error.message, "error");
        } finally {
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Delete";
            }
        }
    }


    /* =========================================
       STATS
    ========================================= */

    function updateStats() {

        const docCount =
            el("zevqyn-document-count");

        const conversationCount =
            el(
                "zevqyn-conversation-count"
            );

        const readyCount =
            el("zevqyn-ready-count");


        if (docCount) {
            docCount.textContent =
                documents.length;
        }


        if (conversationCount) {

            conversationCount.textContent =
                conversations.length;

        }


        let ready = 0;


        documents.forEach(
            function (documentItem) {

                const status =
                    String(
                        documentItem.status || ""
                    ).toLowerCase();


                if (
                    status === "indexed"
                ) {
                    ready += 1;
                }

                if (
                    status === "ready"
                ) {
                    ready += 1;
                }

                if (
                    status === "processed"
                ) {
                    ready += 1;
                }

            }
        );


        if (readyCount) {
            readyCount.textContent =
                ready;
        }

    }


    /* =========================================
       CHAT RENDER
    ========================================= */

    function clearChat() {

        currentConversationId = null;

        const area =
            el("zevqyn-chat-area");


        if (!area) {
            return;
        }


        area.innerHTML =
            '<div class="zev-chat-empty">' +

                '<div class="zev-chat-ai-icon">' +
                    '✦' +
                '</div>' +

                '<h3>Ask your research</h3>' +

                '<p>' +
                    'Ask ZEVQYN questions about your uploaded sources. Answers will be grounded in your documents with citations.' +
                '</p>' +

                '<div class="zev-suggested-prompts">' +

                    '<button type="button">Summarize the main ideas</button>' +

                    '<button type="button">Explain the key concepts</button>' +

                    '<button type="button">What should I study?</button>' +

                '</div>' +

            '</div>';


        setupPromptButtons();

    }

function addChatMessage(
    role,
    content,
    citations
) {

    const area =
        el("zevqyn-chat-area");

    if (!area) {
        return;
    }


    const empty =
        area.querySelector(
            ".zev-chat-empty"
        );

    if (empty) {
        empty.remove();
    }


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "zev-message " + role;


    /*
       CLEAN AI ANSWER

       Backend citations such as:
       [SOURCE_1]
       [SOURCE_1, SOURCE_3, SOURCE_5]
       [SOURCE_2, SOURCE_6]
       [7]

       are internal RAG references.
       We remove them from the visible answer.
    */

    let cleanContent =
        String(content || "");


    cleanContent =
        cleanContent.replace(
            /\[\s*SOURCE_\d+(?:\s*,\s*SOURCE_\d+)*\s*\]/gi,
            ""
        );


    cleanContent =
        cleanContent.replace(
            /\[\s*\d+\s*\]/g,
            ""
        );


    /*
       Clean spaces left after removing citations.
    */

    cleanContent =
        cleanContent.replace(
            /[ \t]+([.,!?;:])/g,
            "$1"
        );


    cleanContent =
        cleanContent.replace(
            /[ \t]{2,}/g,
            " "
        );


    cleanContent =
        cleanContent.trim();


    /*
       Escape backend content safely,
       then preserve paragraphs/new lines.
    */

    let answerHTML =
        escapeHTML(cleanContent);


    answerHTML =
        answerHTML.replace(
            /\n/g,
            "<br>"
        );


    /*
       DEDUPLICATE SOURCES

       If 8 retrieved chunks all come from
       242816 Hussnain.docx, show the document
       only once.
    */

    const citationList =
        Array.isArray(citations)
            ? citations
            : [];


    const uniqueSources = [];

    const sourceKeys = {};


    citationList.forEach(
        function (citation) {

            const documentName =
                citation.document_name ||
                citation.original_filename ||
                "Research source";


            const pageNumber =
                citation.page_number || "";


            /*
               If a page exists, keep pages separate.

               PDF example:
               document.pdf · Page 2
               document.pdf · Page 7

               DOCX without pages:
               only one source entry.
            */

            const key =
                String(documentName) +
                "::" +
                String(pageNumber);


            if (!sourceKeys[key]) {

                sourceKeys[key] = true;

                uniqueSources.push({
                    document_name:
                        documentName,

                    page_number:
                        pageNumber
                });

            }

        }
    );


    /*
       BUILD CLEAN SOURCE SECTION
    */

    let sourceHTML = "";


    if (
        role === "assistant" &&
        uniqueSources.length > 0
    ) {

        sourceHTML =
            '<div class="zev-citations">' +

                '<span class="zev-message-label">' +
                    'SOURCE' +
                    (
                        uniqueSources.length > 1
                            ? 'S'
                            : ''
                    ) +
                '</span>';


        uniqueSources.forEach(
            function (source) {

                let sourceText =
                    source.document_name;


                if (source.page_number) {

                    sourceText +=
                        " · Page " +
                        source.page_number;

                }


                sourceHTML +=
                    '<span class="zev-citation">' +
                        '↳ ' +
                        escapeHTML(
                            sourceText
                        ) +
                    '</span>';

            }
        );


        sourceHTML +=
            '</div>';

    }


    /*
       BUILD MESSAGE
    */

    wrapper.innerHTML =
        '<div class="zev-message-bubble">' +

            '<span class="zev-message-label">' +

                (
                    role === "user"
                        ? "YOU"
                        : "ZEVQYN AI"
                ) +

            '</span>' +

            '<div class="zev-message-content">' +

                answerHTML +

            '</div>' +

            sourceHTML +

        '</div>';


    area.appendChild(wrapper);


    area.scrollTop =
        area.scrollHeight;

}

    /* =========================================
       SEND CHAT
    ========================================= */

    async function sendChatMessage(
        presetMessage
    ) {

        const input =
            el("zevqyn-chat-input");

        const button =
            el("zevqyn-send-message");


        let message =
            presetMessage || "";


        if (!message) {

            if (input) {
                message =
                    input.value.trim();
            }

        }


        if (!message) {
            return;
        }


        if (documents.length === 0) {

            showToast(
                "Upload a research source first.",
                "error"
            );

            return;

        }


     addChatMessage(
            "user",
            message,
            []
        );


        if (input) {
            input.value = "";
        }


        if (button) {
            button.disabled = true;
        }


        const loadingMessage =
            "Thinking from your sources...";


        addChatMessage(
            "assistant",
            loadingMessage,
            []
        );


        const area =
            el("zevqyn-chat-area");

        const messageElements =
            area
                ? area.querySelectorAll(
                    ".zev-message.assistant"
                )
                : [];


        const temporary =
            messageElements.length > 0
                ? messageElements[
                    messageElements.length - 1
                  ]
                : null;


        try {

            const body = {
                message: message
            };


            if (currentConversationId) {

                body.conversation_id =
                    currentConversationId;

            }


            const result =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(body)
                    }
                );


            if (temporary) {
                temporary.remove();
            }


            currentConversationId =
                result.conversation_id;


            addChatMessage(
                "assistant",
                result.answer,
                result.citations || []
            );


            await loadConversations();


        } catch (error) {

            if (temporary) {
                temporary.remove();
            }


            addChatMessage(
                "assistant",
                "I couldn't answer that request. " +
                error.message,
                []
            );


        } finally {

            if (button) {
                button.disabled = false;
            }

        }

    }


    /* =========================================
       TOOL TABS
    ========================================= */

    function switchTool(tool) {

        const tabs =
            document.querySelectorAll(
                ".zev-tool-tab"
            );


        tabs.forEach(
            function (tab) {

                if (
                    tab.getAttribute(
                        "data-tool"
                    ) === tool
                ) {

                    tab.classList.add(
                        "active"
                    );

                } else {

                    tab.classList.remove(
                        "active"
                    );

                }

            }
        );


        const tools =
            [
                "chat",
                "summary",
                "keypoints",
                "questions",
                "flashcards"
            ];


        tools.forEach(
            function (name) {

                const view =
                    el(
                        "zevqyn-view-" +
                        name
                    );


                if (!view) {
                    return;
                }


                if (name === tool) {

                    view.hidden = false;
                    view.classList.add(
                        "active"
                    );

                } else {

                    view.hidden = true;
                    view.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =========================================
       RESEARCH AI COMMON
    ========================================= */

    function ensureDocuments() {

        if (documents.length === 0) {

            showToast(
                "Upload and index at least one source first.",
                "error"
            );

            return false;

        }

        return true;

    }


    function renderCitations(
        citations
    ) {

        if (!Array.isArray(citations)) {
            return "";
        }


        if (citations.length === 0) {
            return "";
        }


        let html =
            '<div class="zev-citations">' +
            '<span class="zev-message-label">SOURCES</span>';


        citations.forEach(
            function (citation) {

                let source =
                    citation.document_name ||
                    "Research source";


                if (citation.page_number) {

                    source +=
                        " · Page " +
                        citation.page_number;

                }


                html +=
                    '<span class="zev-citation">' +
                    '↳ ' +
                    escapeHTML(source) +
                    '</span>';

            }
        );


        html += "</div>";

        return html;

    }


    /* =========================================
       SUMMARY
    ========================================= */

    async function generateSummary() {

        if (!ensureDocuments()) {
            return;
        }


        const button =
            el("zevqyn-generate-summary");

        const content =
            el("zevqyn-summary-content");


        if (button) {

            button.disabled = true;
            button.textContent =
                "Generating...";

        }


        try {

            const result =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/research/summary",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                document_id: null
                            })
                    }
                );


           if (content) {

    content.hidden = false;


    let cleanSummary =
        String(
            result.summary || ""
        );


    /*
       Remove internal RAG source markers:
       [SOURCE_1]
       [SOURCE_1, SOURCE_2]
       [SOURCE_2, SOURCE_5, SOURCE_8]
    */

    cleanSummary =
        cleanSummary.replace(
            /\[\s*SOURCE_\d+(?:\s*,\s*SOURCE_\d+)*\s*\]/gi,
            ""
        );


    /*
       Clean spaces left behind.
    */

    cleanSummary =
        cleanSummary.replace(
            /[ \t]+([.,!?;:])/g,
            "$1"
        );


    cleanSummary =
        cleanSummary.replace(
            /[ \t]{2,}/g,
            " "
        );


    cleanSummary =
        cleanSummary.trim();


    content.innerHTML =
        '<h3>Research Summary</h3>' +

        '<div class="zev-ai-result-card">' +

            escapeHTML(
                cleanSummary
            ).replace(
                /\n/g,
                "<br>"
            ) +

            renderCitations(
                result.citations
            ) +

        '</div>';

}


            hideGenerationEmpty(
                "summary"
            );


        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "✦ Generate Summary";

            }

        }

    }


    /* =========================================
       KEY POINTS
    ========================================= */

    async function generateKeyPoints() {

        if (!ensureDocuments()) {
            return;
        }


        const button =
            el(
                "zevqyn-generate-keypoints"
            );

        const content =
            el(
                "zevqyn-keypoints-content"
            );


        if (button) {

            button.disabled = true;
            button.textContent =
                "Generating...";

        }


        try {

            const result =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/research/key-points",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                document_id: null,
                                count: 8
                            })
                    }
                );


            let html =
                "<h3>Key Points</h3>";


            result.key_points.forEach(
                function (point, index) {

                    html +=
                        '<div class="zev-ai-result-card">' +

                            '<strong>' +
                                (index + 1) +
                                ". " +
                                escapeHTML(
                                    point.text
                                ) +
                            '</strong>' +

                            renderCitations(
                                point.citations
                            ) +

                        '</div>';

                }
            );


            if (content) {

                content.hidden = false;
                content.innerHTML = html;

            }


            hideGenerationEmpty(
                "keypoints"
            );


        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "✦ Generate Key Points";

            }

        }

    }


    /* =========================================
       QUESTIONS
    ========================================= */

    async function generateQuestions() {

        if (!ensureDocuments()) {
            return;
        }


        const button =
            el(
                "zevqyn-generate-questions"
            );

        const content =
            el(
                "zevqyn-questions-content"
            );


        if (button) {

            button.disabled = true;
            button.textContent =
                "Generating...";

        }


        try {

            const result =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/research/questions",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                document_id: null,
                                count: 5
                            })
                    }
                );


            let html =
                "<h3>AI Questions</h3>";


            result.questions.forEach(
                function (item, index) {

                    html +=
                        '<div class="zev-ai-result-card">' +

                            '<strong>' +
                                (index + 1) +
                                ". " +
                                escapeHTML(
                                    item.question
                                ) +
                            '</strong>' +

                            '<div class="zev-result-answer">' +
                                escapeHTML(
                                    item.answer
                                ) +
                            '</div>' +

                            '<span class="zev-difficulty">' +
                                escapeHTML(
                                    item.difficulty
                                ) +
                            '</span>' +

                            renderCitations(
                                item.citations
                            ) +

                        '</div>';

                }
            );


            if (content) {

                content.hidden = false;
                content.innerHTML = html;

            }


            hideGenerationEmpty(
                "questions"
            );


        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "✦ Generate Questions";

            }

        }

    }


    /* =========================================
       FLASHCARDS
    ========================================= */

    async function generateFlashcards() {

        if (!ensureDocuments()) {
            return;
        }


        const button =
            el(
                "zevqyn-generate-flashcards"
            );

        const content =
            el(
                "zevqyn-flashcards-content"
            );


        if (button) {

            button.disabled = true;
            button.textContent =
                "Generating...";

        }


        try {

            const result =
                await apiRequest(
                    "/api/v1/workspaces/" +
                    workspaceId +
                    "/research/flashcards",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                document_id: null,
                                count: 10
                            })
                    }
                );


            let html = "";


            result.flashcards.forEach(
                function (card) {

                    html +=
                        '<div class="zev-flashcard">' +

                            '<div class="zev-flashcard-label">' +
                                'QUESTION' +
                            '</div>' +

                            '<div class="zev-flashcard-front">' +
                                escapeHTML(
                                    card.front
                                ) +
                            '</div>' +

                            '<div class="zev-flashcard-back" hidden>' +

                                '<div class="zev-flashcard-label" style="margin-top:12px;">' +
                                    'ANSWER' +
                                '</div>' +

                                escapeHTML(
                                    card.back
                                ) +

                                renderCitations(
                                    card.citations
                                ) +

                            '</div>' +

                        '</div>';

                }
            );


            if (content) {

                content.hidden = false;
                content.innerHTML = html;


                const cards =
                    content.querySelectorAll(
                        ".zev-flashcard"
                    );


                cards.forEach(
                    function (card) {

                        card.addEventListener(
                            "click",
                            function () {

                                const back =
                                    card.querySelector(
                                        ".zev-flashcard-back"
                                    );


                                if (!back) {
                                    return;
                                }


                                back.hidden =
                                    !back.hidden;

                            }
                        );

                    }
                );

            }


            hideGenerationEmpty(
                "flashcards"
            );


        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "✦ Generate Flashcards";

            }

        }

    }


    function hideGenerationEmpty(
        tool
    ) {

        const view =
            el(
                "zevqyn-view-" +
                tool
            );


        if (!view) {
            return;
        }


        const empty =
            view.querySelector(
                ".zev-generation-empty"
            );


        if (empty) {
            empty.style.display = "none";
        }

    }


    /* =========================================
       RESEARCH -> PROJECT
    ========================================= */

  async function generateProjectPreview() {

    if (!ensureDocuments()) {
        return;
    }

    const button =
        el("zevqyn-convert-project");

    const proposal =
        el("zevqyn-project-proposal");

    if (button) {
        button.disabled = true;
        button.textContent =
            "Generating project...";
    }

    try {

        const result =
            await apiRequest(
                "/api/v1/workspaces/" +
                workspaceId +
                "/research/create-project",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            document_id: null,
                            instructions:
                                "Turn this research into a practical project"
                        })
                }
            );


        /*
           SAVE GENERATED PROPOSAL
        */

        localStorage.setItem(
            "zevqyn_project_preview",
            JSON.stringify(result)
        );

        localStorage.setItem(
            "zevqyn_project_workspace_id",
            workspaceId
        );


        /*
           PROJECT TITLE
        */

        const title =
            el("zevqyn-proposal-title");

        if (title) {
            title.value =
                result.title || "";
        }


        /*
           DESCRIPTION
        */

        const description =
            el("zevqyn-proposal-description");

        if (description) {
            description.value =
                result.description || "";
        }


        /*
           PROBLEM STATEMENT
        */

        const problem =
            el("zevqyn-proposal-problem");

        if (problem) {
            problem.value =
                result.problem_statement || "";
        }


        /*
           SUGGESTED FEATURES
        */

        const features =
            el("zevqyn-proposal-features");

        if (features) {

            features.innerHTML = "";

            const featureList =
                Array.isArray(
                    result.suggested_features
                )
                    ? result.suggested_features
                    : [];

            if (featureList.length === 0) {

                features.innerHTML =
                    '<div class="zev-proposal-empty">' +
                        'No suggested features returned.' +
                    '</div>';

            } else {

                featureList.forEach(
                    function (feature) {

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "zev-proposal-list-item";

                        item.textContent =
                            String(feature);

                        features.appendChild(item);

                    }
                );

            }

        }


        /*
           TECHNOLOGIES
        */

        const technologies =
            el("zevqyn-proposal-technologies");

        if (technologies) {

            technologies.innerHTML = "";

            const technologyList =
                Array.isArray(
                    result.technologies
                )
                    ? result.technologies
                    : [];

            if (technologyList.length === 0) {

                technologies.innerHTML =
                    '<div class="zev-proposal-empty">' +
                        'No technologies suggested.' +
                    '</div>';

            } else {

                technologyList.forEach(
                    function (technology) {

                        const tag =
                            document.createElement(
                                "span"
                            );

                        tag.className =
                            "zev-proposal-tag";

                        tag.textContent =
                            String(technology);

                        technologies.appendChild(tag);

                    }
                );

            }

        }


        /*
           SKILLS
        */

        const skills =
            el("zevqyn-proposal-skills");

        if (skills) {

            skills.innerHTML = "";

            const skillList =
                Array.isArray(
                    result.skills
                )
                    ? result.skills
                    : [];

            if (skillList.length === 0) {

                skills.innerHTML =
                    '<div class="zev-proposal-empty">' +
                        'No skills suggested.' +
                    '</div>';

            } else {

                skillList.forEach(
                    function (skill) {

                        const tag =
                            document.createElement(
                                "span"
                            );

                        tag.className =
                            "zev-proposal-tag";

                        tag.textContent =
                            String(skill);

                        skills.appendChild(tag);

                    }
                );

            }

        }


        /*
           RESEARCH SOURCES
        */

        const sources =
            el("zevqyn-proposal-sources");

        if (sources) {

            sources.innerHTML = "";

            let citationList = [];


            if (
                Array.isArray(
                    result.research_citations
                )
            ) {

                citationList =
                    result.research_citations;

            } else if (
                Array.isArray(
                    result.citations
                )
            ) {

                citationList =
                    result.citations;

            }


            if (citationList.length === 0) {

                sources.innerHTML =
                    '<div class="zev-proposal-empty">' +
                        'This proposal was generated from your workspace research.' +
                    '</div>';

            } else {

                citationList.forEach(
                    function (citation) {

                        const source =
                            document.createElement(
                                "div"
                            );

                        source.className =
                            "zev-proposal-source";


                        let documentName =
                            "Research source";

                        let pageNumber = "";


                        if (
                            typeof citation ===
                            "string"
                        ) {

                            documentName =
                                citation;

                        } else {

                            documentName =
                                citation.document_name ||
                                citation.original_filename ||
                                citation.filename ||
                                "Research source";

                            pageNumber =
                                citation.page_number ||
                                "";

                        }


                        let sourceHTML =
                            '<div class="zev-proposal-source-name">' +
                                escapeHTML(
                                    documentName
                                ) +
                            '</div>';


                        if (pageNumber) {

                            sourceHTML +=
                                '<div class="zev-proposal-source-meta">' +
                                    'Page ' +
                                    escapeHTML(
                                        pageNumber
                                    ) +
                                '</div>';

                        }


                        source.innerHTML =
                            sourceHTML;

                        sources.appendChild(
                            source
                        );

                    }
                );

            }

        }


        /*
           SHOW PROJECT PROPOSAL PANEL
        */

        if (proposal) {

            proposal.hidden = false;

            proposal.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        showToast(
            "Project proposal generated successfully.",
            "success"
        );


        console.log(
            "ZEVQYN project preview:",
            result
        );


    } catch (error) {

        console.error(
            "Project generation error:",
            error
        );


        showToast(
            error.message ||
            "Could not generate project proposal.",
            "error"
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Convert to Project →";

        }

    }

}


    /* =========================================
       SUGGESTED PROMPTS
    ========================================= */

    function setupPromptButtons() {

        const buttons =
            document.querySelectorAll(
                ".zev-suggested-prompts button"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        sendChatMessage(
                            button.textContent.trim()
                        );

                    }
                );

            }
        );

    }


    /* =========================================
       EVENTS
    ========================================= */

    function setupEvents() {

        const uploadButton =
            el("zevqyn-upload-btn");

        const fileInput =
            el("zevqyn-file-input");

        const uploadZone =
            el("zevqyn-upload-zone");

        const sendButton =
            el("zevqyn-send-message");

        const chatInput =
            el("zevqyn-chat-input");

        const newChat =
            el("zevqyn-new-chat");

        const signOut =
            el("zevqyn-signout");

        const deleteCancel =
            el("zevqyn-delete-cancel");

        const deleteConfirm =
            el("zevqyn-delete-confirm");

        const summary =
            el("zevqyn-generate-summary");

        const keypoints =
            el("zevqyn-generate-keypoints");

        const questions =
            el("zevqyn-generate-questions");

        const flashcards =
            el("zevqyn-generate-flashcards");

        const convert =
            el("zevqyn-convert-project");


        if (uploadButton) {

            uploadButton.addEventListener(
                "click",
                function () {

                    if (fileInput) {
                        fileInput.click();
                    }

                }
            );

        }


        if (fileInput) {

            fileInput.addEventListener(
                "change",
                function () {

                    if (
                        fileInput.files.length > 0
                    ) {

                        uploadFile(
                            fileInput.files[0]
                        );

                    }

                    fileInput.value = "";

                }
            );

        }


        if (uploadZone) {

            uploadZone.addEventListener(
                "dragover",
                function (event) {

                    event.preventDefault();

                    uploadZone.classList.add(
                        "dragging"
                    );

                }
            );


            uploadZone.addEventListener(
                "dragleave",
                function () {

                    uploadZone.classList.remove(
                        "dragging"
                    );

                }
            );


            uploadZone.addEventListener(
                "drop",
                function (event) {

                    event.preventDefault();

                    uploadZone.classList.remove(
                        "dragging"
                    );


                    if (
                        event.dataTransfer.files.length > 0
                    ) {

                        uploadFile(
                            event.dataTransfer.files[0]
                        );

                    }

                }
            );

        }


        if (sendButton) {

            sendButton.addEventListener(
                "click",
                function () {
                    sendChatMessage();
                }
            );

        }


        if (chatInput) {

            chatInput.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        if (!event.shiftKey) {

                            event.preventDefault();

                            sendChatMessage();

                        }

                    }

                }
            );

        }


        if (newChat) {

            newChat.addEventListener(
                "click",
                function () {

                    clearChat();

                    showToast(
                        "New conversation started.",
                        "success"
                    );

                }
            );

        }


        const toolTabs =
            document.querySelectorAll(
                ".zev-tool-tab"
            );


        toolTabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        switchTool(
                            tab.getAttribute(
                                "data-tool"
                            )
                        );

                    }
                );

            }
        );


        if (summary) {

            summary.addEventListener(
                "click",
                generateSummary
            );

        }


        if (keypoints) {

            keypoints.addEventListener(
                "click",
                generateKeyPoints
            );

        }


        if (questions) {

            questions.addEventListener(
                "click",
                generateQuestions
            );

        }


        if (flashcards) {

            flashcards.addEventListener(
                "click",
                generateFlashcards
            );

        }


        if (convert) {

            convert.addEventListener(
                "click",
                generateProjectPreview
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
                confirmDeleteDocument
            );

        }

        const deleteConvCancel =
            el("zevqyn-delete-conv-cancel");

        if (deleteConvCancel) {

            deleteConvCancel.addEventListener(
                "click",
                hideDeleteConvModal
            );

        }

        const deleteConvConfirm =
            el("zevqyn-delete-conv-confirm");

        if (deleteConvConfirm) {

            deleteConvConfirm.addEventListener(
                "click",
                confirmDeleteConversation
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


        setupPromptButtons();

    }


    /* =========================================
       START
    ========================================= */

    async function startWorkspace() {

        try {

            workspaceId =
                getWorkspaceId();


            if (!workspaceId) {

                window.location.href =
                    "https://zevqyn.free.je/research/";

                return;

            }


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


            await loadWorkspace();


            await Promise.all([
                loadDocuments(),
                loadConversations()
            ]);


        } catch (error) {

            console.error(
                "ZEVQYN workspace error:",
                error
            );


            showToast(
                error.message ||
                "Could not load workspace.",
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
                startWorkspace();
            }
        );

    } else {

        startWorkspace();

    }

})();
