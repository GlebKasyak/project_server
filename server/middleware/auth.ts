import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";

import { User } from "../models";
import { DecodedDataType } from "../interfaces";

const auth: RequestHandler = async (req, res, next) => {
    if(req.method === "OPTIONS") return next();

    try {
        const header = req.header("Authorization");
        if(!header) { throw new Error("Authorization header is absent") };

        const token = header.replace("Bearer ", "");

        if(!token) { throw new Error };

        const decoded = await verify(token, "secret") as DecodedDataType;
        const user = await User.findById(decoded.userId).select("-password -updatedAt");

        if(!user) { throw new Error("There is no such users") };

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).json({ message: "No authorization", err });
    }
};

export default auth;