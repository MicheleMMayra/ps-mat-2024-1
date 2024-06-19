import {z} from 'zod' // importar a biblioteca `zod´

//Aqui estou definido os valores para o campo info, utilizando car.js como exemplo 
const minInfoValue = 1; 
const maxInfoValue = 10000; 


//Criação de campo info para definir valores min max no campo. 
export default z.object({
    id: z.number().int().positive().optional().describe('ID autoincremental'), // id é um campo opcional, pois será gerado automaticamente
    id:
       
        z.int()
         .min(minInfoValue, { message: 'O valor mínimo para info é 1' }),

    info:
        z.string()
            .min(minInfoValue, { message: 'O valor mínimo para info é 1' })
            .max(maxInfoValue, { message: 'O valor máximo para info é 10000' }),
    Observações: 
        z.string()
        .max(255, {message: 'Observações limite máximo é 255 '}) //limite máximo de 255 caracteres e uma menasagem  de erro personalizada. 
        .optional(), //Observações é um  opcional 

})

