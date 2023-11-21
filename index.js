import express from 'express';
import http from 'http';
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
import addressRouter from './routes/address.routes.js'
import productoRouter from './routes/materiales.routes.js'
import ordenesRouter from './routes/orden.routes.js'
import socketOrden from './sockets/ordenes_recolector_socket.js';
import { Server } from 'socket.io';

import { readFile } from 'fs/promises';

config();

let serviceAccount = JSON.parse(await readFile("serviceAccountKey.json", "utf8"));

// inicializar firebase admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

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
app.use('/api/productos', productoRouter);
app.use('/api/address', addressRouter);
app.use('/api/ordenes', ordenesRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

const server = http.createServer(app);

// socket
export const io = new Server(server);

// sockets
socketOrden(io);

server.listen(PORT, () => {
    console.log(`servidor working in: http://localhost:${PORT}`.cyan);
})