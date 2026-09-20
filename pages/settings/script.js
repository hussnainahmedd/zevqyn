
function zevSettingsInitialize() {

    var SUPABASE_URL = "https://phjizxajnigiiawitkyx.supabase.co";

    var SUPABASE_ANON_KEY =
        "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";


    var loading = document.getElementById("zev-settings-loading");
    var messageBox = document.getElementById("zev-settings-message");

    var accountEmail = document.getElementById("zev-account-email");
    var sessionStatus = document.getElementById("zev-session-status");

    var detailEmail = document.getElementById("zev-detail-email");
    var detailUserId = document.getElementById("zev-detail-user-id");
    var createdAt = document.getElementById("zev-created-at");
    var lastSignIn = document.getElementById("zev-last-sign-in");

    var authBadge = document.getElementById("zev-auth-badge");

    var userName = document.getElementById("zev-user-name");
    var userEmailTop = document.getElementById("zev-user-email-top");
    var userAvatar = document.getElementById("zev-user-avatar");

    var passwordForm = document.getElementById("zev-password-form");
    var newPassword = document.getElementById("zev-new-password");
    var confirmPassword = document.getElementById("zev-confirm-password");

    var changePasswordBtn =
        document.getElementById("zev-change-password-btn");

    var resetPasswordBtn =
        document.getElementById("zev-reset-password-btn");

    var signOutBtn =
        document.getElementById("zev-sign-out-btn");

    var copyUserIdBtn =
        document.getElementById("zev-copy-user-id");


    function hideLoading() {
        if (loading) {
            loading.classList.add("hidden");
        }
    }


    function showMessage(text, type) {

        if (!messageBox) {
            return;
        }

        messageBox.textContent = text;

        messageBox.className =
            "zev-message " + (type || "info");

        messageBox.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    function clearMessage() {

        if (!messageBox) {
            return;
        }

        messageBox.hidden = true;
        messageBox.textContent = "";
        messageBox.className = "zev-message";
    }


    function formatDate(value) {

        if (!value) {
            return "Not available";
        }

        var date = new Date(value);

        if (isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }


    function getDisplayName(user) {

        if (!user) {
            return "ZEVQYN User";
        }

        var metadata = user.user_metadata || {};

        if (metadata.full_name) {
            return metadata.full_name;
        }

        if (metadata.name) {
            return metadata.name;
        }

        if (user.email) {
            var emailParts = user.email.split("@");

            if (emailParts.length > 0) {
                return emailParts[0];
            }
        }

        return "ZEVQYN User";
    }


    function getInitial(name) {

        if (!name) {
            return "Z";
        }

        return name
            .trim()
            .charAt(0)
            .toUpperCase() || "Z";
    }


    function setButtonLoading(button, isLoading, loadingText) {

        if (!button) {
            return;
        }

        if (isLoading) {

            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent;
            }

            button.disabled = true;
            button.textContent = loadingText;

            return;
        }

        button.disabled = false;

        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }


    if (typeof window.supabase === "undefined") {

        hideLoading();

        showMessage(
            "Supabase library could not be loaded on this page.",
            "error"
        );

        return;
    }


    var supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


    async function loadAccount() {

        try {

            var userResponse =
                await supabaseClient.auth.getUser();

            if (userResponse.error) {
                throw userResponse.error;
            }

            var user = userResponse.data.user;

            if (!user) {

                window.location.href = "/login/";
                return;
            }


            var displayName = getDisplayName(user);


            if (accountEmail) {
                accountEmail.textContent =
                    user.email || "Not available";
            }


            if (sessionStatus) {
                sessionStatus.textContent = "Authenticated";
            }


            if (detailEmail) {
                detailEmail.textContent =
                    user.email || "Not available";
            }


            if (detailUserId) {
                detailUserId.textContent =
                    user.id || "Not available";
            }


            if (createdAt) {
                createdAt.textContent =
                    formatDate(user.created_at);
            }


            if (lastSignIn) {
                lastSignIn.textContent =
                    formatDate(user.last_sign_in_at);
            }


            if (authBadge) {
                authBadge.textContent = "Authenticated";
                authBadge.classList.add("active");
            }


            if (userName) {
                userName.textContent = displayName;
            }


            if (userEmailTop) {
                userEmailTop.textContent =
                    user.email || "";
            }


            if (userAvatar) {
                userAvatar.textContent =
                    getInitial(displayName);
            }


            hideLoading();

        } catch (error) {

            hideLoading();

            showMessage(
                error.message ||
                "Unable to load your account information.",
                "error"
            );
        }
    }


    if (passwordForm) {

        passwordForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();
                clearMessage();


                var password =
                    newPassword.value || "";

                var confirmation =
                    confirmPassword.value || "";


                if (password.length < 8) {

                    showMessage(
                        "Your new password must contain at least 8 characters.",
                        "error"
                    );

                    return;
                }


                if (password !== confirmation) {

                    showMessage(
                        "The password confirmation does not match.",
                        "error"
                    );

                    return;
                }


                setButtonLoading(
                    changePasswordBtn,
                    true,
                    "Updating..."
                );


                try {

                    var updateResponse =
                        await supabaseClient.auth.updateUser({
                            password: password
                        });


                    if (updateResponse.error) {
                        throw updateResponse.error;
                    }


                    newPassword.value = "";
                    confirmPassword.value = "";


                    showMessage(
                        "Your password has been updated successfully.",
                        "success"
                    );

                } catch (error) {

                    showMessage(
                        error.message ||
                        "Unable to update your password.",
                        "error"
                    );

                } finally {

                    setButtonLoading(
                        changePasswordBtn,
                        false
                    );
                }
            }
        );
    }


    if (resetPasswordBtn) {

        resetPasswordBtn.addEventListener(
            "click",
            async function () {

                clearMessage();


                setButtonLoading(
                    resetPasswordBtn,
                    true,
                    "Sending..."
                );


                try {

                    var userResponse =
                        await supabaseClient.auth.getUser();


                    if (userResponse.error) {
                        throw userResponse.error;
                    }


                    var user = userResponse.data.user;


                    if (!user) {
                        throw new Error(
                            "No authenticated user was found."
                        );
                    }


                    if (!user.email) {
                        throw new Error(
                            "No email address is associated with this account."
                        );
                    }


                    var redirectUrl =
                        window.location.origin + "/settings/";


                    var resetResponse =
                        await supabaseClient.auth.resetPasswordForEmail(
                            user.email,
                            {
                                redirectTo: redirectUrl
                            }
                        );


                    if (resetResponse.error) {
                        throw resetResponse.error;
                    }


                    showMessage(
                        "Password reset email sent to " +
                        user.email +
                        ". Check your inbox.",
                        "success"
                    );

                } catch (error) {

                    showMessage(
                        error.message ||
                        "Unable to send the password reset email.",
                        "error"
                    );

                } finally {

                    setButtonLoading(
                        resetPasswordBtn,
                        false
                    );
                }
            }
        );
    }


    if (signOutBtn) {

        signOutBtn.addEventListener(
            "click",
            async function () {

                clearMessage();


                var shouldSignOut = window.confirm(
                    "Are you sure you want to sign out of ZEVQYN?"
                );


                if (!shouldSignOut) {
                    return;
                }


                setButtonLoading(
                    signOutBtn,
                    true,
                    "Signing Out..."
                );


                try {

                    var signOutResponse =
                        await supabaseClient.auth.signOut();


                    if (signOutResponse.error) {
                        throw signOutResponse.error;
                    }


                    window.location.href = "/login/";

                } catch (error) {

                    setButtonLoading(
                        signOutBtn,
                        false
                    );


                    showMessage(
                        error.message ||
                        "Unable to sign out.",
                        "error"
                    );
                }
            }
        );
    }


    if (copyUserIdBtn) {

        copyUserIdBtn.addEventListener(
            "click",
            async function () {

                var value =
                    detailUserId ?
                    detailUserId.textContent :
                    "";


                if (!value) {
                    return;
                }


                if (value === "—") {
                    return;
                }


                try {

                    await navigator.clipboard.writeText(value);

                    copyUserIdBtn.textContent = "Copied";

                    window.setTimeout(
                        function () {
                            copyUserIdBtn.textContent = "Copy";
                        },
                        1500
                    );

                } catch (error) {

                    showMessage(
                        "Could not copy the User ID automatically.",
                        "error"
                    );
                }
            }
        );
    }


    var passwordToggles =
        document.querySelectorAll(
            "#zev-settings-app .zev-password-toggle"
        );


    passwordToggles.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    var targetId =
                        button.getAttribute("data-target");

                    var input =
                        document.getElementById(targetId);


                    if (!input) {
                        return;
                    }


                    if (input.type === "password") {

                        input.type = "text";
                        button.textContent = "Hide";

                    } else {

                        input.type = "password";
                        button.textContent = "Show";
                    }
                }
            );
        }
    );


    loadAccount();
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            zevSettingsInitialize();
        }
    );

} else {

    zevSettingsInitialize();
}
