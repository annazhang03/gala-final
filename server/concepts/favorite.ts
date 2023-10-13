import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface FavoriteDoc extends BaseDoc {
  fan: ObjectId;
  fav: ObjectId;
}

export default class FavoriteConcept {
  public readonly favorites = new DocCollection<FavoriteDoc>("favorites");

  async getFans(user: ObjectId) {
    const favorites = await this.favorites.readMany({
      fav: user,
    });
    return favorites.map((favorite) => favorite.fan);
  }

  async getFavorites(user: ObjectId) {
    const favorites = await this.favorites.readMany({
      fan: user,
    });
    return favorites.map((favorite) => favorite.fav);
  }

  async addFavorite(fan: ObjectId, fav: ObjectId) {
    await this.isNotFavorited(fan, fav);
    await this.favorites.createOne({ fan: fan, fav: fav });
    return { msg: "Added favorite!" };
  }

  async removeFavorite(fan: ObjectId, fav: ObjectId) {
    const favoriteObj = await this.favorites.popOne({
      fan: fan,
      fav: fav,
    });
    if (favoriteObj === null) {
      throw new FavoriteNotFoundError(fan, fav);
    }
    return { msg: "Removed favorite!" };
  }

  async isFavorited(fan: ObjectId, fav: ObjectId) {
    const favorite = await this.favorites.readOne({
      fan: fan,
      fav: fav,
    });
    return favorite !== null;
  }

  private async canFavorite(fan: ObjectId, fav: ObjectId) {
    await this.isNotFavorited(fan, fav);
    if (fan.toString() !== fav.toString()) {
      throw new AlreadyFavoritedError(fan, fav);
    }
  }

  private async isNotFavorited(fan: ObjectId, fav: ObjectId) {
    const favorite = await this.favorites.readOne({
      fan: fan,
      fav: fav,
    });
    if (favorite !== null || fan.toString() === fav.toString()) {
      throw new AlreadyFavoritedError(fan, fav);
    }
  }
}

export class FavoriteNotFoundError extends NotFoundError {
  constructor(
    public readonly fan: ObjectId,
    public readonly fav: ObjectId,
  ) {
    super("{1} is not a favorite of {0}!", fan, fav);
  }
}

export class AlreadyFavoritedError extends NotAllowedError {
  constructor(
    public readonly fan: ObjectId,
    public readonly fav: ObjectId,
  ) {
    super("{1} is already a favorite of {0}!", fan, fav);
  }
}
