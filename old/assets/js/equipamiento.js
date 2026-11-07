/* equipamiento.js — filtro por categoría (treadmill.html) */
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".pestana");
    const machines = document.querySelectorAll(".maquina");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const filter = tab.dataset.filtro;

            tabs.forEach((t) => t.setAttribute("aria-pressed", String(t === tab)));
            machines.forEach((m) => {
                m.hidden = filter !== "todas" && m.dataset.categoria !== filter;
            });
        });
    });
});
