
(function () {

    const SUPABASE_URL = "https://phjizxajnigiiawitkyx.supabase.co";
    const SUPABASE_KEY = "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

    function showMessage(text, type) {
        const message = document.getElementById("zevqyn-register-message");

        if (!message) {
            alert(text);
            return;
        }

        message.textContent = text;
        message.className = type;
        message.style.display = "block";
    }

    function loadSupabase() {
        return new Promise(function (resolve, reject) {

            if (window.supabase) {
                resolve();
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";

            script.onload = function () {
                resolve();
            };

            script.onerror = function () {
                reject(new Error("Could not load Supabase."));
            };

            document.head.appendChild(script);
        });
    }

    async function startRegister() {

        console.log("ZEVQYN: Register starting");

        const form = document.getElementById("zevqyn-register-form");
        const button = document.getElementById("zevqyn-register-btn");

        if (!form || !button) {
            console.error("ZEVQYN: Register form not found");
            return;
        }

        try {
            await loadSupabase();
        } catch (error) {
            showMessage("Registration service could not be loaded.", "error");
            return;
        }

        const client = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        console.log("ZEVQYN: REGISTER READY");

        form.onsubmit = async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("zevqyn-name").value.trim();

            const email =
                document.getElementById("zevqyn-email").value.trim();

            const password =
                document.getElementById("zevqyn-password").value;

            const confirmPassword =
                document.getElementById("zevqyn-confirm-password").value;

            if (!name) {
                showMessage("Please enter your full name.", "error");
                return false;
            }

            if (!email) {
                showMessage("Please enter your email address.", "error");
                return false;
            }

            if (password.length < 6) {
                showMessage(
                    "Password must be at least 6 characters.",
                    "error"
                );
                return false;
            }

            if (password !== confirmPassword) {
                showMessage("Passwords do not match.", "error");
                return false;
            }

            button.disabled = true;
            button.textContent = "Creating Account...";

            const message =
                document.getElementById("zevqyn-register-message");

            if (message) {
                message.style.display = "none";
            }

            try {

                console.log("ZEVQYN: Sending ONE signup request");

                const result = await client.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name
                        },
                        emailRedirectTo:
                            "https://zevqyn.free.je/login/"
                    }
                });

                if (result.error) {
                    throw result.error;
                }

                console.log(
                    "ZEVQYN: Signup successful",
                    result.data.user
                );

                if (!result.data.session) {

                    showMessage(
                        "Account created successfully! Check your email to verify your account.",
                        "success"
                    );

                    form.reset();
                    return false;
                }

                showMessage(
                    "Account created successfully! Redirecting...",
                    "success"
                );

                setTimeout(function () {
                    window.location.href =
                        "https://zevqyn.free.je/dashboard/";
                }, 1000);

            } catch (error) {

                console.error("ZEVQYN SIGNUP ERROR:", error);

                let errorMessage =
                    "Unable to create your account.";

                if (error) {
                    errorMessage = error.message;
                }

                showMessage(errorMessage, "error");

            } finally {

                button.disabled = false;
                button.textContent = "Create Account";
            }

            return false;
        };
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            startRegister
        );

    } else {

        startRegister();
    }

})();
