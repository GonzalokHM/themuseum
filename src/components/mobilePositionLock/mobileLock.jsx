import { useEffect, useState } from 'react'
import styles from './mobileLock.module.css'

const OrientationLock = () => {
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  )

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isPortrait) return null

  return (
    <div className={styles.overlay}>
      <p>Gira tu dispositivo para una mejor experiencia</p>
      <p>🔄</p>
    </div>
  )
}

export default OrientationLock
