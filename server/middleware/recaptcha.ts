import { RequestHandler } from "express";
import request from "request-promise";

import { ErrorHandler } from "../utils/error";
import config from "../config";


const recaptcha: RequestHandler = async (req, res, next) => {
    if(req.body.count < 3) return next();

    try {
        if(!req.body.captcha) { throw new Error };

        try {
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${ config.RECAPTCHA_KEY }&response=${ req.body.captcha }`;
            const response = await request(verifyUrl);

            if(!JSON.parse(response).success) throw new Error("Failed captcha verification");

            next();
        } catch (err) {
            next(new ErrorHandler(409, "Failed captcha verification"));
        }

    } catch (err) {
        next(new ErrorHandler(409, "Please select captcha"));
    }
};

export default recaptcha;