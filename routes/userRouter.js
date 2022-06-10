const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', userController.getAll)
router.get('/authorize', authMiddleware,userController.authorize)
router.get('/:id',userController.getById)
router.put('/:id',userController.update)
router.delete('/:id',userController.delete)
router.post('/register',userController.register)
router.post('/login', userController.login)
router.post('/pdf', userController.generatePdf)
module.exports = router