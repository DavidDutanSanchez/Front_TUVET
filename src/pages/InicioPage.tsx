import { Link } from 'react-router-dom'

import './InicioPage.css'

const WHATSAPP_NUMBER = '593980743705'

const WHATSAPP =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola TuVet 👋, quisiera recibir información y agendar una cita para mi mascota.'
  )}`

const FACEBOOK =
  'https://www.facebook.com/share/1HKnpedQWL/?mibextid=wwXIfr'

const INSTAGRAM =
  'https://www.instagram.com/tuvet_centro.veterinario?stkn=emprNTI4dW4ycnk='

const MAP_URL =
  'https://www.google.com/maps?q=669Q%2BF2W%2C+Paute%2C+Ecuador&output=embed'

const MAP_LINK =
  'https://maps.app.goo.gl/Tuzm6PuWKmtJjdudA'

const servicios = [
  {
    numero: '01',
    icono: '🩺',
    titulo: 'Consulta veterinaria',
    descripcion:
      'Atención profesional para cuidar la salud de tu mascota y acompañarte en cada etapa de su vida.',
  },
  {
    numero: '02',
    icono: '💉',
    titulo: 'Vacunación',
    descripcion:
      'Prevención y seguimiento para proteger a nuestros pacientes y promover su bienestar.',
  },
  {
    numero: '03',
    icono: '🐾',
    titulo: 'Medicina preventiva',
    descripcion:
      'El cuidado oportuno es fundamental para una vida más saludable junto a tu mejor amigo.',
  },
  {
    numero: '04',
    icono: '❤️',
    titulo: 'Atención personalizada',
    descripcion:
      'Escuchamos tus inquietudes y tratamos a cada mascota con dedicación, respeto y cariño.',
  },
]

const valores = [
  {
    icono: '♡',
    titulo: 'Amor por los animales',
    descripcion:
      'Cuidamos a cada paciente con empatía, respeto y vocación.',
  },
  {
    icono: '✦',
    titulo: 'Compromiso',
    descripcion:
      'Nos esforzamos por brindar una atención responsable y cercana.',
  },
  {
    icono: '✚',
    titulo: 'Ética profesional',
    descripcion:
      'Actuamos con responsabilidad y respeto hacia nuestros pacientes y sus familias.',
  },
  {
    icono: '⌁',
    titulo: 'Confianza',
    descripcion:
      'Construimos relaciones basadas en la comunicación y el acompañamiento.',
  },
]

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="social-svg"
    >
      <path
        fill="currentColor"
        d="M16.04 3C9.39 3 4 8.26 4 14.75c0 2.29.68 4.52 1.96 6.42L4 28l7.04-1.83a12.3 12.3 0 0 0 5 1.06h.01C22.69 27.23 28 21.98 28 15.49 28 8.99 22.69 3 16.04 3Zm0 21.9h-.01a10 10 0 0 1-5.09-1.4l-.36-.21-4.18 1.09 1.12-3.97-.24-.38a9.55 9.55 0 0 1-1.52-5.18c0-5.22 4.38-9.47 9.77-9.47 5.38 0 9.76 4.25 9.76 9.47 0 5.23-4.38 10.05-9.25 10.05Zm5.36-7.09c-.29-.14-1.74-.83-2.01-.92-.27-.1-.47-.14-.67.14-.2.29-.77.92-.94 1.11-.17.19-.34.21-.63.07-.29-.14-1.23-.44-2.34-1.4a8.7 8.7 0 0 1-1.62-1.96c-.17-.29-.02-.44.13-.58.13-.13.29-.34.44-.51.15-.16.2-.28.29-.47.1-.19.05-.36-.02-.51-.08-.14-.67-1.57-.92-2.15-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.36-.27.28-1.04.99-1.04 2.41 0 1.42 1.06 2.8 1.21 2.99.15.19 2.08 3.09 5.04 4.33.7.3 1.25.48 1.68.61.71.22 1.35.19 1.86.12.57-.08 1.74-.69 1.99-1.36.25-.68.25-1.26.17-1.38-.07-.12-.27-.19-.56-.33Z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="social-svg"
    >
      <path
        fill="currentColor"
        d="M13.5 22v-9h3l.45-3.5H13.5V7.26c0-1.01.28-1.7 1.73-1.7H17V2.43c-.31-.04-1.38-.13-2.62-.13-2.59 0-4.36 1.58-4.36 4.48V9.5H7.1V13h2.92v9h3.48Z"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="social-svg"
    >
      <path
        fill="currentColor"
        d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.1a1.17 1.17 0 1 1 0 2.34 1.17 1.17 0 0 1 0-2.34Z"
      />
    </svg>
  )
}

function InicioPage() {
  return (
    <div className="tuvet-home">

      {/* WHATSAPP FLOTANTE */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="tuvet-whatsapp-floating"
        aria-label="Contactar a TuVet por WhatsApp"
        title="Escríbenos por WhatsApp"
      >
        <span className="tuvet-whatsapp-pulse" />
        <WhatsAppIcon />

        <span className="tuvet-whatsapp-text">
          ¿Necesitas ayuda?
          <strong>Escríbenos</strong>
        </span>
      </a>

      {/* CABECERA */}
      <header className="tuvet-header">

        <a
          className="tuvet-brand"
          href="#inicio"
          aria-label="TuVet Centro Veterinario"
        >
          <img
            src="/images/tuvet/logo-tuvet.jpeg"
            alt="TuVet Centro Veterinario"
          />

          <div className="tuvet-brand-text">
            <strong>TuVet</strong>
            <span>Centro Veterinario</span>
          </div>
        </a>

        <nav
          className="tuvet-nav"
          aria-label="Navegación principal"
        >
          <a href="#inicio">Inicio</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#mision">Misión y visión</a>
          <a href="#servicios">Servicios</a>
          <a href="#ubicacion">Ubicación</a>
        </nav>

       <div className="tuvet-header-actions">

  <Link
    to="/login"
    className="tuvet-btn tuvet-btn-login"
  >
    <span className="tuvet-login-icon">♙</span>
    Iniciar sesión
  </Link>

  <a
    className="tuvet-btn tuvet-btn-primary tuvet-header-cta"
    href={WHATSAPP}
    target="_blank"
    rel="noopener noreferrer"
  >
    Agenda tu cita
    <span>↗</span>
  </a>

</div>

      </header>

      <main>

        {/* HERO */}
        <section
          className="tuvet-hero"
          id="inicio"
        >

          <div className="tuvet-hero-copy">

            <span className="tuvet-eyebrow">
              ✦ BIENVENIDOS A TUVET · PAUTE, AZUAY
            </span>

            <h1>
              Su bienestar
              <br />
              es nuestra
              <br />
              <span>vocación.</span>
            </h1>

            <p>
              Cuidamos a quienes llenan tu vida de alegría.
              Atención veterinaria profesional, cercana y
              llena de cariño para los integrantes más
              especiales de tu familia.
            </p>

            <div className="tuvet-hero-actions">

              <a
                className="tuvet-btn tuvet-btn-primary"
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
              >
                Agenda una cita
                <span>↗</span>
              </a>

              <a
                className="tuvet-btn tuvet-btn-outline"
                href="#nosotros"
              >
                Conócenos
                <span>↓</span>
              </a>

            </div>

            <div className="tuvet-hero-socials">

              <span>Síguenos</span>

              <a
                href={FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de TuVet"
              >
                <FacebookIcon />
              </a>

              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de TuVet"
              >
                <InstagramIcon />
              </a>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de TuVet"
              >
                <WhatsAppIcon />
              </a>

            </div>

            <div className="tuvet-hero-note">
              <span className="tuvet-note-line" />

              <span>
                Porque ellos también merecen
                <strong> lo mejor de nosotros.</strong>
              </span>
            </div>

          </div>

          <div className="tuvet-hero-visual">

            <div className="tuvet-hero-photo-wrap">
              <img
                src="/images/tuvet/medicos-tuvet.jpeg"
                alt="Médicos de TuVet junto a sus pacientes"
                className="tuvet-hero-photo"
              />
            </div>

            <div className="tuvet-photo-label">
              <span className="tuvet-photo-label-icon">
                ✚
              </span>

              <div>
                <strong>TuVet</strong>
                <small>Centro Veterinario</small>
              </div>
            </div>

            <div
              className="tuvet-hero-decoration"
              aria-hidden="true"
            >
              ✳
            </div>

          </div>

        </section>

        {/* FRANJA */}
        <section className="tuvet-trust-strip">

          <div>
            <span>✚</span>
            <strong>Vocación veterinaria</strong>
          </div>

          <div>
            <span>♡</span>
            <strong>Amor por los animales</strong>
          </div>

          <div>
            <span>✦</span>
            <strong>Atención cercana</strong>
          </div>

          <div>
            <span>⌂</span>
            <strong>Paute, Azuay</strong>
          </div>

        </section>

        {/* NOSOTROS */}
        <section
          className="tuvet-section tuvet-about"
          id="nosotros"
        >

          <div className="tuvet-section-heading">

            <span className="tuvet-eyebrow">
              01 / CONOCE NUESTRO CENTRO
            </span>

            <h2>
              Mucho más que
              <br />
              una veterinaria.
              <br />
              <em>Una familia que cuida.</em>
            </h2>

          </div>

          <div className="tuvet-about-content">

            <p className="tuvet-lead">
              En TuVet creemos que cada mascota merece
              una vida saludable, feliz y llena de amor.
            </p>

            <p>
              Somos un centro veterinario ubicado en Paute,
              Azuay, dedicado al cuidado y bienestar de los
              animales. Nuestro trabajo nace del compromiso
              de brindar una atención profesional y humana,
              acompañando a cada paciente y a su familia
              con respeto, dedicación y cariño.
            </p>

            <p>
              Sabemos que una mascota no es solamente un
              animal de compañía: es parte de tu hogar,
              de tus recuerdos y de tu historia.
              Por eso, cada visita importa.
            </p>

            <div className="tuvet-about-signature">

              <span className="tuvet-signature-icon">
                ♡
              </span>

              <div>
                <strong>
                  Los médicos fundadores de TuVet
                </strong>

                <small>
                  Una vocación compartida por la salud animal.
                </small>
              </div>

            </div>

          </div>

        </section>

        {/* MISIÓN Y VISIÓN */}
        <section
          className="tuvet-purpose-section"
          id="mision"
        >

          <div className="tuvet-purpose-intro">

            <span className="tuvet-eyebrow">
              02 / LO QUE NOS MUEVE
            </span>

            <h2>
              Nuestra esencia.
              <br />
              <em>Nuestro compromiso.</em>
            </h2>

            <p>
              Trabajamos para que cada mascota reciba
              el cuidado que merece y cada familia
              encuentre un lugar en el que pueda confiar.
            </p>

          </div>

          <div className="tuvet-purpose-grid">

            <article className="tuvet-purpose-card">

              <span className="tuvet-card-number">
                01 — PROPÓSITO
              </span>

              <div className="tuvet-purpose-icon">
                ◎
              </div>

              <h3>Nuestra misión</h3>

              <p>
                Brindar atención veterinaria profesional,
                integral y cercana, orientada a la salud
                y bienestar de las mascotas, mediante
                un servicio responsable, ético y humano
                que fortalezca el vínculo entre los
                animales y sus familias.
              </p>

              <span className="tuvet-card-bottom">
                CUIDAR CON VOCACIÓN ↗
              </span>

            </article>

            <article className="tuvet-purpose-card tuvet-purpose-card-dark">

              <span className="tuvet-card-number">
                02 — FUTURO
              </span>

              <div className="tuvet-purpose-icon">
                ✧
              </div>

              <h3>Nuestra visión</h3>

              <p>
                Ser un centro veterinario reconocido
                por la calidad de su atención, el
                compromiso con el bienestar animal
                y la confianza de las familias,
                promoviendo una cultura de cuidado,
                prevención y respeto por la vida.
              </p>

              <span className="tuvet-card-bottom">
                CRECER JUNTO A TI ↗
              </span>

            </article>

          </div>

        </section>

        {/* VALORES */}
        <section className="tuvet-section tuvet-values">

          <div className="tuvet-centered-heading">

            <span className="tuvet-eyebrow">
              03 / NUESTRA FORMA DE TRABAJAR
            </span>

            <h2>
              Valores que se sienten
              <br />
              <em>en cada atención.</em>
            </h2>

          </div>

          <div className="tuvet-values-grid">

            {valores.map((valor) => (
              <article
                className="tuvet-value-card"
                key={valor.titulo}
              >

                <span className="tuvet-value-icon">
                  {valor.icono}
                </span>

                <h3>{valor.titulo}</h3>

                <p>{valor.descripcion}</p>

              </article>
            ))}

          </div>

        </section>

        {/* SERVICIOS */}
        <section
          className="tuvet-services-section"
          id="servicios"
        >

          <div className="tuvet-services-header">

            <div>

              <span className="tuvet-eyebrow">
                04 / CUIDAMOS DE ELLOS
              </span>

              <h2>
                Su salud está
                <br />
                en buenas manos.
              </h2>

            </div>

            <p>
              Atención enfocada en el bienestar
              y las necesidades de cada paciente.
            </p>

          </div>

          <div className="tuvet-services-grid">

            {servicios.map((servicio) => (
              <article
                className="tuvet-service-card"
                key={servicio.numero}
              >

                <div className="tuvet-service-top">

                  <span>
                    {servicio.numero} / 04
                  </span>

                  <span className="tuvet-service-icon">
                    {servicio.icono}
                  </span>

                </div>

                <h3>{servicio.titulo}</h3>

                <p>{servicio.descripcion}</p>

                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar servicio
                  <span>↗</span>
                </a>

              </article>
            ))}

          </div>

        </section>

        {/* FRASE */}
        <section className="tuvet-quote-section">

          <span className="tuvet-big-quote">
            “
          </span>

          <blockquote>
            Ellos nos entregan su amor sin condiciones.
            Nosotros les devolvemos ese amor
            <em> cuidando de su bienestar.</em>
          </blockquote>

          <p>
            TUVET · CENTRO VETERINARIO
          </p>

        </section>

        {/* UBICACIÓN */}
        <section
          className="tuvet-location-section"
          id="ubicacion"
        >

          <div className="tuvet-location-info">

            <span className="tuvet-eyebrow">
              05 / VISÍTANOS
            </span>

            <h2>
              Estamos cerca
              <br />
              <em>cuando nos necesites.</em>
            </h2>

            <p>
              Visítanos en nuestro Centro Veterinario
              TuVet en Paute, Azuay.
            </p>

            <div className="tuvet-location-details">

              <div className="tuvet-location-item">
                <span>⌖</span>

                <div>
                  <small>DIRECCIÓN</small>
                  <strong>
                    Sucre 1-33 e India Pau
                  </strong>
                  <p>Paute, Azuay · Ecuador</p>
                </div>
              </div>

              <div className="tuvet-location-item">
                <span>☎</span>

                <div>
                  <small>TELÉFONO / WHATSAPP</small>

                  <a href="tel:+593980743705">
                    +593 98 074 3705
                  </a>
                </div>
              </div>

            </div>

            <div className="tuvet-location-actions">

              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="tuvet-btn tuvet-btn-primary"
              >
                Cómo llegar
                <span>↗</span>
              </a>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="tuvet-btn tuvet-btn-outline"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>

            </div>

          </div>

          <div className="tuvet-map-card">

            <iframe
              src={MAP_URL}
              title="Ubicación TuVet Centro Veterinario"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="tuvet-map-badge">
              <span>✚</span>

              <div>
                <strong>TuVet</strong>
                <small>Paute · Azuay</small>
              </div>
            </div>

          </div>

        </section>

        {/* CTA */}
        <section
          className="tuvet-cta-section"
          id="contacto"
        >

          <div>

            <span className="tuvet-eyebrow">
              ESTAMOS AQUÍ PARA ACOMPAÑARTE
            </span>

            <h2>
              ¿Tu mejor amigo
              <br />
              necesita atención?
            </h2>

            <p>
              Escríbenos y estaremos encantados
              de ayudarte a coordinar su cita.
            </p>

          </div>

          <a
            className="tuvet-btn tuvet-btn-light"
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            Escríbenos por WhatsApp
            <span>↗</span>
          </a>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="tuvet-footer">

        <div className="tuvet-footer-main">

          <div className="tuvet-footer-brand">

            <img
              src="/images/tuvet/logo-tuvet.jpeg"
              alt="TuVet Centro Veterinario"
            />

            <p>
              Cuidamos con vocación a quienes
              llenan tu vida de amor.
            </p>

            <div className="tuvet-footer-socials">

              <a
                href={FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <FacebookIcon />
              </a>

              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon />
              </a>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <WhatsAppIcon />
              </a>

            </div>

          </div>

          <div className="tuvet-footer-column">

            <h3>Explora</h3>

            <a href="#inicio">
              Inicio
            </a>

            <a href="#nosotros">
              Nosotros
            </a>

            <a href="#mision">
              Misión y visión
            </a>

            <a href="#servicios">
              Servicios
            </a>

            <a href="#ubicacion">
              Ubicación
            </a>

          </div>

          <div className="tuvet-footer-column">

            <h3>Contacto</h3>

            <span>
              Sucre 1-33 e India Pau
            </span>

            <span>
              Paute, Azuay · Ecuador
            </span>

            <a href="tel:+593980743705">
              +593 98 074 3705
            </a>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp ↗
            </a>

          </div>

          <div className="tuvet-footer-column">

            <h3>Síguenos</h3>

            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook ↗
            </a>

            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>

          </div>

        </div>

        <div className="tuvet-footer-bottom">

          <span>
            © {new Date().getFullYear()} TuVet Centro Veterinario.
          </span>

          <span>
            Hecho con ♡ por el bienestar animal.
          </span>

        </div>

      </footer>

    </div>
  )
}

export default InicioPage