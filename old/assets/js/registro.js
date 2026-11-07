/* registro.js — registro de usuarios (registro.html) */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRegistro");
    const message = document.getElementById("validation-message");
    if (!form || !message) return;

    FitLife.bindForm({
        form,
        message,
        path: "/register.php",
        validate: () =>
            form.password.value !== form.confirmarPassword.value
                ? "Las contraseñas no coinciden."
                : null,
        getPayload: () => ({
            nombre: form.nombre.value.trim(),
            pais: form.pais.value.trim(),
            ciudad: form.ciudad.value.trim(),
            telefono: form.telefono.value.trim(),
            correo: form.correo.value.trim(),
            password: form.password.value
        }),
        onSuccess: () => {
            FitLife.showMessage(message, "Cuenta creada. Ahora puedes iniciar sesión.", "success");
            setTimeout(() => { window.location.href = "index.html"; }, 1200);
        }
    });
});
