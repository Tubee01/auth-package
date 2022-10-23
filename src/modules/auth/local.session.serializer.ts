import { PassportSerializer } from '@nestjs/passport';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AUTH_OPTIONS } from '../../common/constants';
import { IAuthLoginBaseOptions } from '../interfaces/auth.interface';

@Injectable()
export class LocalSessionSerializer extends PassportSerializer {
  constructor(@Inject(AUTH_OPTIONS) private readonly options: IAuthLoginBaseOptions) {
    super();
  }

  serializeUser(user, done: CallableFunction) {
    done(null, user);
  }

  async deserializeUser(user, done: CallableFunction) {
    const key = this.options.usernameField ?? 'username';
    try {
      const userData = await this.options.authService.getUserByUserNameField(user[key],);
      return userData ? done(null, userData) : done(null, null);
    } catch (err) {
      done(new HttpException(err.message, err.status), null);
    }
  }
}
