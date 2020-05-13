import { User } from "../models";
import { IUserDocument } from "../interfaces/UserInterface";
import { ItemsDataType } from "../interfaces";
import { File } from "../interfaces/MulterInterface";
import { createFolder, setFolderPath, removeFolder } from "../utils/common";

export default class UserService {
    static login = async (email: string, password: string): Promise<string> => {
        const user = await User.findByCredentials(email, password);
        return await user.generateAuthToken();
    };

    static register = async (email: string, password: string, body: IUserDocument ): Promise<IUserDocument> => {
        const user = await User.create(body);
        if(!user) throw new Error("Error: can not create user");

        await createFolder(`uploads/${ email }`);
        await createFolder(setFolderPath(email, "images"));
        await createFolder(setFolderPath(email, "message"));
        await createFolder(setFolderPath(email, "audio_recordings"));

        return user;
    };

    static getUsers = async (data: ItemsDataType): Promise<IUserDocument[]> =>
        await User.find({ _id: { $ne: data.userId } })
            .skip(Number(data.limit) * (Number(data.page) - 1))
            .limit(Number(data.limit));


    static uploadAvatar = async (file: File, email: string): Promise<string> => {
        const avatarPath = file.path.substring(file.path.indexOf("uploads"));

        await User.findOneAndUpdate({ email }, { avatar: avatarPath });
        return avatarPath;
    };

    static removeUser = async (userId: string, email: string) => {
        const user = await User.findOneAndRemove({ _id: userId });

        if(!user) throw new Error;
        await user.remove();

        await removeFolder(`uploads/${ email }`);
    };

    static searchUserByEmail = async (data: { value: string, userId: string }): Promise<IUserDocument> => {
        const user = await User.findOne({ _id: { $ne: data.userId }, email: data.value });
        if(!user) throw new Error("User is not founded");

        return user;
    };

    static setOnlineStatus = async (userId: string, isOnline: boolean) => {
        const user = await User.findOneAndUpdate({ _id: userId }, { isOnline });
        if(!user) throw new Error("Error with setting user status");
    };

}

