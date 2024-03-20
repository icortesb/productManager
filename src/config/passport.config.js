import passport from "passport";
import {Strategy} from "passport-local";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import {UserManager} from "../dao/mongoManagers/usersManager.js";
import {createHash, isValidPassword} from "../utils/bcrypt.js";
import User from "../dao/models/users.model.js";
import github from "passport-github2";
import crypto from "crypto";

const userManager = new UserManager();

export const initializePassport = () => {
    passport.use(
        "register",
        new Strategy(
            {usernameField: "user", passReqToCallback: true},
            async (req, user, password, done) => {
                try {
                    const response = await userManager.createUser(req.body);
                    if (!response) {
                        return done(null, false, {
                            message: "Error, usuario ya existe",
                        });
                    }
                    return done(null, response);
                } catch (err) {
                    return done("Error al crear el usuario", err);
                }
            }
        )
    );

    passport.use(
        "login",
        new Strategy(
            {usernameField: "user", passwordField: "password"},
            async (user, password, done) => {
                try {
                    let userExists = await User.findOne({user: user});
                    if (!userExists) {
                        return done(null, false);
                    }
                    const isValid = await isValidPassword(
                        password,
                        userExists.password
                    );
                    if (!isValid) {
                        return done(null, false);
                    }
                    return done(null, userExists);
                } catch (err) {
                    return done("Error al loguear el usuario", err);
                }
            }
        )
    );

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID: "Iv1.74e4afe284ae1121",
                clientSecret: "f1fbaa829224017dccbf2680fe7e02f039e5b041",
                callbackURL:
                    "http://localhost:8080/api/sessions/callbackGithub",
            },
            async (accesToken, refreshToken, profile, done) => {
                try {
                    let email = profile._json.email || profile._json.login; // En mi caso, email estaba como null, por lo que use el login como email
                    console.log(`email: ${email}`);
                    let userExists = await User.findOne({user: email});

                    if (!userExists) {
                        userExists = await User.create({
                            user: email,
                            password: await createHash(
                                crypto.randomBytes(8).toString("hex")
                            ),
                        }); // Pass aleatoria para mantener consistencia con el modelo
                    }

                    return done(null, userExists);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    const cookieExtractor = function (req) {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies["jwt"];
        }
        return token;
    };

    passport.use(
        "jwt",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: "Coder123",
            },
            async (payload, done) => {
                try {
                    return done(null, payload);
                } catch (error) {
                    return done(`Error al buscar el usuario: ${error}`);
                }
            }
        )
    );
};

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(`Error al buscar el usuario: ${error}`);
    }
});