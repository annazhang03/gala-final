import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface JobDoc extends BaseDoc {
  employer: ObjectId;
  content: string;
  status: "Active" | "Inactive";
  applicants: ObjectId[];
}

export default class JobConcept {
  public readonly jobs = new DocCollection<JobDoc>("jobs");

  async post(employer: ObjectId, content: string) {
    const _id = await this.jobs.createOne({ employer, content, status: "Active", applicants: [] });
    return { msg: "Job successfully posted!", job: await this.jobs.readOne({ _id }) };
  }

  async update(_id: ObjectId, update: Partial<JobDoc>) {
    await this.jobs.updateOne({ _id }, update);
    return { msg: "Job successfully updated!" };
  }

  async markInactive(_id: ObjectId) {
    const job = await this.jobs.readOne({ _id });
    if (!job) {
      throw new NotFoundError(`Job ${_id} does not exist!`);
    }
    if (job.status === "Inactive") {
      throw new AlreadyInactiveError(_id);
    }
    await this.jobs.updateOne({ _id }, { status: "Inactive" });
    return { msg: "Job successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.jobs.deleteOne({ _id });
    return { msg: "Job deleted successfully!" };
  }

  async getJobWithApplicants(_id: ObjectId) {
    const job = await this.jobs.readOne({ _id });
    if (!job) {
      throw new NotFoundError(`Job ${_id} does not exist!`);
    }
    return job;
  }

  async getJobById(_id: ObjectId) {
    const job = await this.jobs.readOne({ _id });
    if (!job) {
      throw new NotFoundError(`Job ${_id} does not exist!`);
    }
    return this.sanitizeJob(job);
  }

  async getJobs() {
    const jobs = await this.jobs.readMany(
      {},
      {
        sort: { dateUpdated: -1 },
      }, // todo dont show list of applicants
    );
    return jobs.map((j) => this.sanitizeJob(j));
  }

  async getJobByStatus(status: "Active" | "Inactive") {
    const jobs = await this.jobs.readMany(
      { status: status },
      {
        sort: { dateUpdated: -1 },
      }, // todo dont show list of applicants
    );
    return jobs.map((j) => this.sanitizeJob(j));
  }

  async apply(_id: ObjectId, applicant: ObjectId) {
    const job = await this.jobs.readOne({ _id });
    if (!job) {
      throw new NotFoundError(`Job ${_id} does not exist!`);
    }
    if (applicant.toString() === job.employer.toString()) {
      throw new EmployerApplicantMatchError(applicant, _id);
    }
    await this.notApplied(job, applicant);
    const newApplicants = job.applicants;
    newApplicants.push(applicant);
    await this.jobs.updateOne({ _id }, { applicants: newApplicants });
    return { msg: "Applied successfully!" };
  }

  async withdraw(_id: ObjectId, applicant: ObjectId) {
    const job = await this.jobs.readOne({ _id });
    if (!job) {
      throw new NotFoundError(`Job ${_id} does not exist!`);
    }
    await this.alreadyApplied(job, applicant);
    const newApplicants = job.applicants.filter((app) => app.toString() !== applicant.toString());
    console.log(newApplicants);
    await this.jobs.updateOne({ _id }, { applicants: newApplicants });
    return { msg: "Withdrawn successfully!" };
  }

  private async notApplied(job: JobDoc, applicant: ObjectId) {
    for (const app of job.applicants) {
      if (app.toString() === applicant.toString()) {
        console.log(applicant, job._id);
        throw new AlreadyAppliedError(applicant, job._id);
      }
    }
  }

  private async alreadyApplied(job: JobDoc, applicant: ObjectId) {
    if (job.applicants.every((app) => app.toString() !== applicant.toString())) {
      throw new NotAppliedError(applicant, job._id);
    }
  }

  async isEmployer(_id: ObjectId, user: ObjectId) {
    const job = await this.jobs.readOne({ _id });
    if (!job) {
      throw new NotFoundError(`Job ${_id} does not exist!`);
    }
    if (job.employer.toString() !== user.toString()) {
      throw new JobEmployerNotMatchError(user, job._id);
    }
  }

  private sanitizeJob(job: JobDoc) {
    const { applicants, ...rest } = job; // remove applicant list
    return { ...rest, numApplicants: applicants.length };
  }
}

export class JobEmployerNotMatchError extends NotAllowedError {
  constructor(
    public readonly employer: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the employer of job {1}!", employer, _id);
  }
}

export class AlreadyAppliedError extends NotAllowedError {
  constructor(
    public readonly applicant: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} has already applied to {1}!", applicant, _id);
  }
}

export class NotAppliedError extends NotAllowedError {
  constructor(
    public readonly applicant: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} has not yet applied to {1}!", applicant, _id);
  }
}

export class AlreadyInactiveError extends NotAllowedError {
  constructor(public readonly _id: ObjectId) {
    super("{0} has already been marked inactive!", _id);
  }
}

export class EmployerApplicantMatchError extends NotAllowedError {
  constructor(
    public readonly applicant: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} cannot to apply to {1}!", applicant, _id);
  }
}
