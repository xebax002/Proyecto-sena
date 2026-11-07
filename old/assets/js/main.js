/* main.js — inicio de sesión (index.html) */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");
    const message = document.getElementById("login-message");
    if (!form || !message) return;

    FitLife.bindForm({
        form,
        message,
        path: "/login.php",
        getPayload: () => ({
            correo: form.correo.value.trim(),
            password: form.password.value
        }),
        onSuccess: () => {
            FitLife.showMessage(message, "Sesión iniciada. Redirigiendo…", "success");
            setTimeout(() => { window.location.href = "PAGINA%20WEB.html"; }, 800);
        }
    });
});
