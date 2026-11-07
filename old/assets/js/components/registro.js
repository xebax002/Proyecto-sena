
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRegistro");
    const message = document.getElementById("validation-message");

    if (!form || !message) {
        console.error("No se encontró el formulario de registro.");
        return;
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = `validation-message ${type}`;
        message.style.display = "block";
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const password = document.getElementById("password").value;
        const confirmation =
            document.getElementById("confirmarPassword").value;

        if (password !== confirmation) {
            showMessage("Las contraseñas no coinciden.", "error");
            return;
        }

        const userData = {
            nombre: document.getElementById("nombre").value.trim(),
            pais: document.getElementById("pais").value.trim(),
            ciudad: document.getElementById("ciudad").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            correo: document.getElementById("correo").value.trim()
        };

        showMessage(
            "Datos validados correctamente. Falta conectar el registro al servidor.",
            "success"
        );

        // No se guardan las contraseñas en el navegador.
        // Estos datos pueden enviarse a un backend cuando esté implementado.
        document.dispatchEvent(
            new CustomEvent("registration-validated", {
                detail: { data: userData }
            })
        );
    });
});
