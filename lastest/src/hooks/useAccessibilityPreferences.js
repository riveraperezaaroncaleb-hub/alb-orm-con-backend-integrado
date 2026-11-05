import { useEffect, useState } from 'react'

const STORAGE_KEY = 'inventario_accessibility_preferences'

export const DEFAULT_ACCESSIBILITY_PREFERENCES = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  underlineLinks: false,
}

function readPreferences() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_ACCESSIBILITY_PREFERENCES

    const parsed = JSON.parse(saved)
    const fontSizes = ['normal', 'large', 'larger']

    return {
      fontSize: fontSizes.includes(parsed.fontSize) ? parsed.fontSize : 'normal',
      highContrast: parsed.highContrast === true,
      reducedMotion: parsed.reducedMotion === true,
      underlineLinks: parsed.underlineLinks === true,
    }
  } catch (error) {
    console.error('No se pudieron leer las preferencias de accesibilidad.', error)
    return DEFAULT_ACCESSIBILITY_PREFERENCES
  }
}

export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState(readPreferences)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.accessibilityFont = preferences.fontSize
    root.dataset.accessibilityContrast = preferences.highContrast ? 'high' : 'normal'
    root.dataset.accessibilityMotion = preferences.reducedMotion ? 'reduced' : 'normal'
    root.dataset.accessibilityLinks = preferences.underlineLinks ? 'underlined' : 'normal'

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error('No se pudieron guardar las preferencias de accesibilidad.', error)
    }
  }, [preferences])

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  const resetPreferences = () => {
    setPreferences(DEFAULT_ACCESSIBILITY_PREFERENCES)
  }

  return { preferences, updatePreference, resetPreferences }
}
