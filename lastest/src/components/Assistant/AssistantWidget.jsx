import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon/Icon'
import ui from '../../styles/ui.module.css'
import { api } from '../../services/api'
import {
  getAssistantGreeting,
  getAssistantReply,
  getAssistantSuggestions,
} from './assistantKnowledge'
import styles from './AssistantWidget.module.css'

export default function AssistantWidget({
  mode,
  collections = {},
  activeView = 'panel',
  onNavigate,
  onRefresh,
  onAuthAction,
}) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => [
    { id: 1, role: 'assistant', content: getAssistantGreeting(mode) },
  ])
  const [isResponding, setIsResponding] = useState(false)
  const [assistantStatus, setAssistantStatus] = useState(null)
  const nextId = useRef(2)
  const inputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (mode !== 'app') return
    api.assistantStatus().then(setAssistantStatus).catch(() => setAssistantStatus(null))
  }, [mode])

  useEffect(() => {
    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.accessibilityMotion === 'reduced'
    endRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }, [messages, isResponding])

  const sendMessage = async (content) => {
    const text = content.trim()
    if (!text || isResponding) return

    const userMessage = { id: nextId.current++, role: 'user', content: text }
    setInput('')
    setIsResponding(true)
    setMessages((current) => [...current, userMessage])

    try {
      let assistantMessage
      if (mode === 'app') {
        const history = [...messages, userMessage]
          .filter((message) => ['user', 'assistant'].includes(message.role))
          .map(({ role, content }) => ({ role, content }))
          .slice(-8)
        const result = await api.assistantChat(history)
        assistantMessage = {
          id: nextId.current++,
          role: 'assistant',
          content: result.respuesta,
        }
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 180))
        const answer = getAssistantReply(text, { mode, collections, activeView })
        assistantMessage = {
          id: nextId.current++,
          role: 'assistant',
          content: answer.text,
          action: answer.action,
        }
      }

      setMessages((current) => [...current, assistantMessage])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: 'assistant',
          content: error.message,
        },
      ])
    } finally {
      setIsResponding(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(input)
  }

  const handleAction = (action) => {
    if (action.type === 'navigate') onNavigate?.(action.view)
    if (action.type === 'refresh') onRefresh?.()
    if (action.type === 'register' || action.type === 'login') {
      onAuthAction?.(action.type)
    }
    setOpen(false)
  }

  return (
    <div className={styles.widget}>
      {open ? (
        <section
          className={styles.panel}
          id="assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="assistant-title"
        >
          <header className={styles.header}>
            <span className={styles.avatar}><Icon name="chat" size={18} /></span>
            <div className={styles.headerText}>
              <h2 id="assistant-title" className={styles.title}>
                {mode === 'public' ? 'Ayuda de acceso' : 'Apoyo al equipo'}
              </h2>
              <span className={styles.caption}>
                {mode === 'public'
                  ? 'Asistente virtual · aquí para ayudarte'
                  : assistantStatus?.configured
                    ? 'Asistente virtual · disponible'
                    : assistantStatus === null
                      ? 'Asistente virtual · no disponible por ahora'
                      : 'Asistente virtual · configuración pendiente'}
              </span>
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Cerrar asistente"
            >
              <Icon name="close" size={17} />
            </button>
          </header>

          <div className={styles.messages} aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageRow} ${
                  message.role === 'user' ? styles.userRow : ''
                }`}
              >
                <p className={`${styles.message} ${
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}>
                  {message.content}
                </p>
                {message.action ? (
                  <button
                    type="button"
                    className={styles.action}
                    onClick={() => handleAction(message.action)}
                  >
                    {message.action.label}
                    <Icon name="chevron" size={14} />
                  </button>
                ) : null}
              </div>
            ))}
            {isResponding ? (
              <p className={styles.typing} role="status">Déjame revisar…</p>
            ) : null}
            <div ref={endRef} />
          </div>

          {messages.length === 1 ? (
            <div className={styles.suggestions} aria-label="Preguntas sugeridas">
              {getAssistantSuggestions(mode).map((suggestion) => (
                <button
                  type="button"
                  className={styles.suggestion}
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          <form className={styles.composer} onSubmit={handleSubmit}>
            <label className={ui.srOnly} htmlFor="assistant-message">
              Escribe un mensaje
            </label>
            <input
              id="assistant-message"
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="¿Qué necesitas resolver?"
              autoComplete="off"
              maxLength={500}
            />
            <button
              type="submit"
              className={styles.send}
              disabled={!input.trim() || isResponding}
              aria-label="Enviar mensaje"
            >
              <Icon name="send" size={17} />
            </button>
          </form>
          <p className={styles.disclaimer}>
            {mode === 'app'
              ? assistantStatus?.configured
                ? 'Soy un asistente virtual. Tu consulta se procesa con OpenAI. Evita incluir nombres, datos personales o información confidencial.'
                : 'Soy un asistente virtual. Para activarme, configura OpenAI en Accesibilidad. Evita compartir datos personales o contraseñas.'
              : 'Soy un asistente virtual de acceso. No compartas contraseñas ni datos personales.'}
          </p>
        </section>
      ) : null}

      <button
        type="button"
        className={`${styles.launcher} ${open ? styles.launcherOpen : ''}`}
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        aria-expanded={open}
        aria-controls={open ? 'assistant-panel' : undefined}
      >
        <Icon name={open ? 'close' : 'chat'} size={21} />
        <span>{open ? 'Cerrar' : 'Ayuda'}</span>
      </button>
    </div>
  )
}
