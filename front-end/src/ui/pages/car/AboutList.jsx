import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import myfetch from '../../../lib/myfetch';
import { Link } from 'react-router-dom';
import { Button, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useConfirmDialog from '../../useConfirmDialog';
import useNotification from '../../useNotification';
import useWaiting from '../../useWaiting';

export default function AboutList() {
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80
        },
        {
            field: 'info',
            headerName: 'Info',
            width: 200
        },
        {
            field: 'observacoes',
            headerName: 'Observações',
            width: 250
        },
        {
            field: 'edit',
            headerName: 'Editar',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            width: 90,
            renderCell: (params) => (
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
            sortable: false,
            width: 90,
            renderCell: (params) => (
                <IconButton aria-label='Excluir' onClick={() => handleDeleteButtonClick(params.id)}>
                    <DeleteForeverIcon />
                </IconButton>
            )
        }
    ];

    const [state, setState] = useState({
        abouts: [],
    });

    const { abouts } = state;

    const { askForConfirmation, ConfirmDialog } = useConfirmDialog();
    const { notify, Notification } = useNotification();
    const { showWaiting, Waiting } = useWaiting();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        showWaiting(true);
        try {
            const result = await myfetch.get('/about');
            setState({
                ...state,
                abouts: result
            });
        } catch (error) {
            console.error(error);
            notify(error.message, 'error');
        } finally {
            showWaiting(false);
        }
    }

    async function handleDeleteButtonClick(deleteId) {
        if (await askForConfirmation('Deseja mesmo excluir este item?')) {
            showWaiting(true);
            try {
                await myfetch.delete(`/about/${deleteId}`);
                fetchData();
                notify('Item excluído com sucesso');
            } catch (error) {
                console.error(error);
                notify(error.message, 'error');
            } finally {
                showWaiting(false);
            }
        }
    }

    return (
        <>
            <Waiting />
            <Notification />
            <ConfirmDialog />
            <Typography variant="h1" gutterBottom>
                Sobre a autora 
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}>
                <Link to={"./new"}>
                    <Button
                        variant='contained'
                        size='large'
                        color='secondary'
                        startIcon={<AddIcon />}
                    >
                        Adicionar About
                    </Button>
                </Link>
            </Box>
            <Paper elevation={10}>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={abouts}
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
    );
}
 