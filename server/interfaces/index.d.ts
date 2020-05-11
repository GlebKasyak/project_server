import { IUserDocument } from "./UserInterface";

declare global {
    namespace Express {
        interface Request {
            user: IUserDocument,
            token: string
        }
    }
}

export type DecodedDataType = {
    userId: string;
    iat: number;
}

export type ItemsDataType = {
    userId: string,
    limit: string,
    page: string
}

interface Callback<T> {
    (data: T): void;
}
