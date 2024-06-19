// Importando o Prisma Client
import prisma from '../database/client.js'

const controller = {} //Objeto vazio 

//criando um novo carro 
controller.create = async function (req, res){
    try {
      await prisma.customer.create({ data: req.body })

      //HTTP 201: Created 
      res.status(201).end()
    }
    catch(error){
      console.log(error)

      //HTTP 500: Internal Server Error
      res.status(500).end()
    }
}

controller.retriveAll = async function (req, res) {
    try {
     
        const result = await prisma.customer.findMany()
              orderBy: { nema: 'asc'}

        //HTTP 200: ok (implícito)
        res.send(result)
    }
    catch(error){
        console.log(error)
  
        //HTTP 500: Internal Server Error
        res.status(500).end()
    }
}
    controller.retrieveOne = async function(req, res) {
        try{
           const result = await prisma.customer.findUnique({ 
            where: { id: Number(req.params.id) }
           })

           //Encontrou : retorna HTTP 220: ok
           if(result)res.send(result)
           //Não encontrou: retorna HTTP 404: Not Found
          else res.status(404).end()

        }
        catch(error){
            console.log(error)
      
            //HTTP 500: Internal Server Error
            res.status(500).end()
        }

    }

    controller.update = async function(req, res) {
        try {
         const result = await prisma.customer.update({ 
            where: { id: Number(req.params.id) }, 
            data: req.body
         })
    
        //Encontrou e atualizou: retorna HTTP 204: No Content 
        if(result) res.status(204).end()
        //Não encontrou (e não atualizou): retornar HTTP 404: Not Found
        else res.status(404).end()
        }
        catch(error){
            console.log(error)
      
            //HTTP 500: Internal Server Error
            res.status(500).end()
        }
    }

    controller.delete = async function(req, res) {
        try {
            const result = await prisma.customer.delete({ 
            where: { id: Number(req.params.id) }, 

        })

        //Encontrou e excluiu: retorna HTTP 204: No Content 
         if(result) res.status(204).end()
         //Não encontrou (e não excluiu): retornar HTTP 404: Not Found
         else res.status(404).end()
        } 
        catch(error){
            console.log(error)
      
            //HTTP 500: Internal Server Error
            res.status(500).end()
        }

    }

export default controller 