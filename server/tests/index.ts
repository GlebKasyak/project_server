import App from "../app";
import chai from "chai";
import chaiHttp from "chai-http";

import userTests from "./userTests";

let should = chai.should();
chai.use(chaiHttp);

process.env.NODE_ENV = "test";

userTests(App, chai);


