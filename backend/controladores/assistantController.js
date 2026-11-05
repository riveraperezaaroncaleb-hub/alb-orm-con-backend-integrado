const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 2000;
const REQUEST_TIMEOUT_MS = 20000;
const REQUESTS_PER_MINUTE = 12;
const requestTimes = new Map();

const configuration = () => ({
  configured: Boolean(process.env.OPENAI_API_KEY),
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
});

const redactSensitiveText = (text) =>
  text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[correo omitido]')
    .replace(/\b(?:sk-[A-Za-z0-9_-]{16,}|Bearer\s+\S+)\b/gi, '[credencial omitida]')
    .replace(/\b(?:api[_ -]?key|clave|contraseña|password|token)\s*[:=]\s*\S+/gi, '[secreto omitido]')
    .replace(/\b(?:\+?\d[\d\s().-]{7,}\d)\b/g, '[teléfono o número omitido]');

const enforceRateLimit = (req, res) => {
  const now = Date.now();
  const userId = String(req.usuario.id);
  const recent = (requestTimes.get(userId) || []).filter(
    (timestamp) => now - timestamp < 60_000
  );

  if (recent.length >= REQUESTS_PER_MINUTE) {
    res.set('Retry-After', '60');
    res.status(429).json({
      mensaje: 'Se alcanzó el límite temporal de consultas del asistente. Intenta de nuevo en un minuto.'
    });
    return false;
  }

  recent.push(now);
  requestTimes.set(userId, recent);
  return true;
};

const estado = (req, res) => {
  return res.json(configuration());
};

const consultar = async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      mensaje: 'El asistente de IA no está configurado. Añade OPENAI_API_KEY en backend/.env o backend/.env.local y reinicia el servidor.'
    });
  }

  if (!enforceRateLimit(req, res)) {
    return undefined;
  }

  const messages = req.body?.messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    messages.some(
      (message) =>
        !message ||
        !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string' ||
        message.content.trim().length === 0 ||
        message.content.length > MAX_MESSAGE_LENGTH
    )
  ) {
    return res.status(400).json({
      mensaje: `Envía entre 1 y ${MAX_MESSAGES} mensajes válidos, de hasta ${MAX_MESSAGE_LENGTH} caracteres cada uno.`
    });
  }

  try {
    const safeMessages = messages.map(({ role, content }) => ({
      role,
      content: redactSensitiveText(content.trim())
    }));
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: abortController.signal,
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: configuration().model,
          temperature: 0.2,
          max_tokens: 500,
          messages: [
            {
              role: 'system',
              content: [
                'Eres el Orquestador Central de apoyo al cambio organizacional de Grupo Meridian Contable S.A. Hablas en español con tono profesional, empático, claro y natural.',
                'Clasifica cada consulta internamente y responde desde uno o más de estos enfoques. No hace falta anunciar el nombre técnico del agente; menciona el área solo si ayuda a aclarar la respuesta.',
                'AGENTE_RRHH: orienta sobre manuales de puestos, perfiles, responsabilidades y resultados del estudio de cargas. Afirma funciones exactas únicamente si el manual correspondiente está incluido en la conversación o en el material de referencia disponible. No se proporcionaron manuales en este contexto: si preguntan por una responsabilidad específica, dilo con claridad y pide el manual o sección para verificarla.',
                'AGENTE_OPERATIVO: orienta sobre asignación de recursos, canal oficial de prioridades y flujo interdepartamental. No se ha proporcionado el nombre del canal ni la matriz detallada: no los inventes ni asignes tareas o prioridades; pide el procedimiento o matriz vigente y ofrece explicar cómo aplicarlo cuando se comparta.',
                'AGENTE_DIALOGO: recibe dificultades, cuellos de botella y reportes de sobrecarga con empatía y sin juzgar. Si sirve, ayuda a estructurar la incidencia con: situación, tarea o proceso afectado, impacto, frecuencia o periodo, dependencias, acciones ya intentadas y apoyo requerido. No prometas confidencialidad, seguimiento ni escalamiento; no afirmes que el reporte fue enviado a jefaturas.',
                'Si la consulta toca varios temas, combina los enfoques sin repetir información. Separa los hechos compartidos por el colaborador de cualquier sugerencia.',
                'No inventes políticas, responsabilidades, canales, prioridades, cargas de trabajo, reuniones ni decisiones de la empresa. Si falta información, dilo de forma sencilla y pregunta solo lo necesario.',
                'No solicites nombres de terceros, datos de clientes, contraseñas, información financiera personal, salud ni otros datos sensibles. Sugiere describir la situación sin identificar personas.',
                'Responde de forma concisa y cotidiana, con pasos o viñetas solo cuando faciliten la lectura. Evita saludos repetitivos, tono robótico y cierres genéricos.',
                'No digas que eres una persona ni ocultes que eres un asistente virtual si te preguntan.'
              ].join('\n')
            },
            ...safeMessages
          ]
        })
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      console.error(`El proveedor de IA respondió HTTP ${response.status}.`);
      return res.status(502).json({
        mensaje: 'El proveedor de IA no pudo procesar la consulta. Verifica la configuración de la API.'
      });
    }

    const result = await response.json();
    const answer = result.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || answer.trim().length === 0) {
      console.error('El proveedor de IA devolvió una respuesta vacía o con formato inesperado.');
      return res.status(502).json({
        mensaje: 'El proveedor de IA devolvió una respuesta no válida.'
      });
    }

    return res.json({
      respuesta: answer.trim(),
      modelo: configuration().model
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ mensaje: 'La consulta de IA excedió el tiempo de espera.' });
    }
    console.error('No se pudo completar la consulta del asistente:', error.message);
    return res.status(500).json({ mensaje: 'No se pudo completar la consulta del asistente.' });
  }
};

module.exports = { estado, consultar };
