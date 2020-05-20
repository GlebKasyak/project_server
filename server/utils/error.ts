import { Application, Request, Response, NextFunction } from "express";

export const handleError = (app: Application) => {
    app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
        const status = err.status || 500;
        const message = err.message || "Server error";

        res.status(status).json({
            status: "error",
            message,
            success: false
        });
    });
};

export class ErrorHandler extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}