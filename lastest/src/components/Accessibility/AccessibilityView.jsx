import { useEffect, useState } from 'react'
import Icon from '../Icon/Icon'
import { api } from '../../services/api'
import ui from '../../styles/ui.module.css'
import styles from './AccessibilityView.module.css'

const SWITCHES = [
  {
    key: 'highContrast',
    title: 'Alto contraste',
    description: 'Aumenta el contraste de textos, bordes y controles.',
  },
  {
    key: 'reducedMotion',
    title: 'Reducir movimiento',
    description: 'Minimiza animaciones y transiciones de la interfaz.',
  },
  {
    key: 'underlineLinks',
    title: 'Subrayar enlaces',
    description: 'Hace que los enlaces se distingan también por su forma.',
  },
]

export default function AccessibilityView({
  preferences,
  onPreferenceChange,
  onReset,
}) {
  const [assistantStatus, setAssistantStatus] = useState(null)

  useEffect(() => {
    api.assistantStatus().then(setAssistantStatus).catch(() => setAssistantStatus(null))
  }, [])

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <div>
          <h2 className={ui.pageTitle}>Accesibilidad</h2>
          <p className={ui.pageSubtitle}>
            Ajusta la visualización y el movimiento para facilitar el uso del sistema.
            Tus preferencias se guardan en este dispositivo.
          </p>
        </div>
        <button
          type="button"
          className={`${ui.btn} ${ui.btnGhost}`}
          onClick={onReset}
        >
          <Icon name="refresh" size={16} />
          Restablecer
        </button>
      </header>

      <section className={styles.card} aria-labelledby="accessibility-text-size">
        <div className={styles.cardHeading}>
          <span className={styles.cardIcon}><Icon name="eye" size={20} /></span>
          <div>
            <h3 id="accessibility-text-size" className={styles.cardTitle}>Tamaño del texto</h3>
            <p className={styles.cardDescription}>Amplía los textos de toda la aplicación.</p>
          </div>
        </div>
        <fieldset className={styles.fontOptions}>
          <legend className={ui.srOnly}>Selecciona el tamaño del texto</legend>
          {[
            { value: 'normal', label: 'Normal', sample: 'Aa' },
            { value: 'large', label: 'Grande', sample: 'Aa' },
            { value: 'larger', label: 'Muy grande', sample: 'Aa' },
          ].map((option) => (
            <label
              key={option.value}
              className={`${styles.fontOption} ${
                preferences.fontSize === option.value ? styles.selected : ''
              }`}
            >
              <input
                type="radio"
                name="accessibility-font-size"
                value={option.value}
                checked={preferences.fontSize === option.value}
                onChange={() => onPreferenceChange('fontSize', option.value)}
              />
              <span className={styles.fontSample} data-size={option.value}>
                {option.sample}
              </span>
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className={styles.card} aria-labelledby="accessibility-options">
        <div className={styles.cardHeading}>
          <span className={styles.cardIcon}><Icon name="sparkles" size={20} /></span>
          <div>
            <h3 id="accessibility-options" className={styles.cardTitle}>Preferencias visuales y de movimiento</h3>
            <p className={styles.cardDescription}>Activa los ajustes que se adapten mejor a ti.</p>
          </div>
        </div>

        <div className={styles.switchList}>
          {SWITCHES.map((option) => (
            <label key={option.key} className={styles.switchRow}>
              <span className={styles.switchCopy}>
                <span className={styles.switchTitle}>{option.title}</span>
                <span className={styles.cardDescription}>{option.description}</span>
              </span>
              <input
                className={styles.switchInput}
                type="checkbox"
                role="switch"
                checked={preferences[option.key]}
                onChange={(event) => onPreferenceChange(option.key, event.target.checked)}
                aria-label={option.title}
              />
            </label>
          ))}
        </div>
      </section>

      <section className={styles.card} aria-labelledby="assistant-configuration">
        <div className={styles.cardHeading}>
          <span className={styles.cardIcon}><Icon name="sparkles" size={20} /></span>
          <div>
            <h3 id="assistant-configuration" className={styles.cardTitle}>Asistente con IA</h3>
            <p className={styles.cardDescription}>
              Estado: {assistantStatus === null
                ? 'no disponible'
                : assistantStatus.configured
                  ? `configurado (${assistantStatus.model})`
                  : 'pendiente de configuración'}
            </p>
          </div>
        </div>
        <p className={styles.cardDescription}>
          En el backend, copia <code>backend/.env.example</code> como <code>backend/.env.local</code>,
          añade tu clave en <code>OPENAI_API_KEY</code> y reinicia el servidor. No pegues la clave
          aquí ni en el navegador; <code>.env.local</code> está excluido de Git.
        </p>
        <p className={styles.cardDescription}>
          El asistente autenticado envía a OpenAI el texto de tu pregunta para orientarte sobre
          puestos, prioridades o dificultades operativas. No consulta la base de datos ni el código.
          Evita incluir nombres, datos personales o información confidencial.
        </p>
      </section>

      <p className={styles.note}>
        <Icon name="info" size={16} />
        El ajuste de movimiento también respeta la preferencia del sistema operativo.
      </p>
    </div>
  )
}
