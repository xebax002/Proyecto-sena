/* ui.js — utilidades compartidas por las páginas de cuenta.
   Cargar primero (con defer), antes de api.js y del script de la página. */
(function () {
    "use strict";

    const FitLife = (window.FitLife = window.FitLife || {});

    FitLife.showMessage = function (box, text, type) {
        if (!box) return;
        box.textContent = text;
        box.className = "validation-message " + type; // "error" | "success"
    };

    FitLife.hideMessage = function (box) {
        if (!box) return;
        box.textContent = "";
        box.className = "validation-message";
    };

    /* Conecta un formulario: valida, deshabilita el botón, llama a la API
       y muestra el resultado. */
    FitLife.bindForm = function (opts) {
        const { form, message, path, getPayload, validate, onSuccess } = opts;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            FitLife.hideMessage(message);

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const error = validate ? validate() : null;
            if (error) {
                FitLife.showMessage(message, error, "error");
                return;
            }

            const button = form.querySelector('button[type="submit"]');
            const label = button.textContent;
            button.disabled = true;
            button.textContent = "Enviando…";

            try {
                const data = await FitLife.api.post(path, getPayload());
                onSuccess(data);
            } catch (err) {
                FitLife.showMessage(message, err.message, "error");
            } finally {
                button.disabled = false;
                button.textContent = label;
            }
        });
    };

    /* Mostrar / ocultar contraseña en todos los .password-toggle */
    function initPasswordToggles() {
        document.querySelectorAll(".password-toggle").forEach((button) => {
            const field = button.closest(".password-container")?.querySelector("input");
            const icon = button.querySelector("i");
            if (!field) return;

            const name = button.dataset.label || "contraseña";

            button.addEventListener("click", () => {
                const show = field.type === "password";
                field.type = show ? "text" : "password";

                if (icon) {
                    icon.classList.toggle("fa-eye", !show);
                    icon.classList.toggle("fa-eye-slash", show);
                }

                button.setAttribute("aria-label", (show ? "Ocultar " : "Mostrar ") + name);
            });
        });
    }

    document.addEventListener("DOMContentLoaded", initPasswordToggles);
})();
