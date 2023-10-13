import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface FeatureDoc extends BaseDoc {
  user: ObjectId;
  amountFeatured: number;
  status: "Active" | "Inactive";
  dateFeatured: Date | null;
}

export default class FavoriteConcept {
  public readonly features = new DocCollection<FeatureDoc>("features");

  async apply(user: ObjectId) {
    await this.isInactive(user);
    const feature = await this.features.readOne({ user });
    if (feature === null) {
      await this.features.createOne({ user: user, amountFeatured: 0, status: "Active", dateFeatured: null });
    } else {
      await this.features.updateOne(feature, { user: user, status: "Active" });
    }
    return { msg: "Applied to be featured!" };
  }

  async getFeatured() {
    const currDate = new Date();
    const date = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
    const maybeFeatured = await this.features.readOne({
      dateFeatured: { $gte: date },
    });
    if (maybeFeatured) {
      return maybeFeatured;
    }
    const feature = await this.features.readOne({ status: "Active" });
    if (!feature) {
      throw new NotFoundError("No active applicants for featured usesr!");
    }
    await this.features.updateOne(feature, { dateFeatured: date, status: "Inactive", amountFeatured: feature.amountFeatured + 1 });
    return feature;
  }

  async withdraw(user: ObjectId) {
    await this.isActive(user);
    const feature = await this.features.readOne({ user });
    if (!feature) {
      throw new NotFoundError("Feature not found!");
    }
    await this.features.updateOne(feature, { status: "Inactive" });
    return { msg: "Feature application withdrawn!" };
  }

  async isActive(user: ObjectId) {
    const feature = await this.features.readOne({ user });
    if (feature === null || feature.status === "Inactive") {
      throw new FeatureInactiveError(user);
    }
  }

  async isInactive(user: ObjectId) {
    const feature = await this.features.readOne({ user });
    if (feature !== null && feature.status === "Active") {
      throw new FeatureActiveError(user);
    }
  }
}

export class FeatureInactiveError extends NotFoundError {
  constructor(public readonly user: ObjectId) {
    super("{0} has not applied to be featured!", user);
  }
}

export class FeatureActiveError extends NotFoundError {
  constructor(public readonly user: ObjectId) {
    super("{0} has already applied to be featured!", user);
  }
}
