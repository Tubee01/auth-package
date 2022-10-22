import { Strategy, VerifyFunction } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AUTH_OPTIONS } from '../../../common/constants';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(@Inject(AUTH_OPTIONS) private readonly options) {
    super({
      usernameField: options.usernameField ?? 'username',
      passwordField: options.passwordField ?? 'password',
    });
  }

  validate: VerifyFunction = async (username, password, done) => {
    try {
      const user = await this.options.authService.validateUser(
        username,
        password,
      );
      return user ? done(null, user) : done(null, null);
    } catch (err) {
      this.logger.error(err);
      done(null, null);
    }
  };
}
