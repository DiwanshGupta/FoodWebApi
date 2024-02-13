import jwt from "jsonwebtoken";
import { createError } from './error.js'

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }
    const jwtToken = token.replace("Bearer", "").trim();
    try {
        jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) return next(createError(403, "Token is not valid!"));
            req.user = user;
            next();
        });
    } catch (error) {
        return next(createError(403, "Token is not valid!"));
    }
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};
