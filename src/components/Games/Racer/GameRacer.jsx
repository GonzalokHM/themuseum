import { useEffect, useRef, useState } from 'react'
import { initScene, animateScene } from './constructor/scene'
import { initCar } from './components/car'
import { initControls } from './constructor/controls'
import { initObstacles } from './constructor/obstacles'
import HUD from './components/Hud'
import { addTunnelLights } from './components/lighting'
import PropTypes from 'prop-types'

const GameRacer = ({ onGameEnd }) => {
  const mountRef = useRef(null)
  const [lives, setLives] = useState(3)
  const [speed, setSpeed] = useState(0)
  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const MAX_SECTIONS = 10
  const requestRef = useRef(null)
  const rendererRef = useRef(null)

  useEffect(() => {
    const { scene, camera, renderer, track } = initScene(mountRef.current)
    rendererRef.current = renderer
    const car = initCar(scene, camera)

    initControls(car)

    let mainCurve = null
    if (track.sections.length > 0) {
      const firstSection = track.sections[track.sections.length - 1]
      mainCurve = firstSection.curve

      car.trackCurve = mainCurve
      car.trackWidth = track.trackWidth

      const startPoint = mainCurve.getPointAt(0)
      car.position.set(startPoint.x, startPoint.y, startPoint.z)

      initObstacles(scene, mainCurve, track.trackWidth)
    } else {
      console.error('No initial sections found')
    }

    const handleGameOver = async () => {
      if (isGameOver) return
      setIsGameOver(true)
      // setInterval
      cancelAnimationFrame(requestRef.current)
      const finalScore = Math.floor(car.score)

      onGameEnd(finalScore, true)
    }

    const animate = () => {
      if (isGameOver) {
        cancelAnimationFrame(requestRef.current)
        return
      }

      requestRef.current = requestAnimationFrame(animate)
      animateScene(scene, camera, renderer, car)

      if (track.sections && track.sections.length > 0) {
        const lastSection = track.sections[track.sections.length - 1]

        if (lastSection.trackSection && lastSection.trackSection.geometry) {
          if (lastSection.trackSection.geometry.boundingBox) {
            if (
              car.position.z <
              lastSection.trackSection.geometry.boundingBox.max.z - 50
            ) {
              const { curve } = track.generateSection()

              mainCurve = curve
              car.trackCurve = mainCurve

              initObstacles(scene, curve, track.trackWidth)
              addTunnelLights(scene, curve, 3)

              if (track.sections.length > MAX_SECTIONS) {
                const oldestSection = track.sections.shift()
                scene.remove(oldestSection.trackSection)
              }
            }
          } else {
            lastSection.trackSection.geometry.computeBoundingBox()
          }
        }
      }

      setScore(Math.floor(car.score))
      if (car.lives !== lives) setLives(car.lives)
      setSpeed(car.velocity)

      if (car.lives <= 0 && !isGameOver) {
        handleGameOver()
      }
    }
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(requestRef.current)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div>
      <div ref={mountRef} />
      <HUD score={score} lives={lives} speed={speed} />
      {isGameOver && (
        <div className='game-over-overlay'>
          <h1>Game Over !</h1>
          <p>Score:{score}meters</p>
        </div>
      )}
    </div>
  )
}

GameRacer.propTypes = {
  onGameEnd: PropTypes.func.isRequired
}

export default GameRacer
