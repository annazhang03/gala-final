import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ConnectionDoc extends BaseDoc {
  user1: ObjectId;
  user2: ObjectId;
}

export interface ConnectionRequestDoc extends BaseDoc {
  from: ObjectId;
  to: ObjectId;
  status: "pending" | "rejected" | "accepted";
}

export default class ConnectionConcept {
  public readonly connections = new DocCollection<ConnectionDoc>("connections");
  public readonly requests = new DocCollection<ConnectionRequestDoc>("connectionRequests");

  async getRequests(user: ObjectId) {
    return await this.requests.readMany({
      $or: [{ from: user }, { to: user }],
    });
  }

  async sendRequest(from: ObjectId, to: ObjectId) {
    await this.canSendRequest(from, to);
    await this.requests.createOne({ from, to, status: "pending" });
    return { msg: "Sent request!" };
  }

  async acceptRequest(from: ObjectId, to: ObjectId) {
    await this.removePendingRequest(from, to);
    // Following two can be done in parallel, thus we use `void`
    void this.requests.createOne({ from, to, status: "accepted" });
    void this.addConnection(from, to);
    return { msg: "Accepted request!" };
  }

  async rejectRequest(from: ObjectId, to: ObjectId) {
    await this.removePendingRequest(from, to);
    await this.requests.createOne({ from, to, status: "rejected" });
    return { msg: "Rejected request!" };
  }

  async removeRequest(from: ObjectId, to: ObjectId) {
    await this.removePendingRequest(from, to);
    return { msg: "Removed request!" };
  }

  async removeConnection(user: ObjectId, connection: ObjectId) {
    const connectionObj = await this.connections.popOne({
      $or: [
        { user1: user, user2: connection },
        { user1: connection, user2: user },
      ],
    });
    if (connectionObj === null) {
      throw new ConnectionNotFoundError(user, connection);
    }
    return { msg: "Disconnected!" };
  }

  async getConnections(user: ObjectId) {
    const connections = await this.connections.readMany({
      $or: [{ user1: user }, { user2: user }],
    });
    // Making sure to compare ObjectId using toString()
    return connections.map((connection) => (connection.user1.toString() === user.toString() ? connection.user2 : connection.user1));
  }

  async areConnected(u1: ObjectId, u2: ObjectId) {
    const connection = await this.connections.readOne({
      $or: [
        { user1: u1, user2: u2 },
        { user1: u2, user2: u1 },
      ],
    });
    return connection !== null;
  }

  async addConnection(user1: ObjectId, user2: ObjectId) {
    void this.connections.createOne({ user1, user2 });
  }

  private async removePendingRequest(from: ObjectId, to: ObjectId) {
    const request = await this.requests.popOne({ from, to, status: "pending" });
    if (request === null) {
      throw new ConnectionRequestNotFoundError(from, to);
    }
    return request;
  }

  private async isNotConnected(u1: ObjectId, u2: ObjectId) {
    const connection = await this.connections.readOne({
      $or: [
        { user1: u1, user2: u2 },
        { user1: u2, user2: u1 },
      ],
    });
    if (connection !== null || u1.toString() === u2.toString()) {
      throw new AlreadyConnectedError(u1, u2);
    }
  }

  private async canSendRequest(u1: ObjectId, u2: ObjectId) {
    await this.isNotConnected(u1, u2);
    // check if there is pending request between these users
    const request = await this.requests.readOne({
      from: { $in: [u1, u2] },
      to: { $in: [u1, u2] },
      status: "pending",
    });
    if (request !== null) {
      throw new ConnectionRequestAlreadyExistsError(u1, u2);
    }
  }
}

export class ConnectionRequestNotFoundError extends NotFoundError {
  constructor(
    public readonly from: ObjectId,
    public readonly to: ObjectId,
  ) {
    super("Connection request from {0} to {1} does not exist!", from, to);
  }
}

export class ConnectionRequestAlreadyExistsError extends NotAllowedError {
  constructor(
    public readonly from: ObjectId,
    public readonly to: ObjectId,
  ) {
    super("Connection request between {0} and {1} already exists!", from, to);
  }
}

export class ConnectionNotFoundError extends NotFoundError {
  constructor(
    public readonly user1: ObjectId,
    public readonly user2: ObjectId,
  ) {
    super("Connection between {0} and {1} does not exist!", user1, user2);
  }
}

export class AlreadyConnectedError extends NotAllowedError {
  constructor(
    public readonly user1: ObjectId,
    public readonly user2: ObjectId,
  ) {
    super("{0} and {1} are already connected!", user1, user2);
  }
}
