import { Router } from 'express';
import { loginUser } from '../controllers/userController.js';
import multer from 'multer';
import passport from 'passport';

// import passport from 'passport';

const upload = multer({
    storage: multer.memoryStorage(),
})

const router = Router();

router.post('/login', loginUser)
    .post('/nuevo',
        upload.array('image', 1),
        registrarUsuario
    )
    .get('/usersNoDelivery',
        passport.authenticate('jwt', { session: false }), obtenerUsuariosNoDelivery
    )
    .post('/updateUserToDelivery',
        passport.authenticate('jwt', { session: false }), asignarRolDelivery
    )
    .get('/findByid/:id',
        passport.authenticate('jwt', { session: false }), obtenerUsuarioPorId
    )


export default router;