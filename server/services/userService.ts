import { User } from "../models";
import { IUserDocument, ChangedUserInfoType } from "../interfaces/UserInterface";
import { ItemsDataType } from "../interfaces";
import { File } from "../interfaces/MulterInterface";
import { createFolder, setFolderPath } from "../utils/common";


export default class UserService {
    static login = async (email: string, password: string): Promise<string> => {
        const user = await User.findByCredentials(email, password);
        return await user.generateAuthToken();
    };

    static register = async (email: string, password: string, body: IUserDocument ): Promise<IUserDocument> => {
        const user = await User.create(body);
        if(!user) { throw new Error("Error: can not create user") };

        await createFolder(`uploads/${ email }`);
        await createFolder(setFolderPath(email, "images"));
        await createFolder(setFolderPath(email, "message"));
        await createFolder(setFolderPath(email, "audio_recordings"));

        return user;
    };

    static getUsers = async (data: ItemsDataType): Promise<IUserDocument[]> =>
        await User.find({ _id: { $ne: data.userId } }, { password: 0, dialogs: 0, status: 0 })
            .skip(Number(data.limit) * (Number(data.page) - 1))
            .limit(Number(data.limit));


    static uploadAvatar = async (file: File, email: string): Promise<string> => {
        const avatarPath = file.path.substring(file.path.indexOf("uploads"));

        await User.findOneAndUpdate({ email }, { avatar: avatarPath });
        return avatarPath;
    };

    static removeUser = async (userId: string) => {
        const user = await User.findOneAndRemove({ _id: userId });

        if(!user) { throw new Error };
        await user.remove();
    };

    static searchUserByEmail = async (data: { value: string, userId: string }): Promise<IUserDocument> => {
        const user = await User.findOne({ _id: { $ne: data.userId }, email: data.value });
        if(!user) { throw new Error("User is not founded") };

        return user;
    };

    static setOnlineStatus = async (userId: string, isOnline: boolean) => {
        const user = await User.findOneAndUpdate({ _id: userId }, { isOnline });
        if(!user) { throw new Error("Error with setting online status") };
    };

    static setUserStatus = async (newStatus: string, userId: string) => {
        const status = User.findOneAndUpdate(
            { _id: userId },
            { $set: { status: newStatus } },
            { fields: { status: 1, _id: 0 } , new: true});

        if(!status) { throw new Error("Error with status setting") };
        return status;
    };

    static changeUserInfo = async (userId: string, data: ChangedUserInfoType) => {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            data,
            { fields: { firstName: 1, _id: 0, secondName: 1}, new: true });

        if(!user) { throw new Error("Error! user data not changed") };
        return user;
    };

    static getUserInfo = async (userId: string): Promise<IUserDocument> => {
        const user = await User.findById(userId).select(["-dialogs"]);

        if(!user) { throw new Error("Error. User not founded") };
        return user;
    };
}

