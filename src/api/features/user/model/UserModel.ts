export interface UserModelRequest {
  name: string;
}

export interface UserModelResponse {
  name: string;
  accessToken: string;
   avatar?: string;
}
