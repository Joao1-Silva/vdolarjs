import { Router } from 'express';
import dolar from '../controllers/dolar.controller.js';
import cors from 'cors';

const router = Router();

router.use(cors());

// Welcome route
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Dollar API' });
});

// Dollar rate route
router.get('/dolar', dolar);

export default router;