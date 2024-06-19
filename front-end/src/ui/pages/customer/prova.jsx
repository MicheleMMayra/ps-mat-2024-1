import React from "react"
import { useEffect, useState } from "react"
import { Typography, Paper } from "@mui/material"




//exportando a função prova
export default function Prova() {
    //useEffect para carregar os dados ao carregar a pagina
    useEffect(() => {
        const PegaDados = async () => {
            try {
                //usei o metodo fetch ao invez de myfetch pois estava dando erro
                const response = await fetch('https://api.faustocintra.com.br/about/1')
                const data = await response.json()

                //setei os dados de Info dentro da variavel de estado
                setInfo(data.info)


            }
            catch (error) {
                console.error('Erro ao buscar dados da API', error)

            }

        }
        PegaDados()

    }, [])

    //declarei a variavel de estado
    const [info, setInfo] = useState([])







    return (
        <>
            <div style={{ alignContent: "center", alignItems: "center" }}>


                <Typography>
                    Sobre o Projeto Karangos
                </Typography>
                {/* dei uma estilizada no paper */}
                <Paper elevation={5}
                    sx={{
                        display: "flex",
                        width: '40%'


                    }}>
                    {info}

                </Paper >
            </div>

        </>
    )

}