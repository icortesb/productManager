import passport from "passport";
import { Strategy } from "passport-local";
import { UserManager } from "../dao/mongoManagers/usersManager.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import User from "../dao/models/users.model.js";

const userManager = new UserManager();

export const initializePassport = () => {

    passport.use('register', new Strategy(
        {usernameField: 'user', passReqToCallback: true},
        async (req, user, password, done) => {
            try {
                const response = await userManager.createUser(req.body);
                if (!response) {
                  return done(null, false, { message: "Error, usuario ya existe" });
                }
                return done(null, response);
              } catch (err) {
                return done("Error al crear el usuario", err);
              }
        }
    ))

    passport.use('login', new Strategy(
        {usernameField: 'user', passReqToCallback: true},
        async (req, user, password, done) => {
            try {
                let userExists = await User.findOne({user});
            

                console.log(`userExists.user: ${userExists.user}, user: ${user}, Evaluacion: ${userExists.user !== user}`)
                if (userExists.user !== user) {
                  return done(null, false, { message: "Error, usuario no existe" });
                }
                console.log(`YA PASO EL IF`)
                console.log(`user.password: ${password}, userExists.password: ${userExists.password}`)
                const isValid = await isValidPassword(password, userExists.password);
                console.log(`isValid: ${isValid}`)

                if (!isValid) {
                  return done(null, false, { message: "Error, contraseña incorrecta" });
                }
                return done(null, userExists);
              } catch (err) {
                return done("Error al loguear el usuario", err);
              }
        }
    
    ))


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.authenticate('register', {
        failureRedirect: '/failedRegister',
    })
    passport.authenticate('login', {
        failureRedirect: '/failedLogin',
        successRedirect: '/products'
    })

}