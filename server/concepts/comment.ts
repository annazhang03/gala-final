import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
  post: ObjectId;
  author: ObjectId;
  comment: string;
}

export default class CommentConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async comment(post: ObjectId, author: ObjectId, comment: string) {
    const _id = await this.comments.createOne({ post, author, comment });
    return { msg: "Comment successful!", comment: await this.comments.readOne({ _id }) };
  }

  async update(_id: ObjectId, update: Partial<CommentDoc>) {
    this.sanitizeUpdate(update);
    await this.comments.updateOne({ _id }, update);
    return { msg: "Comment successfully updated!" };
  }

  async getComments(post: ObjectId) {
    const comments = await this.comments.readMany(
      { post },
      {
        sort: { dateUpdated: -1 },
      },
    );
    return comments;
  }

  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted successfully!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== user.toString()) {
      throw new CommentAuthorNotMatchError(user, _id);
    }
  }

  private sanitizeUpdate(update: Partial<CommentDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["comment"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class CommentAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of comment {1}!", author, _id);
  }
}
