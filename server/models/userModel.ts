import { Schema, model, Types } from "mongoose";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import Dialog from "./dialogModel";
import Message from "./messageModel";
import Blog from "./blogModel";
import Reaction from "./reactionModel";
import Comment from "./commentModel";

import { IUserDocument, IUserModel } from "../interfaces/UserInterface";
import { removeFolder } from "../utils/common";
import { urls } from "../shared/constants";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    secondName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        min: 4,
        trim: true
    },
    avatar: {
        type: String,
        default: urls.defaultAvatar
    },
    dialogs: [{ type: Types.ObjectId, ref: "Dialog" }],
    isOnline: {
        type: Boolean,
        default: false
    },
    status: String,
    friends: [{ type: Types.ObjectId, ref: "User" }],
}, {
    timestamps: true
});

userSchema.pre<IUserDocument>("save", async function(next) {
    const user = this;

    if(user.isModified("password")) {
        user.password = await hash(user.password, 15)
    }
    next();
});


userSchema.post("remove", async function(user: IUserDocument) {
    await Dialog.deleteMany({ _id: { $in: user.dialogs } });
    await Message.deleteMany({ $or: [{ author: user._id }, { partner: user._id }] });
    await Blog.deleteMany({ author: user._id });
    await Reaction.deleteMany({ author: user._id });
    await Comment.deleteMany({ writer: user._id });

    await User.updateMany({}, { $pull: { friends: user._id } } );
    await removeFolder(`uploads/${ user.email }`);
});

userSchema.statics.findByCredentials = async (email: string, password: string): Promise<IUserDocument> => {
    const user = await User.findOne({ email }) as IUserDocument;
    if(!user) throw new Error("Incorrect data during sign in system");

    const isMatch = await compare(password, user.password);
    if(!isMatch) throw new Error("Password is incorrect, please try again");

    return user;
};

userSchema.statics.addOrRemoveFriend = async (userId: string, selfId: string, type: "remove" | "add") => {
    const update = (id: string) => type === "add"
        ? { $push: { friends: id } }
        : { $pull: { friends: id } };

    await User.findOneAndUpdate({ _id: selfId }, update(userId));
    await User.findOneAndUpdate({ _id: userId }, update(selfId), { new: true });
};

userSchema.methods.generateAuthToken = async function(): Promise<string> {
    const user = this as IUserDocument;
    return sign({ userId: user._id }, "secret", { expiresIn: "1h" });
};


const User = model<IUserDocument, IUserModel>("User", userSchema);
export default User;
