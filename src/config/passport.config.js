import passport from "passport";
import { Strategy } from "passport-local";
import { UserManager } from "../dao/mongoManagers/usersManager.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import User from "../dao/models/users.model.js";
import github from "passport-github2";
import crypto from "crypto";

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

    passport.use('github', new github.Strategy(
        {
            clientID: "Iv1.74e4afe284ae1121",
            clientSecret: "f1fbaa829224017dccbf2680fe7e02f039e5b041",
            callbackURL: "http://localhost:8080/api/sessions/callbackGithub"
        },
        async (accesToken, refreshToken, profile, done) => {
            try {
                let email = profile._json.email || profile._json.login;
                console.log(`email: ${email}`)
                let userExists = await User.findOne({user: email});

                if (!userExists) {
                    userExists = await User.create({ user: email, password: await createHash(crypto.randomBytes(8).toString('hex')) }); // Pass aleatoria para mantener consistencia con el modelo
                }

                return done(null, userExists);

            } catch (error) {
                return done(error)                    
            }
        }
    ))


    passport.serializeUser(function(user, done) {
        done(null, user._id);
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