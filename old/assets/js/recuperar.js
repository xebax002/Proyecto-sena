/* recuperar.js — paso 1: pedir el enlace de recuperación (forgot-password.html) */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRecuperar");
    const message = document.getElementById("mensaje");
    if (!form || !message) return;

    FitLife.bindForm({
        form,
        message,
        path: "/password-reset/request.php",
        getPayload: () => ({ correo: form.correo.value.trim() }),
        onSuccess: () => {
            // Mismo mensaje exista o no el correo, para no revelar qué cuentas existen.
            FitLife.showMessage(
                message,
                "Si el correo está registrado, te enviamos un enlace para crear una nueva contraseña.",
                "success"
            );
            form.reset();
        }
    });
});
