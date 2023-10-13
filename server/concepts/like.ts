import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface LikeDoc extends BaseDoc {
  post: ObjectId;
  author: ObjectId;
}

export default class LikeConcept {
  public readonly likes = new DocCollection<LikeDoc>("likes");

  async like(post: ObjectId, author: ObjectId) {
    await this.notLiked(author, post);
    await this.likes.createOne({ post, author });
    return { msg: "Like successful!" };
  }

  async getLike(post: ObjectId, author: ObjectId) {
    const like = await this.likes.readOne({ post, author });
    if (!like) {
      throw new NotLikedError(author, post);
    }
    return like;
  }

  async getLikes(post: ObjectId) {
    const likes = await this.likes.readMany(
      { post },
      {
        sort: { dateUpdated: -1 },
      },
    );
    return likes;
  }

  async unlike(_id: ObjectId) {
    await this.likes.deleteOne({ _id });
    return { msg: "Unlike successful!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const like = await this.likes.readOne({ _id });
    if (!like) {
      throw new NotFoundError(`Like ${_id} does not exist!`);
    }
    if (like.author.toString() !== user.toString()) {
      throw new LikeAuthorNotMatchError(user, _id);
    }
  }

  async notLiked(user: ObjectId, post: ObjectId) {
    const like = await this.likes.readOne({ post, author: user });
    if (like) {
      throw new AlreadyLikedError(user, post);
    }
  }

  async alreadyLiked(user: ObjectId, post: ObjectId) {
    const like = await this.likes.readOne({ post, author: user });
    if (!like) {
      throw new NotLikedError(user, post);
    }
  }
}

export class LikeAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of like {1}!", author, _id);
  }
}

export class AlreadyLikedError extends NotAllowedError {
  constructor(
    public readonly user: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} already liked {1}!", user, _id);
  }
}

export class NotLikedError extends NotAllowedError {
  constructor(
    public readonly user: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} hasn't liked {1}!", user, _id);
  }
}
