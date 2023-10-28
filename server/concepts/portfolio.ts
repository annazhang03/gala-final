import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface PortfolioDoc extends BaseDoc {
  owner: ObjectId;
  content: ObjectId[];
  bio: string;
}

export default class PortfolioConcept {
  public readonly portfolios = new DocCollection<PortfolioDoc>("portfolios");

  async create(owner: ObjectId, content: ObjectId[], bio: string) {
    const _id = await this.portfolios.createOne({ owner, content, bio });
    return { msg: "Portfolio created successfully!", portfolio: await this.portfolios.readOne({ _id }) };
  }

  async getPortfolios(owner: ObjectId) {
    const portfolios = await this.portfolios.readMany({ owner });
    return portfolios;
  }

  async getPortfolioById(_id: ObjectId) {
    const portfolio = await this.portfolios.readOne({ _id });
    return portfolio;
  }

  async addPostToPortfolio(post: ObjectId, _id: ObjectId) {
    const portfolio = await this.portfolios.readOne({ _id });
    if (!portfolio) {
      throw new Error(`Portfolio ${_id} does not exist!`);
    }
    await this.portfolios.updateOne({ _id }, { content: [post, ...portfolio.content] });
    return { msg: "portfolio successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.portfolios.deleteOne({ _id });
    return { msg: "Portfolio deleted successfully!" };
  }

  async isOwner(user: ObjectId, _id: ObjectId) {
    const portfolio = await this.portfolios.readOne({ _id });
    if (!portfolio) {
      throw new NotFoundError(`Portfolio ${_id} does not exist!`);
    }
    if (portfolio.owner.toString() !== user.toString()) {
      throw new PortfolioOwnerNotMatchError(user, _id);
    }
  }
}

export class PortfolioOwnerNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of portfolio {1}!", author, _id);
  }
}
