/* Cambio-contraseña.js — paso 2: nueva contraseña con el token del enlace
   ("Cambio de contraseña.html?token=...") */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCambio");
    const message = document.getElementById("mensaje");
    if (!form || !message) return;

    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
        FitLife.showMessage(
            message,
            "El enlace no es válido o está incompleto. Solicita uno nuevo desde «Recuperar contraseña».",
            "error"
        );
        form.querySelector('button[type="submit"]').disabled = true;
        return;
    }

    FitLife.bindForm({
        form,
        message,
        path: "/password-reset/confirm.php",
        validate: () =>
            form.password.value !== form.confirmarPassword.value
                ? "Las contraseñas no coinciden."
                : null,
        getPayload: () => ({ token, password: form.password.value }),
        onSuccess: () => {
            FitLife.showMessage(message, "Contraseña actualizada. Redirigiendo al inicio de sesión…", "success");
            setTimeout(() => { window.location.href = "index.html"; }, 1500);
        }
    });
});
