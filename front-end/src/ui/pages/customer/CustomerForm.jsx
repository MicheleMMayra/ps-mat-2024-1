import React from "react";
import { Typography, IconButton, Paper, Button, TextField, Box, MenuItem, touchRippleClasses,  } from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import InputMask from "react-input-mask"

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

import { ptBR } from 'date-fns/locale/pt-BR'
import { parseISO } from "date-fns";

import useConfirmDialog from "../../useConfirm.Dialog";
import useNotification from "../../useNotification";
import useWaiting from "../../useWaiting";
import myfetch from "../../../lib/myfetch";

import Customer from "../../../models/Customer";
import { ZodError } from 'zod'




export default function CustomerForm() {
    /*
    por padrao, todos os campos do nosso formulario terao como
    valor inicial uma string vazia. a excessão e o campo birth_date
    que devido ao funcionamento do DatePicker, deve iniciar a variavel null */

    const formDefauts = {
        name: '',
        ident_document: '',
        birth_date: null,
        street_name: '',
        house_number: '',
        complements: '',
        municipality: '',
        state: '',
        phone: '',
        email: '',




    }

    const [state, setState] = React.useState({
        customer: { ...formDefauts },
        formModified: false,
        inputErrors: {}
    })
    const {
        customer,
        formModified,
        inputErrors
    } = state


    const params = useParams()
    const navigate = useNavigate()

    const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
    const { notify, Notification } = useNotification()
    const { showWaiting, Waiting } = useWaiting()


    const states = [
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' }
    ]

    const phoneMaskFormatChars = {
        '9': '[0-9]',        //somente digitos
        '%': '[\s0-9]'      //digitos ou espaço em branco
    }

    function handleFieldChange(event) {
        const customerCopy = { ...customer }
        customerCopy[event.target.name] = event.target.value
        setState({ ...state, customer: customerCopy, formModified: true })
    }

    async function handleFormSubmit(e) {
        e.preventDefault()  //evita q a pagina seja recarrecagada
        showWaiting(true)    //exibe Backdrop de espera
        try {
            // Invoca o capiroto Zod para validar os dados por meio do model Customer
            Customer.parse(customer)

            if (params.id) await myfetch.put(`/customers/${params.id}`, customer)
            else await myfetch.post(`/customers`, customer)

            notify('Item salvo com sucesso. ', 'success', 4000, () => {
                navigate('...', { relative: 'path', replace: true })
            })
        }
        catch (error) {
            console.error(error)

            if (error instanceof ZodError) {
                //Faremeos um objeto contendo os erros do Zod e
                //o colocamos na variavel de estado inpoutErrors
                const messages = {}
                for (let i of error.issues) messages[i.path[0]] = i.message
                setState({ ...state, inputErrors: messages })
                notify('Ha campos com valores invalidos no formulario', 'error')
            }

            notify(error.message, 'error')
        }
        finally {
            //desliga backdrop
            showWaiting(false)
        }
    }

    React.useEffect(() => {
        if (params.id) loadData()
    })

    async function loadData() {
        showWaiting(true)
        try {
            const result = await myfetch.get(`/customers/${params.id}`)
            //converte o formato de data de nascimento no banco de dados
            //para o formato reconhecido pelo componente DatePicker

            result.birth_date = parseISO(result.birth_date)

            setState({ ...state, customer: result })
        }
        catch (error) {
            console.error(error)
            notify(error.message, 'error')


        }
        finally {
            //desliga backdrop
            showWaiting(false)
        }
    }

    async function handleBackButtonClick() {
        if (formModified &&
            ! await askForConfirmation("Há informações nao salvas deseja realmente sair?")
        ) return //sai da funçaõ sem fazer nada

        navigate('..', { relative: 'path', replace: true })
    }


    return (
        <>
            <ConfirmDialog />
            <Notification />
            <Waiting />


            <Typography variant="h1" gutterBottom sx={{ textAlign: 'center', mb: 5 }}>
                {params.id ? `Editar cliente #${params.id}` : 'Cadastrar novo cliente'}
            </Typography>

            <Box className="form-fields" sx={{ ml: 25, mr: 25 }}>
                <form onSubmit={handleFormSubmit}>

                    <TextField
                        name="name"
                        label="Nome Completo"
                        variant="filled"
                        required
                        fullWidth
                        autoFocus
                        value={customer.name}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.name}
                        error={inputErrors?.name}
                    />



                    <InputMask
                        mask="999.999.999-99"
                        value={customer.ident_document}
                        onChange={handleFieldChange}
                    >

                        {() => <TextField
                            name="ident_document"
                            label="CPF"
                            variant="filled"
                            required
                            fullWidth
                            helperText={inputErrors?.ident_document}
                            error={inputErrors?.ident_document}
                        />
                        }

                    </InputMask>


                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de Nascimento"
                            value={customer.birth_date}
                            onChange={value => handleFieldChange({
                                target: { name: 'birth_date', value }
                            })}
                            slotProps={{
                                TextField: {
                                    variant: 'filled',
                                    fullWidth: true,
                                    helperText: inputErrors?.birth_date,
                                    error: inputErrors?.birth_date
                                }
                            }
                            }
                        />
                    </LocalizationProvider>

                    <TextField
                        name="street_name"
                        label="Nome da Rua"
                        variant="filled"
                        placeholder="Rua av., Travessa etc"
                        required
                        fullWidth
                        value={customer.street_name}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.street_name}
                        error={inputErrors?.street_name}
                    />

                    <TextField
                        name="house_number"
                        label="Numero"
                        variant="filled"
                        required
                        fullWidth
                        value={customer.house_number}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.house_number}
                        error={inputErrors?.house_number}
                    />

                    <TextField
                        name="complements"
                        label="Complemento"
                        variant="filled"
                        placeholder="Ap. Bloco, casa, etc"
                        fullWidth
                        value={customer.complements}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.complements}
                        error={inputErrors?.complements}
                    />

                    <TextField
                        name="municipality"
                        label="municipio"
                        variant="filled"
                        required
                        fullWidth
                        value={customer.municipality}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.municipality}
                        error={inputErrors?.municipality}
                    />

                    <TextField
                        name="state"
                        label="UF"
                        variant="filled"
                        required
                        fullWidth
                        value={customer.state}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.UF}
                        error={inputErrors?.UF}
                        select
                    >
                        {
                            states.map(s =>
                                <MenuItem key={s.value} value={s.value} >
                                    {s.label}
                                </MenuItem>
                            )
                        }
                    </TextField>

                    <InputMask
                        mask="(99) %9999-9999"
                        formatChars={phoneMaskFormatChars}
                        maskChar=" "
                        value={customer.phone}
                        onChange={handleFieldChange}
                    >

                        {() => <TextField
                            name="phone"
                            label="Telefone/Celular"
                            variant="filled"
                            required
                            fullWidth
                            helperText={inputErrors?.phone}
                            error={inputErrors?.phone}
                        />
                        }

                    </InputMask>


                    <TextField
                        name="email"
                        label="E-mail"
                        variant="filled"
                        required
                        fullWidth
                        value={customer.email}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.email}
                        error={inputErrors?.email}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"

                        >
                            Salvar

                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleBackButtonClick}

                        >
                            Voltar

                        </Button>


                    </Box>

                    {/* <Box
                        sx={{ fontFamily: 'monospace', display: 'flex', width: '100%' }}>
                        {JSON.stringify(inputErrors)}
                    </Box> */}










                </form>
            </Box>
        </>
    )
}
