import { ObjectId } from "mongodb";
import { Post, User } from "./app";
import { CommentAuthorNotMatchError } from "./concepts/comment";
import { AlreadyConnectedError, ConnectionNotFoundError, ConnectionRequestAlreadyExistsError, ConnectionRequestDoc, ConnectionRequestNotFoundError } from "./concepts/connection";
import { AlreadyFavoritedError, FavoriteNotFoundError } from "./concepts/favorite";
import { FeatureActiveError, FeatureInactiveError } from "./concepts/feature";
import { AlreadyAppliedError, EmployerApplicantMatchError, JobDoc, JobEmployerNotMatchError, NotAppliedError } from "./concepts/job";
import { AlreadyLikedError, LikeAuthorNotMatchError, LikeDoc, NotLikedError } from "./concepts/like";
import { MessageDoc } from "./concepts/message";
import { PortfolioDoc } from "./concepts/portfolio";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/post";
import { ReviewDoc } from "./concepts/review";
import { Router } from "./framework/router";

interface SanitizedJob {
  numApplicants: number;
  employer: ObjectId;
  content: string;
  status: "Active" | "Inactive";
  _id: ObjectId;
  dateCreated: Date;
  dateUpdated: Date;
}

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await User.getUserById(post.author);
    return { ...post, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await User.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  /**
   * Convert MessageDoc into more readable format for the frontend by converting the to/from id into usernames.
   */
  static async message(message: MessageDoc | null) {
    if (!message) {
      return message;
    }
    const to = await User.getUserById(message.to);
    const from = await User.getUserById(message.from);
    return { ...message, to: to.username, from: from.username };
  }

  /**
   * Convert MessageDoc array into more readable format for the frontend by converting the to/from id into usernames.
   */
  static async messages(messages: MessageDoc[]) {
    const tos = await User.idsToUsernames(messages.map((m) => m.to));
    const froms = await User.idsToUsernames(messages.map((m) => m.from));
    return messages.map((m, i) => ({ ...m, to: tos[i], from: froms[i] }));
  }

  /**
   * Convert CommentDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async comments(comments: LikeDoc[]) {
    const authors = await User.idsToUsernames(comments.map((comment) => comment.author));
    return comments.map((comment, i) => ({ ...comment, author: authors[i] }));
  }

  /**
   * Convert LikeDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async likes(likes: LikeDoc[]) {
    const authors = await User.idsToUsernames(likes.map((like) => like.author));
    return likes.map((like, i) => ({ ...like, author: authors[i] }));
  }

  /**
   * Convert ConnectionRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async connectionRequests(requests: ConnectionRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await User.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }

  /**
   * Convert ReviewDoc into more readable format for the frontend by converting the author and subject ids into a username.
   */
  static async review(review: ReviewDoc | null) {
    if (!review) {
      return review;
    }
    const subject = await User.getUserById(review.subject);
    const author = await User.getUserById(review.author);
    return { ...review, author: author.username, subject: subject.username };
  }

  /**
   * Same as {@link review} but for an array of ReviewDoc for improved performance.
   */
  static async reviews(reviews: ReviewDoc[]) {
    const authors = await User.idsToUsernames(reviews.map((r) => r.author));
    const subjects = await User.idsToUsernames(reviews.map((r) => r.subject));
    return reviews.map((review, i) => ({ ...review, author: authors[i], subject: subjects[i] }));
  }

  /**
   * Convert JobDoc into more readable format for the frontend by converting the employer and applicant ids into a username.
   */
  static async job(job: JobDoc | null) {
    if (!job) {
      return job;
    }
    const employer = await User.getUserById(job.employer);
    const applicants = await User.idsToUsernames(job.applicants);
    return { ...job, employer: employer.username, applicants: applicants };
  }

  /**
   * Convert SanitizedJob into more readable format for the frontend by converting the employer and applicant ids into a username.
   */
  static async sanitizedJob(job: SanitizedJob | null) {
    if (!job) {
      return job;
    }
    const employer = (await User.idsToUsernames([job.employer]))[0];
    return { ...job, employer: employer };
  }

  /**
   * Same as {@link job} but for an array of JobDoc for improved performance.
   */
  static async jobs(jobs: SanitizedJob[]) {
    const result = [];
    for (const j of jobs) {
      const jobResp = await Responses.sanitizedJob(j);
      result.push(jobResp);
    }
    return result;
  }

  /**
   * Convert PortfolioDoc into more readable format for the frontend by converting the author id into a username
   * and post ids into posts
   */
  static async portfolio(portfolio: PortfolioDoc | null) {
    if (!portfolio) {
      return portfolio;
    }
    const owner = await User.getUserById(portfolio.owner);
    const content = [];
    for (const p of portfolio.content) {
      const post = await Post.getPostById(p);
      content.push(await Responses.post(post));
    }
    return { ...portfolio, owner: owner.username, content: content };
  }

  /**
   * Same as {@link portfolio} but for an array of PortfolioDoc for improved performance.
   */
  static async portfolios(portfolios: PortfolioDoc[]) {
    const result = [];
    for (const p of portfolios) {
      const portfolioResp = await Responses.portfolio(p);
      result.push(portfolioResp);
    }
    return result;
  }
}

// TODO add for other errors (portfolio, etc)
Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(ConnectionRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(ConnectionNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(ConnectionRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyConnectedError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FavoriteNotFoundError, async (e) => {
  const [fan, fav] = await Promise.all([User.getUserById(e.fan), User.getUserById(e.fav)]);
  return e.formatWith(fan.username, fav.username);
});

Router.registerError(AlreadyFavoritedError, async (e) => {
  const [fan, fav] = await Promise.all([User.getUserById(e.fan), User.getUserById(e.fav)]);
  return e.formatWith(fan.username, fav.username);
});

Router.registerError(FeatureActiveError, async (e) => {
  const username = (await User.getUserById(e.user)).username;
  return e.formatWith(username);
});

Router.registerError(FeatureInactiveError, async (e) => {
  const username = (await User.getUserById(e.user)).username;
  return e.formatWith(username);
});

Router.registerError(CommentAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(LikeAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(NotLikedError, async (e) => {
  const username = (await User.getUserById(e.user)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(AlreadyLikedError, async (e) => {
  const username = (await User.getUserById(e.user)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(AlreadyAppliedError, async (e) => {
  const username = (await User.getUserById(e.applicant)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(NotAppliedError, async (e) => {
  const username = (await User.getUserById(e.applicant)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(JobEmployerNotMatchError, async (e) => {
  const username = (await User.getUserById(e.employer)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(EmployerApplicantMatchError, async (e) => {
  const username = (await User.getUserById(e.applicant)).username;
  return e.formatWith(username, e._id);
});
