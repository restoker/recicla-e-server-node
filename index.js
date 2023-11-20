import express from 'express';
import hola from 'colors';
import helmet from 'helmet';
import logger from 'morgan';
import { config } from 'dotenv';
import cors from 'cors'
import userRouter from './routes/user.routes.js'

config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.disable('x-powered-by');

// server routes
// user route
app.use('/api/users', userRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

app.listen(PORT, () => {
    console.log(`servidor working in: http://localhost:${PORT}`.cyan);
})