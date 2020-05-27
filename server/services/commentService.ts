import { ICommentDocument } from "../interfaces/CommentInterface";
import { Comment } from "./../models";

export default class CommentService {
    static postComment = async (data: ICommentDocument): Promise<Array<ICommentDocument>> => {
        const newComment = await Comment.create(data);
        if(!newComment) { throw new Error };

        return await Comment.getBlogComments(newComment.blogId);
    };

    static deleteComment = async (commentId: string): Promise<Array<ICommentDocument>> => {
        const comment = await Comment.findOneAndRemove({ _id: commentId });
        if(!comment) { throw new Error };

        const deletedComment = await comment.remove();
        return await Comment.getBlogComments(deletedComment.blogId);
    };
}



