import { SessionOptions } from 'express-session';

export interface IAuthForRootAsyncOptions {
  useFactory: (
    authService: IAuthService,
    ...args
  ) => Promise<IAuthLoginBaseOptions> | IAuthLoginBaseOptions;
  inject?: any[];
  imports?: any[];
}

export interface IAuthLoginBaseOptions {
  authService: IAuthService;
  session: SessionOptions;
  usernameField?: string;
  passwordField?: string;
  successRedirect?: string;
}
export interface IAuthService {
  validateUser(username: string, password: string): Promise<unknown>;
  getUserByUserNameField(key: string, value: string): Promise<unknown>;
}
