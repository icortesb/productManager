import passport from "passport";
import {Strategy} from "passport-local";
import {UserManager} from "../dao/mongo/controllers/userManager.js";
import {createHash, isValidPassword} from "../utils/bcrypt.js";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import User from "../dao/mongo/models/users.model.js";
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
                    console.log(`En register passport response: ${response}`);
                    return done(null, response);
                } catch (error) {
                    console.error(`Error al crear el usuario: ${error}, ${error.cause}, code: ${error.code}`
                    );
                    return done(null, false, error);
                }
            }
        )
    );

    passport.use(
        "login",
        new Strategy(
            {usernameField: "user", passReqToCallback: true},
            async (req, user, password, done) => {
                try {
                    let userExists = await User.findOne({user});
                    if (userExists.user !== user) {
                        return done(null, false, {
                            message: "Error, usuario no existe",
                        });
                    }
                    const isValid = await isValidPassword(
                        password,
                        userExists.password
                    );

                    if (!isValid) {
                        return done(null, false, {
                            message: "Error, contraseña incorrecta",
                        });
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
                clientSecret: process.env.GITHUB_SECRET,
                callbackURL: `http://localhost:8080/api/sessions/callbackGithub`,
            },
            async (accesToken, refreshToken, profile, done) => {
                try {
                    let email = profile._json.email || profile._json.login; // En mi caso, email estaba como null, por lo que use el login como email
                    let userExists = await User.findOne({user: email});

                    if (!userExists) {
                        userExists = await userManager.createUser({
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
                secretOrKey: process.env.JWT_SECRET,
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

    passport.use(
        "current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: process.env.JWT_SECRET,
            },
            async (payload, done) => {
                try {
                    const user = await User.find({user: payload.user});
                    return done(null, user);
                } catch (error) {
                    return done(`Error al buscar el usuario: ${error}`);
                }
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.authenticate("register", {
        failureRedirect: "/failedRegister",
    });
    passport.authenticate("login", {
        failureRedirect: "/failedLogin",
        successRedirect: "/products",
    });
};
