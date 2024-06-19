import React from "react";
import { Typography, IconButton, Paper, Button, TextField, Box, MenuItem, Checkbox, FormControlLabel, Grid } from "@mui/material";

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

import Car from "../../../models/Car";
import { ZodError } from 'zod'




export default function CarForm() {


    const formDefauts = {
        brand: '',
        model: '',
        year_manufacture: '',
        color: '',
        imported: false,
        plates: '',
        selling_date: '',
        selling_price: '',




    }

    const [state, setState] = React.useState({
        car: { ...formDefauts },
        formModified: false,
        inputErrors: {}
    })
    const {
        car,
        formModified,
        inputErrors
    } = state


    const params = useParams()
    const navigate = useNavigate()

    const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
    const { notify, Notification } = useNotification()
    const { showWaiting, Waiting } = useWaiting()


    const colors = [
        { value: 'amarelo', label: 'Amarelo' },
        { value: 'azul', label: 'Azul' },
        { value: 'branco', label: 'Branco' },
        { value: 'cinza', label: 'Cinza' },
        { value: 'preto', label: 'Preto' },
        { value: 'prata', label: 'Prata' },
        { value: 'rosa', label: 'Rosa' },
        { value: 'verde', label: 'Verde' },
        { value: 'vermelho', label: 'Vermelho' }
    ]
    const years = [
        { value: 2024, label: '2024' },
        { value: 2023, label: '2023' },
        { value: 2022, label: '2022' },
        { value: 2021, label: '2021' },
        { value: 2020, label: '2020' },
        { value: 2019, label: '2019' },
        { value: 2018, label: '2018' },
        { value: 2017, label: '2017' },
        { value: 2016, label: '2016' },
        { value: 2015, label: '2015' },
        { value: 2014, label: '2014' },
        { value: 2013, label: '2013' },
        { value: 2012, label: '2012' },
        { value: 2011, label: '2011' },
        { value: 2010, label: '2010' },
        { value: 2009, label: '2009' },
        { value: 2008, label: '2008' },
        { value: 2007, label: '2007' },
        { value: 2006, label: '2006' },
        { value: 2005, label: '2005' },
        { value: 2004, label: '2004' },
        { value: 2003, label: '2003' },
        { value: 2002, label: '2002' },
        { value: 2001, label: '2001' },
        { value: 2000, label: '2000' },
        { value: 1999, label: '1999' },
        { value: 1998, label: '1998' },
        { value: 1997, label: '1997' },
        { value: 1996, label: '1996' },
        { value: 1995, label: '1995' },
        { value: 1994, label: '1994' },
        { value: 1993, label: '1993' },
        { value: 1992, label: '1992' },
        { value: 1991, label: '1991' },
        { value: 1990, label: '1990' },
        { value: 1989, label: '1989' },
        { value: 1988, label: '1988' },
        { value: 1987, label: '1987' },
        { value: 1986, label: '1986' },
        { value: 1985, label: '1985' },
        { value: 1984, label: '1984' },
        { value: 1983, label: '1983' },
        { value: 1982, label: '1982' },
        { value: 1981, label: '1981' },
        { value: 1980, label: '1980' },
        { value: 1979, label: '1979' },
        { value: 1978, label: '1978' },
        { value: 1977, label: '1977' },
        { value: 1976, label: '1976' },
        { value: 1975, label: '1975' },
        { value: 1974, label: '1974' },
        { value: 1973, label: '1973' },
        { value: 1972, label: '1972' },
        { value: 1971, label: '1971' },
        { value: 1970, label: '1970' },
        { value: 1969, label: '1969' },
        { value: 1968, label: '1968' },
        { value: 1967, label: '1967' },
        { value: 1966, label: '1966' },
        { value: 1965, label: '1965' },
        { value: 1964, label: '1964' },
        { value: 1963, label: '1963' },
        { value: 1962, label: '1962' },
        { value: 1961, label: '1961' },
        { value: 1960, label: '1960' }
    ]


    const plateMaskFormatChars = {
        '$': '[0-9A-Z]',      //letra ou digito
        '9': '[0-9]',         // somente dígitos
        'A': '[A-Z]'   // somente letras
    }


    function handleFieldChange(event) {
        const { name, type, checked, value } = event.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setState(prevState => ({
            ...prevState,
            car: {
                ...prevState.car,
                [name]: fieldValue
            },
            formModified: true
        }));
    }



    async function handleFormSubmit(e) {
        e.preventDefault()  //evita q a pagina seja recarrecagada
        showWaiting(true)
        //exibe Backdrop de espera
        try {
            // Invoca o Zod para validar os dados por meio do model Car
            car.selling_price = parseFloat(car.selling_price)

            Car.parse(car)

            if (params.id) await myfetch.put(`/cars/${params.id}`, car)
            else await myfetch.post(`/cars`, car)

            notify('Item salvo com sucesso. ', 'success', 4000, () => {
                navigate('/cars', { relative: 'path', replace: true })
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
    }, [])

    async function loadData() {
        showWaiting(true)
        try {
            const result = await myfetch.get(`/cars/${params.id}`)


            result.selling_date = parseISO(result.selling_date)

            setState({ ...state, car: result })
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
                {params.id ? `Editar Carro #${params.id}` : 'Cadastrar novo carro'}
            </Typography>

            <Box className="form-fields" sx={{ ml: 25, mr: 25 }}>

                <form onSubmit={handleFormSubmit}>

                    <TextField sx={{ mr: 10 }}
                        name="brand"
                        label="Marca"
                        variant="filled"
                        required
                        fullWidth
                        autoFocus
                        value={car.brand}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.brand}
                        error={inputErrors?.brand}
                    />

                    <TextField
                        name="model"
                        label="Modelo"
                        variant="filled"
                        required
                        fullWidth
                        value={car.model}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.model}
                        error={inputErrors?.model}
                    />


                    <FormControlLabel
                        control={
                            <Checkbox sx={{ width: 100 }}
                                name="imported"
                                checked={car.imported}
                                onChange={handleFieldChange}
                                color="primary"
                            />
                        }
                        label="Importado"
                    />



                    <TextField
                        name="color"
                        label="Cor"
                        variant="filled"
                        required
                        fullWidth
                        value={car.color}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.color}
                        error={inputErrors?.color}
                        select
                    >
                        {
                            colors.map(s =>
                                <MenuItem key={s.value} value={s.value} >
                                    {s.label}
                                </MenuItem>
                            )
                        }
                    </TextField>

                    <InputMask
                        mask="AAA-9$99"
                        formatChars={plateMaskFormatChars}
                        maskChar=" "
                        value={car.plates}
                        onChange={handleFieldChange}
                    >

                        {() => <TextField
                            name="plates"
                            label="Placa"
                            variant="filled"
                            required
                            fullWidth
                            helperText={inputErrors?.plates}
                            error={inputErrors?.plates}
                        />
                        }

                    </InputMask>


                    <TextField
                        name="year_manufacture"
                        label="Ano de Fabricação"
                        variant="filled"
                        required
                        fullWidth
                        value={car.year_manufacture}
                        onChange={handleFieldChange}
                        helperText={inputErrors?.year_manufacture}
                        error={inputErrors?.year_manufacture}
                        select
                    >
                        {
                            years.map(s =>
                                <MenuItem key={s.value} value={s.value} >
                                    {s.label}
                                </MenuItem>
                            )
                        }
                    </TextField>

                    <InputMask
                        mask="99999999"
                        formatChars={plateMaskFormatChars}
                        maskChar=" "
                        value={car.selling_price}
                        onChange={handleFieldChange}
                    >

                        {() => <TextField
                            name="selling_price"
                            label="Preço de Venda"
                            variant="filled"
                            required
                            fullWidth
                            helperText={inputErrors?.selling_price}
                            error={inputErrors?.selling_price}
                        />
                        }

                    </InputMask>

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                            label="Data de Venda"
                            value={car.selling_date}
                            onChange={value => handleFieldChange({
                                target: { name: 'selling_date', value }
                            })}
                            slotProps={{
                                TextField: {
                                    variant: 'filled',
                                    fullWidth: true,
                                    helperText: inputErrors?.selling_date,
                                    error: inputErrors?.selling_date
                                }
                            }
                            }
                        />
                    </LocalizationProvider>

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










                </form>

            </Box>
        </>
    )
}
