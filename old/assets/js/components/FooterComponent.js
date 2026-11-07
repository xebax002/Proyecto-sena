
export class FooterComponent extends HTMLElement {
  constructor() {
    super();

    // Crear el Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });

    // Definir los estilos y la estructura HTML
    shadow.innerHTML = `
      <style>
        /* Estilos del pie de página */
        footer {
          background-color: var(--primary-color, #4CAF50);
          color: white;
          text-align: center;
          padding: 1rem;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          bottom: 0;
        }

        /* Estilos del texto */
        p {
          margin: 0;
          font-family: var(--font-family, 'Arial', sans-serif);
          font-size: 0.9rem;
        }
      </style>

      <!-- Estructura del pie de página -->
      <footer>
        <p id="footer-text">
          &copy; 2026 Sinapsis Technologies. All rights reserved.
        </p>
      </footer>
    `;
  }

  // Configurar el componente cuando se agrega al documento
  connectedCallback() {
    // Obtener el nombre de la empresa desde el atributo
    const company = this.getAttribute('data-company');

    // Actualizar el texto si se proporciona una empresa
    if (company) {
      this.shadowRoot.getElementById('footer-text').textContent =
        `\u00A9 2026 ${company}. All rights reserved.`;
    }
  }
}

// Registrar el componente web personalizado
customElements.define('app-footer', FooterComponent);
