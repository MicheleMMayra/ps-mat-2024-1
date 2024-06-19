import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import myfetch from '../../../lib/myfetch';
import { Link } from 'react-router-dom';
import { Button, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useConfirmDialog from "../../useConfirm.Dialog";
import useNotification from "../../useNotification";
import useWaiting from "../../useWaiting";




export default function CustomerList() {

  const columns = [
    {
      field: 'id',
      headerName: 'Cód.',
      width: 80
    },
    {
      field: 'name',
      headerName: 'Nome',
      width: 250
    },
    {
      field: 'ident_document',
      headerName: 'CPF',
      width: 150
    },
    {
      field: 'municipality',
      headerName: 'Município/UF',
      width: 200,
      // Colocando dois campos na mesma célula
      valueGetter: (value, row) => row.municipality + '/' + row.state
    },
    {
      field: 'phone',
      headerName: 'Tel./celular',
      width: 160
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 250
    },
    {
      field: 'edit',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      sortable: 'false',
      width: 90,
      renderCell: params => (
        <Link to={`./${params.id}`}>
          <IconButton aria-label='Editar'>
            <EditIcon />
          </IconButton>
        </Link>
      )
    },
    {
      field: '_delete',
      headerName: 'Deletar',
      headerAlign: 'center',
      align: 'center',
      sortable: 'false',
      width: 90,
      renderCell: params => (

        <IconButton aria-label='Excluir' onClick={() => handleDeleteButtonClick(params.id)}>
          <DeleteForeverIcon />
        </IconButton>
      )
    },
  ];

  const [state, setState] = React.useState({
    customers: [],
  })
  const {
    customers,
  } = state

  const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
  const { notify, Notification } = useNotification()
  const { showWaiting, Waiting } = useWaiting()

  /*
    useEffect() com vetor de dependências vazio irá ser executado
    apenas uma vez, durante o carregamento inicial do componente
  */
  React.useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
   showWaiting(true)
    try {
      const result = await myfetch.get('/customers')
      setState({
        ...state,
        customers: result
      })
    }
    catch (error) {
      console.error(error)
      notify(error.message, 'error')
        
      }
      finally{
        showWaiting(false)
      }
    
  }

  async function handleDeleteButtonClick(deleteId) {
    if (await askForConfirmation('Deseja mesmo excluir este item?')) {
      //exibe a tela de espera
      showWaiting(true)
      try {
        await myfetch.delete(`/customers/${deleteId}`)
        //Recarrega os dados da Grid 
        fetchData()
        notify('Item Excluido com sucesso')

        
      }
      catch (error) {
        console.log(error)
        notify(error.message, 'error')

      }
      finally{
        showWaiting(false)
      }
    }
  }

  return (
    <>

      <Waiting/>
      <Notification/>
      <ConfirmDialog/>

      <Typography variant="h1" gutterBottom>
        Listagem de clientes
      </Typography>


      <Box sx={{
        display: 'flex',
        justifyContent: 'right',
        mb: 2
      }}>
        <Link to={"./new"}>
          <Button
            variant='contained'
            size='large'
            color='secondary'
            startIcon={<AddIcon />}
          >
            Novo Cliente
          </Button>

        </Link>

      </Box>
      <Paper elevation={10}>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={customers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>
    </>
  )

}