import { Application } from "express";

import userServices from "./userServices.test";
import usersRouters from "./usersRouters.test";

export default (app: Application, chai: Chai.ChaiStatic) => {
    usersRouters(app, chai);
    userServices();
}