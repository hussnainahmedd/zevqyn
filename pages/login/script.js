
(function () {

    const SUPABASE_URL = "https://phjizxajnigiiawitkyx.supabase.co";
    const SUPABASE_KEY = "sb_publishable_oYTMqlTbVsNqToWxvq6I9w_pQ9NFZWk";

    function showMessage(text, type) {

        let message =
            document.getElementById("zevqyn-login-message");

        if (!message) {
            message = document.createElement("div");
            message.id = "zevqyn-login-message";

            const button =
                document.getElementById("zevqyn-login-btn");

            button.insertAdjacentElement(
                "afterend",
                message
            );
        }

        message.textContent = text;

        message.style.display = "block";
        message.style.marginTop = "16px";
        message.style.padding = "12px 14px";
        message.style.borderRadius = "10px";
        message.style.textAlign = "center";
        message.style.fontSize = "14px";

        if (type === "success") {

            message.style.color = "#63df83";
            message.style.background =
                "rgba(54,180,90,0.10)";
            message.style.border =
                "1px solid rgba(54,180,90,0.25)";

        } else {

            message.style.color = "#ff7b7b";
            message.style.background =
                "rgba(255,80,80,0.08)";
            message.style.border =
                "1px solid rgba(255,80,80,0.20)";
        }
    }


    function loadSupabase() {

        return new Promise(function (resolve, reject) {

            if (window.supabase) {
                resolve();
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";

            script.onload = function () {
                resolve();
            };

            script.onerror = function () {
                reject(
                    new Error("Could not load Supabase.")
                );
            };

            document.head.appendChild(script);
        });
    }


    async function startLogin() {

        console.log("ZEVQYN: Login starting");

        const button =
            document.getElementById("zevqyn-login-btn");

        const emailInput =
            document.getElementById("zevqyn-email");

        const passwordInput =
            document.getElementById("zevqyn-password");

        if (!button) {
            console.error(
                "ZEVQYN: Login button not found"
            );
            return;
        }


        try {

            await loadSupabase();

        } catch (error) {

            showMessage(
                "Login service could not be loaded.",
                "error"
            );

            return;
        }


        const client =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        console.log("ZEVQYN: LOGIN READY");


        button.onclick = async function (event) {

            event.preventDefault();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            if (!email) {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );

                return;
            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                return;
            }


            button.disabled = true;
            button.textContent = "Signing In...";


            try {

                console.log(
                    "ZEVQYN: Signing in..."
                );


                const result =
                    await client.auth.signInWithPassword({
                        email: email,
                        password: password
                    });


                if (result.error) {
                    throw result.error;
                }


                console.log(
                    "ZEVQYN: Login successful",
                    result.data.user
                );


                showMessage(
                    "Login successful! Redirecting...",
                    "success"
                );


                setTimeout(function () {

                    window.location.href =
                        "https://zevqyn.free.je/dashboard/";

                }, 700);


            } catch (error) {

                console.error(
                    "ZEVQYN LOGIN ERROR:",
                    error
                );


                let errorMessage =
                    "Unable to sign in.";

                if (error) {
                    errorMessage = error.message;
                }


                showMessage(
                    errorMessage,
                    "error"
                );


            } finally {

                button.disabled = false;
                button.textContent = "Sign In";
            }
        };


        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {
                    event.preventDefault();
                    button.click();
                }
            }
        );


        const sessionResult =
            await client.auth.getSession();

        if (sessionResult.data.session) {

            console.log(
                "ZEVQYN: Existing session found"
            );
        }
    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            startLogin
        );

    } else {

        startLogin();
    }

})();
