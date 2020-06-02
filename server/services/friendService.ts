import { User } from "../models";
import { ItemsDataType } from "../interfaces";

export default class UserService {
    static addNewFriend = async (userId: string, selfId: string) => {
        return await User.addOrRemoveFriend(userId, selfId, "add")
    };

    static removeFriend = async (userId: string, selfId: string) =>
        await User.addOrRemoveFriend(userId, selfId, "remove");

    static getFriends = async (data: ItemsDataType) => {
        const filter = data.filter === "online" ? { isOnline: true } : null;

        let match = {};
        if(data.value) {
            match = {
                $or: [
                    { firstName: { $regex: data.value, $options: "i" }},
                    { secondName: { $regex: data.value, $options: "i" }},
                ]
            }
        };

        const res = await User.findById(data.userId, { _id: 0, friends: 1 })
            .populate({
                path: "friends",
                match: { ...match, ...filter },
                options: { limit: data.limit, skip: +data.page * +data.limit }
            });

        if(!res) { throw new Error("Friends not found") };
        return res.friends;
    };
}

