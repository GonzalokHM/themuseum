import PropTypes from 'prop-types'

const HUD = ({ score, lives, speed }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white'
      }}
    >
      <div>Score: {score} meters</div>
      <div>Lives: {lives}</div>
      <div>Speed: {Math.floor(speed * 30.6)} km/h</div>
    </div>
  )
}

HUD.propTypes = {
  score: PropTypes.number.isRequired,
  lives: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired
}

export default HUD
