import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './gamePuzzle.module.css'

const MinigamePuzzle = ({ onGameEnd }) => {
  const [pieces, setPieces] = useState(shufflePieces())
  const [isSolved, setIsSolved] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState({ minutes: 0, seconds: 0 })
  const timerRef = useRef(null)

  useEffect(() => {
    checkSolution()
  }, [pieces])

  useEffect(() => {
    setStartTime(Date.now())
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const minutes = Math.floor(elapsed / 60000)
      const seconds = Math.floor((elapsed % 60000) / 1000)
      setElapsedTime({ minutes, seconds })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [startTime])

  const handlePieceClick = (index) => {
    const emptyIndex = pieces.indexOf(null)
    const isAdjacent = [index - 1, index + 1, index - 3, index + 3].includes(
      emptyIndex
    )

    if (isAdjacent) {
      const newPieces = [...pieces]
      ;[newPieces[emptyIndex], newPieces[index]] = [
        newPieces[index],
        newPieces[emptyIndex]
      ]
      setPieces(newPieces)
    }
  }

  const checkSolution = () => {
    const solved = pieces
      .slice(0, -1)
      .every((piece, index) => piece === index + 1)
    if (solved) {
      clearInterval(timerRef.current)
      setIsSolved(true)
      const totalSeconds = elapsedTime.minutes * 60 + elapsedTime.seconds

      onGameEnd(totalSeconds, true)
    }
  }

  return (
    <div>
      <h2>Rompecabezas</h2>
      {isSolved ? (
        <p>¡Felicidades, has resuelto el rompecabezas!</p>
      ) : null
      // // Dev Button
      // (
      //   <button
      //     onClick={() => {
      //       clearInterval(timerRef.current)
      //       setIsSolved(true)
      //       const totalSeconds =
      //         elapsedTime.minutes * 60 + elapsedTime.seconds
      //       onGameEnd(totalSeconds, true)
      //     }}
      //   >
      //     Resolver Puzzle
      //   </button>
      // )
      }
      <div id='timer'>
        {elapsedTime.minutes} min {elapsedTime.seconds} s
      </div>
      <div className={styles.puzzle}>
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`${styles.puzzlePiece} ${
              piece === null ? styles.empty : ''
            }`}
            onClick={() => handlePieceClick(index)}
          >
            {piece}
          </div>
        ))}
      </div>
    </div>
  )
}

const shufflePieces = () => {
  const pieces = [...Array(8).keys()].map((x) => x + 1).concat(null)
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pieces[i], pieces[j]] = [pieces[j], pieces[i]]
  }
  return pieces
}

MinigamePuzzle.propTypes = {
  onGameEnd: PropTypes.func.isRequired
}

export default MinigamePuzzle
