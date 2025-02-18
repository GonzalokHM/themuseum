import { useState, useEffect } from 'react'
import styles from './Settings.module.css'

const Settings = ({ theme, setTheme }) => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [graphicsQuality, setGraphicsQuality] = useState('Alta')

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled)
    localStorage.setItem('volume', volume)
    localStorage.setItem('graphicsQuality', graphicsQuality)
  }, [soundEnabled, volume, graphicsQuality])

  const resetSettings = () => {
    setSoundEnabled(true)
    setVolume(50)
    setGraphicsQuality('Alta')
    setTheme('light')
  }

  return (
    <div className={styles.settingsContainer}>
      <h1>⚙️ Panel de Ajustes</h1>

      <div className={styles.groupsCont}>
        <div className={styles.settingGroup}>
          <label>
            🔊 Sonido:
            <input
              type='checkbox'
              checked={soundEnabled}
              onChange={() => setSoundEnabled(!soundEnabled)}
            />
          </label>
          <input
            type='range'
            min='0'
            max='100'
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
          <span>🎚️ Volumen: {volume}%</span>
        </div>

        <div className={styles.settingGroup}>
          <label>🎮 Calidad Gráfica: </label>
          <select
            value={graphicsQuality}
            onChange={(e) => setGraphicsQuality(e.target.value)}
          >
            <option value='Baja'>Baja</option>
            <option value='Media'>Media</option>
            <option value='Alta'>Alta</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label>🌙 Tema: </label>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
          </button>
        </div>
      </div>

      <button onClick={resetSettings}>🔄 Restablecer Ajustes</button>
    </div>
  )
}

export default Settings
