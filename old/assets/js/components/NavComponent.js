
export class NavComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        /* Estilos del encabezado */
        header {
          background-color: var(--primary-color, #4CAF50);
          color: white;
          padding: 1rem;
          text-align: center;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }

        /* Título principal */
        h1 {
          margin: 0;
          font-size: 1.5rem;
        }

        /* Menú de navegación */
        nav {
          display: flex;
          margin-left: auto;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
        }

        li {
          margin: 0 1rem;
        }

        /* Enlaces */
        a {
          color: white;
          text-decoration: none;
          font-family: var(--font-family, 'Arial', sans-serif);
        }

        a:hover {
          text-decoration: underline;
        }

        a.active {
          font-weight: bold;
          border-bottom: 2px solid white;
        }

        /* Botón del menú móvil */
        .toggle-button {
          display: none;
          background: transparent;
          color: white;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          margin-left: auto;
        }

        /* Diseño adaptable para dispositivos móviles */
        @media (max-width: 600px) {
          .toggle-button {
            display: block;
          }

          nav {
            display: none;
            position: absolute;
            top: 60px;
            right: 10px;
            background-color: var(--primary-color, #4CAF50);
            width: 200px;
            border-radius: var(--border-radius, 5px);
            box-shadow: var(
              --box-shadow,
              0 2px 4px rgba(0, 0, 0, 0.1)
            );
            padding: 0.5rem 0;
          }

          nav.show {
            display: flex;
            flex-direction: column;
          }

          nav ul {
            flex-direction: column;
            width: 100%;
          }

          nav li {
            margin: 0.5rem 0;
            text-align: center;
            width: 100%;
          }
        }
      </style>

      <!-- Estructura del encabezado -->
      <header>
        <h1 id="title-text">Sistema Web</h1>

        <button
          class="toggle-button"
          id="toggle-btn"
          aria-label="Abrir menú de navegación"
          aria-expanded="false"
        >
          ☰
        </button>

        <nav id="nav-menu">
          <ul>
            <li>
              <a href="#" class="active" data-route="login">
                Login
              </a>
            </li>

            <li>
              <a href="#" data-route="register">
                Registro
              </a>
            </li>

            <li>
              <a href="#" data-route="forgot">
                Recuperar
              </a>
            </li>
          </ul>
        </nav>
      </header>
    `;
  }

  /* Inicialización del componente */
  connectedCallback() {
    // Configurar el título personalizado
    const titleAttr = this.getAttribute('data-title');

    if (titleAttr) {
      this.shadowRoot.getElementById('title-text').textContent =
        titleAttr;
    }

    // Obtener elementos del menú
    const toggleBtn =
      this.shadowRoot.getElementById('toggle-btn');

    const navMenu =
      this.shadowRoot.getElementById('nav-menu');

    // Mostrar u ocultar el menú móvil
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('show');

      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.setAttribute(
        'aria-label',
        isOpen
          ? 'Cerrar menú de navegación'
          : 'Abrir menú de navegación'
      );
    });

    // Gestionar la navegación entre rutas
    this.shadowRoot.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const route = e.currentTarget.getAttribute('data-route');

        // Actualizar el enlace activo
        this.shadowRoot.querySelectorAll('a').forEach((item) => {
          item.classList.remove('active');
        });

        e.currentTarget.classList.add('active');

        // Emitir el evento de navegación
        this.dispatchEvent(
          new CustomEvent('app-navigate', {
            detail: { route },
            bubbles: true,
            composed: true
          })
        );

        // Cerrar el menú móvil después de seleccionar una ruta
        navMenu.classList.remove('show');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute(
          'aria-label',
          'Abrir menú de navegación'
        );
      });
    });
  }
}

// Registrar el componente web personalizado
customElements.define('app-nav', NavComponent);
