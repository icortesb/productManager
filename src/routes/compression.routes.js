import Router from 'express';
import { compressString } from '../controllers/compression.controller.js';

const compressionRouter = Router();

compressionRouter.get('/longeststring', compressString);

export default compressionRouter;