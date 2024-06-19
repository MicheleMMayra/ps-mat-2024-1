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




export default function CarList() {

    const columns = [
        {
            field: 'id',
            headerName: 'Cód.',
            width: 80
        },
        {
            field: 'model',
            headerName: 'Marca e Modelo',
            width: 200,
            // Colocando dois campos na mesma célula
            valueGetter: (value, row) => row.brand + '/' + row.model
        },
        {
            field: 'color',
            headerName: 'Cor',
            width: 150
        },
        {
            field: 'year_manufacture',
            headerName: 'Ano de Fabricação',
            width: 160
        },
        {
            field: 'imported',
            headerName: 'Importado',
            width: 250,
            renderCell: (params) => {
                if(params.value === true){
                    return 'sim'
                }else{
                    return 'nao'
                }
            }
        },

        {
            field: 'plates',
            headerName: 'Placas',
            width: 160
        },
        {
            field: 'selling_date',
            headerName: 'Data de venda',
            width: 250
        },
        {
            field: 'selling_price',
            headerName: 'Preço de venda',
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
        cars: [],
    })
    const {
        cars,
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
            const result = await myfetch.get('/cars')
            setState({
                ...state,
                cars: result
            })
        }
        catch (error) {
            console.error(error)
            notify(error.message, 'error')

        }
        finally {
            showWaiting(false)
        }

    }

    async function handleDeleteButtonClick(deleteId) {
        if (await askForConfirmation('Deseja mesmo excluir este item?')) {
            //exibe a tela de espera
            showWaiting(true)
            try {
                await myfetch.delete(`/cars/${deleteId}`)
                //Recarrega os dados da Grid 
                fetchData()
                notify('Item Excluido com sucesso')


            }
            catch (error) {
                console.log(error)
                notify(error.message, 'error')

            }
            finally {
                showWaiting(false)
            }
        }
    }

    return (
        <>

            <Waiting />
            <Notification />
            <ConfirmDialog />

            <Typography variant="h1" gutterBottom>
                Listagem de carros
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
                        Adicionar Carro
                    </Button>

                </Link>

            </Box>
            <Paper elevation={10}>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={cars}
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