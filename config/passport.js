import jwt from 'passport-jwt';
import { findById } from '../models/User.js';

const Estrategy = jwt.Strategy;
const Extrac = jwt.ExtractJwt;

const passportFunction = passport => {
    // console.log(process.env.SECRETA);
    let opts = {};
    opts.jwtFromRequest = Extrac.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = process.env.SECRETA;
    passport.use(new Estrategy(opts, (jwt_payload, done) => {
        findById(jwt_payload.id, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }))
}

export default passportFunction;