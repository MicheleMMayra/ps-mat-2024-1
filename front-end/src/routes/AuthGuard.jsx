import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import myfetch from '../lib/myfetch'
import AuthUserContext from '../Contexts/AuthUserContext'
import useWaiting from '../ui/useWaiting'


export default function AuthGuard({ children }) {

  const [hasAuthUser, setHasAuthUser] = React.useState() // undefined
  const { setAuthUser } = React.useContext(AuthUserContext)
  
  
  const location = useLocation()
  const { showWaiting, Waiting } = useWaiting()

  async function checkAuthUser() {
    showWaiting(true)
    try {
      await myfetch.get('/users/me')
      setHasAuthUser(true)
    }
    catch(error) {
      console.log(error)
      
      // Apaga as informações do usuário logado no contexto
      setAuthUser(null)
      setHasAuthUser(false)
    }
    finally{
      showWaiting(false)
    }
  }

  React.useEffect(() => {
    checkAuthUser()

  }, [location])

  // Enquanto ainda não temos a resposta do back-end para /users/me,
  // exibimos um componente Waiting
  if(hasAuthUser === undefined) return <Waiting/>

  return hasAuthUser ? children : <Navigate to="/login" replace />
  
}