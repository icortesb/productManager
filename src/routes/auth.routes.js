import {Router} from "express";
import passport from "passport";
import {UserManager} from "../dao/mongo/controllers/userManager.js";

const userManager = new UserManager();
const routerAuth = Router();

routerAuth.post(
    "/register",
    passport.authenticate("register", {
        failureRedirect: "/failedRegister",
    }),
    (req, res) => {
        res.redirect("/login");
    }
);
routerAuth.post("/login", userManager.loginUser);
routerAuth.get("/logout", userManager.logoutUser);
routerAuth.get(
    "/current",
    passport.authenticate("current", {session: false}),
    userManager.getCurrentUser
);
export default routerAuth;
