import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ProfileDoc extends BaseDoc {
  owner: ObjectId;
  content: ObjectId[];
  bio: string;
}

export default class ProfileConcept {
  public readonly profiles = new DocCollection<ProfileDoc>("profiles");

  async create(owner: ObjectId, content: ObjectId[], bio: string) {
    const _id = await this.profiles.createOne({ owner, content, bio });
    return { msg: "Profile created successfully!", profile: await this.profiles.readOne({ _id }) };
  }

  async getProfiles(owner: ObjectId) {
    const profiles = await this.profiles.readMany({ owner });
    return profiles;
  }

  async getProfileById(_id: ObjectId) {
    const profile = await this.profiles.readOne({ _id });
    return profile;
  }

  async delete(_id: ObjectId) {
    await this.profiles.deleteOne({ _id });
    return { msg: "Profile deleted successfully!" };
  }

  async isOwner(user: ObjectId, _id: ObjectId) {
    const profile = await this.profiles.readOne({ _id });
    if (!profile) {
      throw new NotFoundError(`Profile ${_id} does not exist!`);
    }
    if (profile.owner.toString() !== user.toString()) {
      throw new ProfileOwnerNotMatchError(user, _id);
    }
  }
}

export class ProfileOwnerNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of profile {1}!", author, _id);
  }
}
