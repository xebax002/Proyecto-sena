/* sesion.js — menú de la página de inicio según haya sesión o no. */
document.addEventListener("DOMContentLoaded", async () => {
    const links = document.querySelectorAll(".opciones .opcion-cuenta");
    if (links.length < 2) return;

    try {
        const response = await fetch("api/me.php", { credentials: "same-origin" });
        const data = await response.json();
        if (!data.autenticado) return;

        const [saludo, salir] = links;

        saludo.textContent = "Hola, " + (data.nombre || "usuario");
        saludo.removeAttribute("href");
        saludo.style.cursor = "default";

        salir.textContent = "Cerrar sesión";
        salir.href = "#";
        salir.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                await fetch("api/logout.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    body: "{}"
                });
            } finally {
                window.location.reload();
            }
        });
    } catch {
        /* Sin backend disponible: se deja el menú con "Iniciar sesión" y "Registrarse". */
    }
});
