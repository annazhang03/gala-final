import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Comment, Connection, Favorite, Feature, Job, Like, Message, Portfolio, Post, Review, User, WebSession } from "./app";
import { CommentDoc } from "./concepts/comment";
import { JobDoc } from "./concepts/job";
import { MessageDoc } from "./concepts/message";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers(username?: string) {
    if (username) {
      return [await User.getUserByUsername(username)];
    }
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string, role?: "Spectator" | "Artist") {
    WebSession.isLoggedOut(session);
    return await User.create(username, password, role);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    if (update.portfolio) {
      await Portfolio.isOwner(user, update.portfolio);
      await User.canHavePortfolio(user);
    }
    if (update.role === "Spectator") {
      update.portfolio = undefined;
    }
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.get("/feed")
  async getFeed() {
    const posts = await Post.getPosts({});
    const feed: PostDoc[] = [];
    for (const post of posts) {
      if (await User.userActive(post.author)) {
        const author = await User.getUserById(post.author);
        if (author.role === "Artist") {
          feed.push(post);
        }
      }
    }
    return Responses.posts(feed);
  }

  @Router.get("/feed/friends")
  async getFeedWithFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const posts = await Post.getPosts({});
    const feed: PostDoc[] = [];
    for (const post of posts) {
      if (await User.userActive(post.author)) {
        const author = await User.getUserById(post.author);
        if (author.role === "Artist" && ((await Connection.areConnected(post.author, user)) || (await Favorite.isFavorited(user, post.author)))) {
          feed.push(post);
        }
      }
    }
    return Responses.posts(feed);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    const portfolio = await User.getPortfolio(user);
    if (portfolio && created.post) {
      await Portfolio.addPostToPortfolio(created.post._id, portfolio);
    }
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  // routes for Connection concept
  @Router.get("/connections")
  async getConnections(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Connection.getConnections(user));
  }

  @Router.delete("/connections/:connection")
  async removeConnection(session: WebSessionDoc, connection: string) {
    const user = WebSession.getUser(session);
    const connId = (await User.getUserByUsername(connection))._id;
    if (await Favorite.isFavorited(user, connId)) {
      await Favorite.removeFavorite(user, connId);
    }
    return await Connection.removeConnection(user, connId);
  }

  @Router.get("/connection/requests")
  async getConnectionRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.connectionRequests(await Connection.getRequests(user));
  }

  @Router.post("/connection/requests/:to")
  async sendConnectionRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    if (!(await Favorite.isFavorited(user, toId))) {
      await Favorite.addFavorite(user, toId);
    }
    return await Connection.sendRequest(user, toId);
  }

  @Router.delete("/connection/requests/:to")
  async removeConnectionRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Connection.removeRequest(user, toId);
  }

  @Router.put("/connection/accept/:from")
  async acceptConnectionRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    if (!(await Favorite.isFavorited(user, fromId))) {
      await Favorite.addFavorite(user, fromId);
    }
    return await Connection.acceptRequest(fromId, user);
  }

  @Router.put("/connection/reject/:from")
  async rejectConnectionRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Connection.rejectRequest(fromId, user);
  }

  // routes for Favorite concept
  @Router.get("/favorites")
  async getFavorites(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Favorite.getFavorites(user));
  }

  @Router.get("/fans")
  async getFans(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Favorite.getFans(user));
  }

  @Router.delete("/favorites/:favorite")
  async removeFavorite(session: WebSessionDoc, favorite: string) {
    const user = WebSession.getUser(session);
    const favId = (await User.getUserByUsername(favorite))._id;
    return await Favorite.removeFavorite(user, favId);
  }

  @Router.delete("/fans/:fan")
  async removeFan(session: WebSessionDoc, fan: string) {
    const user = WebSession.getUser(session);
    const fanId = (await User.getUserByUsername(fan))._id;
    return await Favorite.removeFavorite(fanId, user);
  }

  @Router.post("/favorite/:favorite")
  async addFavorite(session: WebSessionDoc, favorite: string) {
    const user = WebSession.getUser(session);
    const favId = (await User.getUserByUsername(favorite))._id;
    if ((await Favorite.isFavorited(favId, user)) && !(await Connection.areConnected(favId, user))) {
      await Connection.addConnection(favId, user);
    }
    return await Favorite.addFavorite(user, favId);
  }

  @Router.get("/reviews")
  async getReviews(subject?: string) {
    let reviews;
    if (subject) {
      const id = (await User.getUserByUsername(subject))._id;
      reviews = await Review.getReviewBySubject(id);
    } else {
      reviews = await Review.getReviews({});
    }
    return Responses.reviews(reviews);
  }

  @Router.post("/reviews")
  async createReview(session: WebSessionDoc, subject: string, content: string) {
    const user = WebSession.getUser(session);
    const subjectId = (await User.getUserByUsername(subject))._id;
    await Review.canReview(user, subjectId);
    const created = await Review.create(user, subjectId, content);
    return { msg: created.msg, review: await Responses.review(created.review) };
  }

  @Router.patch("/reviews/:_id")
  async updateReview(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Review.isAuthor(user, _id);
    return await Review.update(_id, update);
  }

  @Router.delete("/reviews/:_id")
  async deleteReview(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Review.isAuthor(user, _id);
    return Review.delete(_id);
  }

  @Router.get("/jobs")
  async getJobs(status?: "Active" | "Inactive", employer?: string) {
    let jobs;
    if (employer) {
      const id = (await User.getUserByUsername(employer))._id;
      if (status) {
        jobs = await Job.getJobs({ status, employer: id });
      } else {
        jobs = await Job.getJobs({ employer: id });
      }
    } else if (status) {
      jobs = await Job.getJobByStatus(status);
    } else {
      jobs = await Job.getJobs({});
    }
    return await Responses.jobs(jobs);
  }

  @Router.get("/job/:job")
  async getJobById(job: ObjectId) {
    return await Responses.sanitizedJob(await Job.getJobById(job));
  }

  @Router.get("/job/applicants/:job")
  async getJobApplicants(session: WebSessionDoc, job: ObjectId) {
    const user = WebSession.getUser(session);
    await Job.isEmployer(job, user);
    return await Responses.job(await Job.getJobWithApplicants(job));
  }

  @Router.get("/jobs/applied")
  async getJobsApplied(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    // await Job.isEmployer(job, user);
    return await Responses.jobs(await Job.getJobsApplied(user));
  }

  @Router.post("/job")
  async postJob(session: WebSessionDoc, content: string) {
    const user = WebSession.getUser(session);
    const created = await Job.post(user, content);
    return { msg: created.msg, job: Responses.job(created.job) };
  }

  @Router.patch("/job/update/:job")
  async updateJob(session: WebSessionDoc, job: ObjectId, update: Partial<JobDoc>) {
    const user = WebSession.getUser(session);
    await Job.isEmployer(job, user);
    return await Job.update(job, update);
  }

  @Router.patch("/job/inactive/:job")
  async markJobInactive(session: WebSessionDoc, job: ObjectId) {
    const user = WebSession.getUser(session);
    await Job.isEmployer(job, user);
    return await Job.markInactive(job);
  }

  @Router.delete("/job/:job")
  async deleteJob(session: WebSessionDoc, job: ObjectId) {
    const user = WebSession.getUser(session);
    await Job.isEmployer(job, user);
    return Job.delete(job);
  }

  @Router.patch("/job/apply/:job")
  async applyJob(session: WebSessionDoc, job: ObjectId) {
    const user = WebSession.getUser(session);
    return await Job.apply(job, user);
  }

  @Router.patch("/job/withdraw/:job")
  async withdrawJob(session: WebSessionDoc, job: ObjectId) {
    const user = WebSession.getUser(session);
    return await Job.withdraw(job, user);
  }

  @Router.get("/messages")
  async getMessages(session: WebSessionDoc, user2?: string) {
    const user1 = WebSession.getUser(session);
    let messages;
    if (user2) {
      const id2 = (await User.getUserByUsername(user2))._id;
      messages = await Message.getMessagesWithUser(user1, id2);
    } else {
      messages = await Message.getMessages(user1);
      const connected: MessageDoc[] = [];
      const favorited: MessageDoc[] = [];
      const other: MessageDoc[] = [];
      for (const m of messages) {
        const u2 = m.from.toString() !== user1.toString() ? m.from : m.to;
        if (await Connection.areConnected(user1, u2)) {
          connected.push(m);
        } else if (await Favorite.isFavorited(user1, u2)) {
          favorited.push(m);
        } else {
          other.push(m);
        }
      }
      messages = [...connected, ...favorited, ...other];
    }
    return Responses.messages(messages);
  }

  @Router.get("/messages/:user")
  async getMessagesWithUser(session: WebSessionDoc, user: string) {
    const user1 = WebSession.getUser(session);
    const id2 = (await User.getUserByUsername(user))._id;
    const messages = await Message.getMessagesWithUser(user1, id2);
    return Responses.messages(messages);
  }

  @Router.get("/messages/unread")
  async getUnreadMessages(session: WebSessionDoc, user2?: string) {
    const user1 = WebSession.getUser(session);
    let messages;
    if (user2) {
      const id2 = (await User.getUserByUsername(user2))._id;
      messages = await Message.getUnreadMessagesWithUser(user1, id2);
    } else {
      messages = await Message.getUnreadMessages(user1);
      const connected: MessageDoc[] = [];
      const favorited: MessageDoc[] = [];
      const other: MessageDoc[] = [];
      for (const m of messages) {
        const u2 = m.from.toString() !== user1.toString() ? m.from : m.to;
        if (await Connection.areConnected(user1, u2)) {
          connected.push(m);
        } else if (await Favorite.isFavorited(user1, u2)) {
          favorited.push(m);
        } else {
          other.push(m);
        }
      }
      messages = [...connected, ...favorited, ...other];
    }
    return Responses.messages(messages);
  }

  @Router.post("/messages")
  async sendMessage(session: WebSessionDoc, to: string, content: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Message.sendMessage(user, toId, content);
  }

  // routes for Portfolio concept
  @Router.get("/portfolio")
  async getPortfolios(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const portfolios = await Portfolio.getPortfolios(user);
    return await Responses.portfolios(portfolios);
  }

  @Router.get("/portfolio/:owner")
  async getUserPortfolio(owner: string) {
    const id = (await User.getUserByUsername(owner))._id;
    const portfolio = await User.getPortfolio(id);
    if (!portfolio) {
      return undefined;
    }
    const portfolioObj = await Portfolio.getPortfolioById(portfolio);
    return await Responses.portfolio(portfolioObj);
  }

  @Router.post("/portfolio")
  async createPortfolio(session: WebSessionDoc, content: string, bio: string) {
    const user = WebSession.getUser(session);
    await User.canHavePortfolio(user);
    const contentIds: ObjectId[] = [];
    for (const post of content.split(",")) {
      const postId = new ObjectId(post.trim());
      await Post.isAuthor(user, postId);
      const postObj = await Post.getPostById(postId);
      contentIds.push(postObj._id);
    }
    const created = await Portfolio.create(user, contentIds, bio);
    await User.update(user, { portfolio: created.portfolio?._id });
    return { msg: created.msg, portfolio: await Responses.portfolio(created.portfolio) };
  }

  @Router.patch("/portfolio/:portfolio")
  async updatePortfolio(session: WebSessionDoc, portfolio: ObjectId) {
    const user = WebSession.getUser(session);
    await Portfolio.isOwner(user, portfolio);
    await User.canHavePortfolio(user);
    return await User.update(user, { portfolio });
  }

  @Router.delete("/portfolio/:_id")
  async deletePortfolio(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Portfolio.isOwner(user, _id);
    return Portfolio.delete(_id);
  }

  // routes for Feature concept

  @Router.get("/featured")
  async getFeatured() {
    const feature = await Feature.getFeatured();
    const portfolio = await User.getPortfolio(feature.user);
    if (!portfolio) {
      // won't get here
      throw new Error("No portfolio!");
    }
    const portfolioObj = await Portfolio.getPortfolioById(portfolio);
    return await Responses.portfolio(portfolioObj);
  }

  @Router.get("/feature/:user")
  async hasApplied(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Feature.hasApplied(user);
  }

  @Router.post("/featured")
  async apply(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const portfolio = await User.getPortfolio(user);
    if (!portfolio) {
      throw new Error("Must have portfolio to apply to be featured!");
    }
    return await Feature.apply(user);
  }

  @Router.patch("/featured")
  async withdraw(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Feature.withdraw(user);
  }

  @Router.get("/comments/:post")
  async getComments(post: ObjectId) {
    const comments = await Comment.getComments(post);
    return Responses.comments(comments);
  }

  @Router.post("/comment")
  async postComment(session: WebSessionDoc, post: ObjectId, comment: string) {
    const user = WebSession.getUser(session);
    return await Comment.comment(post, user, comment);
  }

  @Router.patch("/comment/:comment")
  async updateComment(session: WebSessionDoc, comment: ObjectId, update: Partial<CommentDoc>) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(user, comment);
    return await Comment.update(comment, update);
  }

  @Router.delete("/comment/:comment")
  async deleteComment(session: WebSessionDoc, comment: ObjectId) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(user, comment);
    return await Comment.delete(comment);
  }

  @Router.get("/likes/:post")
  async getLikes(post: ObjectId) {
    const likes = await Like.getLikes(post);
    return Responses.likes(likes);
  }

  @Router.post("/like")
  async postLike(session: WebSessionDoc, post: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.like(post, user);
  }

  @Router.delete("/like/:post")
  async deleteLike(session: WebSessionDoc, post: ObjectId) {
    const user = WebSession.getUser(session);
    await Like.alreadyLiked(user, post);
    const like = await Like.getLike(post, user);
    await Like.isAuthor(user, like._id);
    return await Like.unlike(like._id);
  }
}

export default getExpressRouter(new Routes());
