import React from "react";
import { Toolbar, Typography } from "@mui/material";
import CoffeeIcon from '@mui/icons-material/Coffee';


export default function FooterBar() {
    return (
        <Toolbar
            variant="dense"
            component="footer"
            sx={{
                position: 'fixed',
                bottom: 0,
                justifyContent: 'center',
                width: '100vw',
                backgroundColor: 'action.disabledBackground'

            }}
        >

            <Typography variant="caption"
                sx={{
                    '& a': {
                        color: 'secondary.light'
                    }
                }}
            >
                Desenvolvido com <CoffeeIcon fontSize="small" /> por
                <a href="michele.mmayra@gmail.com "> Michele Mayra da Silva </a>,
                2024

            </Typography>
        </Toolbar>
    )
}