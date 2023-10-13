import CommentConcept from "./concepts/comment";
import ConnectionConcept from "./concepts/connection";
import FavoriteConcept from "./concepts/favorite";
import FeatureConcept from "./concepts/feature";
import FriendConcept from "./concepts/friend";
import JobConcept from "./concepts/job";
import LikeConcept from "./concepts/like";
import MessageConcept from "./concepts/message";
import PortfolioConcept from "./concepts/portfolio";
import PostConcept from "./concepts/post";
import ReviewConcept from "./concepts/review";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Review = new ReviewConcept();
export const Message = new MessageConcept();
export const Portfolio = new PortfolioConcept();
export const Connection = new ConnectionConcept();
export const Favorite = new FavoriteConcept();
export const Feature = new FeatureConcept();
export const Comment = new CommentConcept();
export const Like = new LikeConcept();
export const Job = new JobConcept();
