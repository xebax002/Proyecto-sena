/* api.js — comunicación con el backend PHP (carpeta /api).
   Las rutas son relativas a la página, así que funciona en
   http://localhost/fitlife-gym/ o en cualquier otra carpeta. */
(function () {
    "use strict";

    const FitLife = (window.FitLife = window.FitLife || {});

    class ApiError extends Error {}

    FitLife.api = {
        baseUrl: "api",

        async post(path, body, timeoutMs = 10000) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);

            try {
                const response = await fetch(this.baseUrl + path, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    body: JSON.stringify(body),
                    signal: controller.signal
                });

                let data = null;
                try { data = await response.json(); } catch { /* sin cuerpo JSON */ }

                if (!response.ok) {
                    if (data && data.message) throw new ApiError(data.message);

                    if ([404, 405, 501].includes(response.status)) {
                        throw new ApiError(
                            "No se encontró el servidor PHP. Abre el sitio desde Apache " +
                            "(por ejemplo http://localhost/fitlife-gym/), no con Live Server ni con doble clic."
                        );
                    }
                    throw new ApiError("El servidor respondió con un error (" + response.status + ").");
                }

                if (data === null) {
                    throw new ApiError("El servidor no devolvió una respuesta válida. Revisa que PHP esté activo.");
                }

                return data;
            } catch (err) {
                if (err instanceof ApiError) throw err;
                if (err.name === "AbortError") {
                    throw new Error("El servidor tardó demasiado en responder.");
                }
                throw new Error("No se pudo conectar con el servidor. Revisa que Apache esté encendido.");
            } finally {
                clearTimeout(timer);
            }
        }
    };
})();
