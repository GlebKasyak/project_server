import { Reaction, Blog } from "../models";
import { IReactionDocument } from "../interfaces/ReactionInterface";


export default class BlogService {
    static createReaction = async (data: IReactionDocument): Promise<IReactionDocument | undefined> => {
        const remoteReaction = await Reaction.findOneAndRemove({ ...data, reaction: { $in: [true, false] }});

        const blog = await Blog.findById(data.blogId);
        if(!blog) { throw new Error("Blog has been deleted") };

        if(!remoteReaction || remoteReaction.reaction !== data.reaction) {
            const reaction = await Reaction.create(data);
            if(!reaction) { throw new Error("Reaction is not created") };

            return reaction;
        }
    };

    static removeReaction = async (data: IReactionDocument): Promise<IReactionDocument> => {
        const remoteReaction = await Reaction.findOneAndRemove(data);
        if(!remoteReaction) { throw new Error("Reaction is not removed")};

        return remoteReaction;
    };
}

