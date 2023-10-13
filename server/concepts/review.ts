import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ReviewDoc extends BaseDoc {
  author: ObjectId;
  subject: ObjectId;
  content: string;
}

export default class ReviewConcept {
  public readonly reviews = new DocCollection<ReviewDoc>("reviews");

  async create(author: ObjectId, subject: ObjectId, content: string) {
    const _id = await this.reviews.createOne({ author, subject, content });
    return { msg: "Review successfully created!", review: await this.reviews.readOne({ _id }) };
  }

  async getReviews(query: Filter<ReviewDoc>) {
    const reviews = await this.reviews.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return reviews;
  }

  async getReviewBySubject(subject: ObjectId) {
    return await this.getReviews({ subject: subject });
  }

  async update(_id: ObjectId, content: Partial<ReviewDoc>) {
    await this.reviews.updateOne({ _id }, content);
    return { msg: "Review successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.reviews.deleteOne({ _id });
    return { msg: "Review deleted successfully!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const review = await this.reviews.readOne({ _id });
    if (!review) {
      throw new NotFoundError(`Review ${_id} does not exist!`);
    }
    if (review.author.toString() !== user.toString()) {
      throw new ReviewAuthorNotMatchError(user, _id);
    }
  }

  async canReview(author: ObjectId, subject: ObjectId) {
    if (author.toString() === subject.toString()) {
      throw new NoSelfReviewError();
    }
  }
}

export class ReviewAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of review {1}!", author, _id);
  }
}

export class NoSelfReviewError extends NotAllowedError {
  constructor() {
    super("Cannot leave a self review!");
  }
}
