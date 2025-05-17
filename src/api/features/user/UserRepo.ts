import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { UserModelRequest, UserModelResponse } from "./model/UserModel";

interface IAuthenRepo {
  login(data: UserModelRequest): Promise<BaseApiResponseModel<UserModelResponse>>;
}

export class AuthenRepo implements IAuthenRepo {
  async login(data: UserModelRequest): Promise<BaseApiResponseModel<UserModelResponse>> {
    return client.post(ApiPath.LOGIN, data);
  }
}

export const defaultAuthenRepo = new AuthenRepo();