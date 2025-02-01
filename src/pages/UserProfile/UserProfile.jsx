import { fetchUserProfile } from '../../api/api'

const UserProfile = () => {
  const [userData, setUserData] = useState(null)
  const { dispatch } = useGlobalState()

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
  }
  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserProfile()
      if (data) {
        setUserData(data)
      }
    }
    getUserData()
  }, [])

  return (
    <div>
      {userData ? (
        <div>
          <h1>Perfil del Usuario</h1>
          <p>Nombre: {userData.username}</p>
          <p>Puntuaciones:</p>
          <ul>
            <li>Puzzle: {userData.scores.puzzle}</li>
            <li>Racer: {userData.scores.racer}</li>
            <li>Shooter: {userData.scores.shooter}</li>
          </ul>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  )
}

export default UserProfile
