import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface MessageDoc extends BaseDoc {
  from: ObjectId;
  to: ObjectId;
  content: string;
  read: boolean;
}

export default class MessageConcept {
  public readonly messages = new DocCollection<MessageDoc>("messages");

  async getMessages(user: ObjectId) {
    const messages = await this.messages.readMany({
      $or: [{ from: user }, { to: user }],
    });
    return messages;
  }

  async getUnreadMessages(user: ObjectId) {
    const messages = await this.messages.readMany({
      read: false,
      to: user,
    });
    messages.forEach((m) => this.markRead(m._id));
    return messages;
  }

  async getMessagesWithUser(user1: ObjectId, user2: ObjectId) {
    const messages = await this.messages.readMany({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    });
    return messages;
  }

  async getUnreadMessagesWithUser(user1: ObjectId, user2: ObjectId) {
    const messages = await this.messages.readMany({
      read: false,
      from: user2,
      to: user1,
    });
    messages.forEach((m) => this.markRead(m._id));
    return messages;
  }

  private async markRead(_id: ObjectId) {
    await this.messages.updateOne({ _id }, { read: true });
  }

  async sendMessage(from: ObjectId, to: ObjectId, content: string) {
    await this.canSendMessage(from, to);
    await this.messages.createOne({ from, to, content, read: false });
    return { msg: "Sent message!" };
  }

  private async canSendMessage(u1: ObjectId, u2: ObjectId) {
    if (u1.toString() === u2.toString()) {
      throw new NoSelfMessagingError();
    }
  }
}

export class NoSelfMessagingError extends NotAllowedError {
  constructor() {
    super("Cannot message yourself!");
  }
}
