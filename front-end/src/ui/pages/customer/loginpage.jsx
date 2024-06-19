import React from "react";
import { Typography } from "@mui/material";
import { Paper, TextField, InputAdornment, IconButton, Button } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useNavigate} from 'react-router-dom'
import useWaiting from "../useWaiting";
import useNotification from "../useNotification";
import AuthUserContext from "../../Contexts/AuthUserContext";

import myfetch from "../../lib/myfetch";
export default function LoginPage() {

    const [state, setState] = React.useState({
      showPassword: false,
      email: '',
      password: ''
    })
    const {
      showPassword,
      email,
      password
    } = state
  
    const { notify, Notification } = useNotification()
    const { showWaiting, Waiting } = useWaiting()
  
    const { setAuthUser } = React.useContext(AuthUserContext)
  
    const navigate = useNavigate()
  
    const handleClickShowPassword = () => setState({...state, showPassword: !showPassword})
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault()
    }
  
    function handleChange(event) {
      setState({...state, [event.target.name]: event.target.value})
    }
  
    async function handleSubmit(event) {
      event.preventDefault()    // Evita que a página seja recarregada
      showWaiting(true)
      try {
  
        const response = await myfetch.post('/users/login', {email, password})
        //console.log(response)
  
        // Armazena o token no localStorage (INSEGURO!! ISSO É PROVISÓRIO!!)
        window.localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_NAME, response.token)
  
        // Armazena as informações do usuário autenticado no contexto
        // AuthUserContext
        setAuthUser(response.user)
  
        // Mostra notificação de sucesso
        notify('Autenticação efetuada com sucesso.', 'success', 1500, () => navigate('/'))
        
      }
      catch(error) {
        console.error(error)
        notify(error.message, 'error')
      }
      finally {
        showWaiting(false)
      }
    }
  
    return (
      <>
        
        <Waiting />
        <Notification />
  
        <Typography variant="h1" sx={{ textAlign: 'center' }} gutterBottom>
          Autentique-se
        </Typography>
  
        <Paper 
          elevation={6}
          sx={{
            padding: '24px',
            maxWidth: '500px',
            margin: 'auto'
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              name="email"
              value={email}
              onChange={handleChange}
              label="E-mail" 
              variant="filled" 
              fullWidth
              sx={{ mb: '24px' }} 
            />
            
            <TextField
              name="password"
              value={password}
              onChange={handleChange}
              variant="filled"
              type={showPassword ? 'text' : 'password'}
              label="Senha"
              fullWidth
              sx={{ mb: '24px' }}
              InputProps={{
                endAdornment: 
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }}
            />
  
            <Button 
              variant="contained" 
              type="submit"
              color="secondary"
              fullWidth
            >
              Enviar
            </Button>
          </form>
          
        </Paper>
      </>
    )
  }