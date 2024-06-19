import { Router} from 'express'




const router = Router()

router.post('/', controller.createAbout)
router.get('/', controller.retriveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)


export default router 