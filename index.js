import express from 'express';
import hola from 'colors';
import helmet from 'helmet';
import logger from 'morgan';
import { config } from 'dotenv';
import admin from 'firebase-admin';
import passportFunction from './config/passport.js';
import session from 'express-session';
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import empresaRouter from './routes/empresa.routes.js'
import empresaRouter from './routes/address.routes.js'

import { readFile } from 'fs/promises';

config();

let serviceAccount = JSON.parse(await readFile("serviceAccountKey.json", "utf8"));


const PORT = process.env.PORT || 4000;
const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use(cors());
app.options('*', cors());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla'
}));
app.disable('x-powered-by');
app.enable('trust proxy');

// server routes
// user route
app.use('/api/users', userRouter);
app.use('/api/empresas', empresaRouter);
app.use('/api/address', addressRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

app.listen(PORT, () => {
    console.log(`servidor working in: http://localhost:${PORT}`.cyan);
})