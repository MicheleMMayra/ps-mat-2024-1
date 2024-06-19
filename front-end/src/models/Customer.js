import {z} from 'zod'
import {cpf} from 'cpf-cnpj-validator'

/*O cliente deve ser maior de 18 anos
por isso para validar a data de nascimento 
calculamos a data maxima em que o cliente pode ter nascido
para ter pelo menos 18 anos na data de hoje
*/

const maxBirthDate = new Date() //Hoje
maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18)

//O cliente pode ter nascido ha, no maximo 120 anos
const minBirthDate = new Date() 
minBirthDate.setFullYear(minBirthDate.getFullYear() - 120)

export default z.object({

  name:
    z.string()
    .min(5, {message: 'O nome deve ter no minimo 5 caracteres'})
    .includes(' ', {message: 'O nome deve ter um espaçõ separando o sobrenome'}),

    ident_document:
    z.string()
    //remove os sublinhados se o usuario nao for preenchido totalmente
    //o CPF
    .transform(val => val.replace('_', ''))
    .refine(val => val.length === 14, {message: 'O CPF esta Incompleto'})
    .refine(val => cpf.isValid(val), {message: 'CPF invalido'}),

    birth_date:
    //coerce força a conversao para o tipo Date, se o valor recebido for String
    z.coerce.date()
    .min(minBirthDate, {message: 'Data de nascimento esta muito no passado'})
    .max(maxBirthDate, {message: 'O cliente deve ser maior de 18 anos'})
    .nullable(), //o campo é opcional

    street_name:
    z.string()
    .max(40, {message: 'O logradouro pode ter, no maximo 40 caracteres'}),

    house_number:
    z.string()
    .max(10, {message: 'O numero pode ter, no maximo 10 caracteres'}),

    complements:
    z.string()
    .max(20, {message: 'O complemento pode ter, no maximo 20 caracteres'}),

    municipality:
    z.string()
    .max(40, {message: 'O Municipio pode ter, no maximo 40 caracteres'}),

    state:
    z.string()
    .length(2, {message: 'UF deve ter exatamente 2 caracteres'}),

    phone:
    z.string()
    .transform(val => val.trim())
    /* Depois de um transform(), nao podemos mais usar length(). Por isso,
    precisamos usar uma função personalizada com refine() para validar
    o tamanho do campo*/
    .refine(val => val.length === 15, {message: 'O numero da telefone/celular esta incompleto'}),

    email:
    z.string()
    .email({message: 'E-mail invalido'})
  

})