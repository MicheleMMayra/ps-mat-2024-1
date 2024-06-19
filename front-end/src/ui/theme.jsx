import {createTheme} from '@mui/material/styles'
import {pink, yellow} from '@mui/material/colors'
import { ptBR as ptBR_datagrid } from '@mui/x-data-grid/locales'
import { ptBR as ptBR_datapicker } from  '@mui/x-date-pickers/locales'

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { //cor primaria
            main: yellow[500]
        },
        secondary: { //cor secundaria
            main: pink[500]
        }
    },
    typography: {
        h1:{
            fontSize: '30pt',
            fontWeight: 'bold'
        }
    }
},ptBR_datagrid, ptBR_datapicker)

export default theme
