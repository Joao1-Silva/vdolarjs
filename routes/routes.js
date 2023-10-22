import { Router } from 'express';
import dolar from '../controllers/dolar.controller.js'
import cors from 'cors'
import data from '../controllers/testdolarpy.controller.js';

const router = Router();

router.use(cors())

router.get('/', (req, res) => {

    res.status(200).json('Welcome, Im API`s Jonathan')
    
})

router.get('/dolar', dolar)

router.get('/dolartest', data)
  

export default router;