(function () {
    "use strict";

    var API_BASE = "https://zevqyn-backend.onrender.com/api/v1";
    var SUPABASE_URL = "https://phjizxajnigiiawitkyx.supabase.co";
    var SUPABASE_KEY = "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

    var supabaseClient = null;
    var session = null;

    var workspacesMap = {};
    var allWorkspaces = [];
    var documents = [];

    var activeSearch = "";
    var activeWorkspaceId = "";
    var activeFileType = "";
    var activeStatus = "";

    var limit = 50;
    var offset = 0;
    var isLoading = false;
    var hasMore = false;
    var searchTimer = null;
    var toastTimer = null;

    function el(id) {
        return document.getElementById(id);
    }

    function escapeHtml(text) {
        if (!text) {
            return "";
        }
        var div = document.createElement("div");
        div.textContent = String(text);
        return div.innerHTML;
    }

    function showToast(message, type) {
        var toast = el("zevqyn-toast");
        if (!toast) {
            return;
        }

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toast.textContent = message;
        toast.className = "zev-toast " + (type || "");
        toast.hidden = false;

        toastTimer = setTimeout(function () {
            toast.hidden = true;
        }, 3500);
    }

    function loadSupabaseLibrary() {
        return new Promise(function (resolve, reject) {
            if (window.supabase) {
                resolve();
                return;
            }

            var script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
            script.async = true;

            script.onload = function () {
                resolve();
            };

            script.onerror = function () {
                reject(new Error("Failed to load Supabase SDK"));
            };

            document.head.appendChild(script);
        });
    }

    function apiRequest(path, options) {
        if (!session) {
            throw new Error("Authentication required.");
        }

        var config = options || {};
        var headers = config.headers || {};

        headers["Authorization"] = "Bearer " + session.access_token;
        headers["Accept"] = "application/json";

        return fetch(API_BASE + path, {
            method: config.method || "GET",
            headers: headers,
            body: config.body
        }).then(function (response) {
            if (response.status === 401) {
                window.location.href = "/login/";
                throw new Error("Session expired.");
            }

            return response.text().then(function (text) {
                var data = null;
                if (text) {
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        data = null;
                    }
                }

                if (!response.ok) {
                    var msg = "Request failed.";
                    if (data) {
                        if (typeof data.detail === "string") {
                            msg = data.detail;
                        }
                    }
                    throw new Error(msg);
                }

                return data;
            });
        });
    }

    function formatFileSize(bytes) {
        if (!bytes) {
            return "0 B";
        }
        var num = Number(bytes);
        if (num < 1024) {
            return num + " B";
        }
        if (num < 1024 * 1024) {
            return (num / 1024).toFixed(1) + " KB";
        }
        return (num / (1024 * 1024)).toFixed(1) + " MB";
    }

    function formatDate(dateStr) {
        if (!dateStr) {
            return "";
        }
        try {
            var d = new Date(dateStr);
            return d.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch (e) {
            return "";
        }
    }

    async function loadWorkspaces() {
        try {
            var result = await apiRequest("/workspaces");
            if (Array.isArray(result)) {
                allWorkspaces = result;
                workspacesMap = {};
                var select = el("zevqyn-filter-workspace");

                result.forEach(function (ws) {
                    workspacesMap[ws.id] = ws.title || "Untitled Workspace";

                    if (select) {
                        var opt = document.createElement("option");
                        opt.value = ws.id;
                        opt.textContent = ws.title || "Untitled Workspace";
                        select.appendChild(opt);
                    }
                });

                var wsCount = el("zevqyn-doc-workspace-count");
                if (wsCount) {
                    wsCount.textContent = result.length;
                }
            }
        } catch (error) {
            console.error("Failed to load workspaces for documents:", error);
        }
    }

    async function loadDocuments(isLoadMore) {
        if (isLoading) {
            return;
        }

        isLoading = true;
        var loadingEl = el("zevqyn-docs-loading");
        var loadMoreBtn = el("zevqyn-load-more-btn");
        var paginationEl = el("zevqyn-docs-pagination");

        if (isLoadMore) {
            if (loadMoreBtn) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = "Loading...";
            }
        } else {
            offset = 0;
            if (loadingEl) {
                loadingEl.hidden = false;
            }
        }

        var queryParts = [
            "limit=" + limit,
            "offset=" + offset
        ];

        if (activeSearch) {
            queryParts.push("search=" + encodeURIComponent(activeSearch));
        }
        if (activeWorkspaceId) {
            queryParts.push("workspace_id=" + encodeURIComponent(activeWorkspaceId));
        }
        if (activeFileType) {
            queryParts.push("file_type=" + encodeURIComponent(activeFileType));
        }
        if (activeStatus) {
            queryParts.push("status=" + encodeURIComponent(activeStatus));
        }

        try {
            var result = await apiRequest("/documents?" + queryParts.join("&"));
            var fetched = Array.isArray(result) ? result : [];

            if (isLoadMore) {
                documents = documents.concat(fetched);
            } else {
                documents = fetched;
            }

            if (fetched.length === limit) {
                hasMore = true;
                offset = offset + limit;
            } else {
                hasMore = false;
            }

            renderDocuments();
            updateStats();

            if (paginationEl) {
                paginationEl.hidden = !hasMore;
            }
        } catch (error) {
            console.error("Failed to fetch documents:", error);
            showToast("Failed to load documents: " + error.message, "error");
        } finally {
            isLoading = false;
            if (loadingEl) {
                loadingEl.hidden = true;
            }
            if (loadMoreBtn) {
                loadMoreBtn.disabled = false;
                loadMoreBtn.textContent = "Load More Documents";
            }
        }
    }

    function renderDocuments() {
        var grid = el("zevqyn-docs-grid");
        var emptyEl = el("zevqyn-no-docs");
        var countLabel = el("zevqyn-docs-count-label");

        if (!grid) {
            return;
        }

        grid.innerHTML = "";

        if (countLabel) {
            var count = documents.length;
            countLabel.textContent = "Showing " + count + " document" + (count === 1 ? "" : "s");
        }

        if (documents.length === 0) {
            if (emptyEl) {
                emptyEl.hidden = false;
                var title = el("zevqyn-empty-title");
                var desc = el("zevqyn-empty-desc");
                var action = el("zevqyn-empty-action");

                var hasFilters = false;
                if (activeSearch) {
                    hasFilters = true;
                }
                if (activeWorkspaceId) {
                    hasFilters = true;
                }
                if (activeFileType) {
                    hasFilters = true;
                }
                if (activeStatus) {
                    hasFilters = true;
                }

                if (hasFilters) {
                    if (title) {
                        title.textContent = "No documents match your filters";
                    }
                    if (desc) {
                        desc.textContent = "Try clearing your search keyword, workspace, or file type filters.";
                    }
                    if (action) {
                        action.textContent = "Reset Filters";
                        action.href = "#";
                        action.onclick = function (e) {
                            e.preventDefault();
                            resetFilters();
                        };
                    }
                } else {
                    if (title) {
                        title.textContent = "No documents yet";
                    }
                    if (desc) {
                        desc.textContent = "Upload documents inside a research workspace to see them in your central library.";
                    }
                    if (action) {
                        action.textContent = "Go to Research Hub";
                        action.href = "/research/";
                        action.onclick = null;
                    }
                }
            }
            return;
        }

        if (emptyEl) {
            emptyEl.hidden = true;
        }

        documents.forEach(function (doc) {
            var card = document.createElement("div");
            card.className = "zev-doc-card";

            var fileType = (doc.file_type || "pdf").toLowerCase().replace(/^\./, "");
            var status = (doc.status || "uploaded").toLowerCase();
            var wsTitle = workspacesMap[doc.workspace_id] || "Workspace " + String(doc.workspace_id).slice(0, 8);

            var head = document.createElement("div");
            head.className = "zev-doc-card-head";

            var badge = document.createElement("span");
            badge.className = "zev-doc-badge " + fileType;
            badge.textContent = fileType.toUpperCase();

            var pill = document.createElement("span");
            pill.className = "zev-doc-status-pill " + status;
            pill.textContent = status;

            head.appendChild(badge);
            head.appendChild(pill);

            var body = document.createElement("div");
            body.className = "zev-doc-card-body";

            var titleH4 = document.createElement("h4");
            titleH4.textContent = doc.original_filename || "Untitled Document";
            titleH4.title = doc.original_filename || "";

            var metaRow = document.createElement("div");
            metaRow.className = "zev-doc-meta-row";

            var wsSpan = document.createElement("span");
            wsSpan.className = "zev-doc-workspace-name";
            wsSpan.textContent = "▣ " + wsTitle;

            var dateSpan = document.createElement("span");
            dateSpan.textContent = "Uploaded " + formatDate(doc.created_at);

            metaRow.appendChild(wsSpan);
            metaRow.appendChild(dateSpan);

            body.appendChild(titleH4);
            body.appendChild(metaRow);

            var foot = document.createElement("div");
            foot.className = "zev-doc-card-footer";

            var sizeSpan = document.createElement("span");
            sizeSpan.className = "zev-doc-size";
            sizeSpan.textContent = formatFileSize(doc.file_size);

            var openLink = document.createElement("a");
            openLink.className = "zev-open-ws-btn";
            openLink.href = "/research-workspace/?id=" + encodeURIComponent(doc.workspace_id);
            openLink.textContent = "Open in Workspace →";

            foot.appendChild(sizeSpan);
            foot.appendChild(openLink);

            card.appendChild(head);
            card.appendChild(body);
            card.appendChild(foot);

            grid.appendChild(card);
        });
    }

    function updateStats() {
        var totalEl = el("zevqyn-doc-total-count");
        var readyEl = el("zevqyn-doc-ready-count");

        if (totalEl) {
            totalEl.textContent = documents.length;
        }

        if (readyEl) {
            var readyCount = 0;
            documents.forEach(function (doc) {
                var s = String(doc.status || "").toLowerCase();
                if (s === "indexed") {
                    readyCount += 1;
                }
                if (s === "ready") {
                    readyCount += 1;
                }
                if (s === "processed") {
                    readyCount += 1;
                }
            });
            readyEl.textContent = readyCount;
        }
    }

    function resetFilters() {
        activeSearch = "";
        activeWorkspaceId = "";
        activeFileType = "";
        activeStatus = "";

        var searchInput = el("zevqyn-docs-search");
        if (searchInput) {
            searchInput.value = "";
        }
        var wsSelect = el("zevqyn-filter-workspace");
        if (wsSelect) {
            wsSelect.value = "";
        }
        var typeSelect = el("zevqyn-filter-type");
        if (typeSelect) {
            typeSelect.value = "";
        }
        var statusSelect = el("zevqyn-filter-status");
        if (statusSelect) {
            statusSelect.value = "";
        }

        loadDocuments(false);
    }

    function bindEvents() {
        var searchInput = el("zevqyn-docs-search");
        if (searchInput) {
            searchInput.addEventListener("input", function () {
                if (searchTimer) {
                    clearTimeout(searchTimer);
                }
                searchTimer = setTimeout(function () {
                    activeSearch = searchInput.value.trim();
                    loadDocuments(false);
                }, 300);
            });
        }

        var wsSelect = el("zevqyn-filter-workspace");
        if (wsSelect) {
            wsSelect.addEventListener("change", function () {
                activeWorkspaceId = wsSelect.value;
                loadDocuments(false);
            });
        }

        var typeSelect = el("zevqyn-filter-type");
        if (typeSelect) {
            typeSelect.addEventListener("change", function () {
                activeFileType = typeSelect.value;
                loadDocuments(false);
            });
        }

        var statusSelect = el("zevqyn-filter-status");
        if (statusSelect) {
            statusSelect.value = "";
            statusSelect.addEventListener("change", function () {
                activeStatus = statusSelect.value;
                loadDocuments(false);
            });
        }

        var resetBtn = el("zevqyn-reset-filters");
        if (resetBtn) {
            resetBtn.addEventListener("click", resetFilters);
        }

        var loadMoreBtn = el("zevqyn-load-more-btn");
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener("click", function () {
                loadDocuments(true);
            });
        }

        var signOut = el("zevqyn-signout");
        if (signOut) {
            signOut.addEventListener("click", async function (e) {
                e.preventDefault();
                if (supabaseClient) {
                    await supabaseClient.auth.signOut();
                }
                window.location.href = "/login/";
            });
        }
    }

    function initUser(user) {
        var nameEl = el("zevqyn-user-name");
        var emailEl = el("zevqyn-user-email");
        var avatarEl = el("zevqyn-user-avatar");

        var email = user.email || "";
        var name = (user.user_metadata && user.user_metadata.full_name) || email.split("@")[0] || "User";

        if (nameEl) {
            nameEl.textContent = name;
        }
        if (emailEl) {
            emailEl.textContent = email;
        }
        if (avatarEl) {
            avatarEl.textContent = name.charAt(0).toUpperCase();
        }
    }

    function init() {
        loadSupabaseLibrary()
            .then(function () {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                return supabaseClient.auth.getSession();
            })
            .then(async function (res) {
                if (!res.data || !res.data.session) {
                    window.location.href = "/login/";
                    return;
                }

                session = res.data.session;
                initUser(session.user);
                bindEvents();

                await loadWorkspaces();
                await loadDocuments(false);
            })
            .catch(function (error) {
                console.error("Initialization error:", error);
                window.location.href = "/login/";
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
