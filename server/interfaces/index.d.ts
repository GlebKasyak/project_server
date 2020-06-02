import { IUserDocument } from "./UserInterface";
import { File } from "./MulterInterface";

declare global {
    namespace Express {
        interface Request {
            user: IUserDocument,
            token: string,
            fieldName: string,
            files: {
                [fieldname: string]: File[]
            }
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
    page: string,
    filter?: string,
    value?: string
}

interface Callback<T> {
    (data: T): void;
}
