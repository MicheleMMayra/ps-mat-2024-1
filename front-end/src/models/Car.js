import { z } from 'zod'

/*Calcular Year_manufacture
*/

const maxYearManufacture = new Date() //Hoje
maxYearManufacture.setFullYear(maxYearManufacture.getFullYear() + 1)


//O carro tem que ser no maximo de 1960
const minYearManufacture = new Date()
minYearManufacture.setFullYear(minYearManufacture.getFullYear() - 64)

const maxSellingDate = new Date()
maxSellingDate.setFullYear(maxYearManufacture.getFullYear() + 1)


export default z.object({

    brand:
        z.string()
            .max(25, { message: 'marca tem no maximo 25 caracters' }),

    model:
        z.string()
            .max(25, { message: 'O modelo tem q ter, no maximo 25 caracteres' }),

    color:
        z.string()
            .min(1, { message: "Escolha uma cor" })
            .max(12, { message: 'A cor pode ter, no maximo 12 caracteres' }),

    year_manufacture:
        z.coerce.number()
            .min(minYearManufacture, { message: 'Carro é muito antigo' })
            .max(maxYearManufacture, { message: 'Data invalida de criação' }),


    imported:
        z.coerce.boolean()
            .nullable(),

    selling_date:
        z.coerce.date()
            .max(maxSellingDate, { message: 'data de venda errada' })
            .nullable(), //Opcional

    selling_price:
        z.coerce.number()
            .max(5000000, { message: 'O valor maximo é 5000000 reais' })
            .min(1000, { message: 'Valor minimo é 1000 reais' })
            .nullable(),


})