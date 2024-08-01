import { baseUrl } from '@controllers/home.controller';
import express from 'express';
const router = express.Router();

router.get('/', baseUrl)

export default router;