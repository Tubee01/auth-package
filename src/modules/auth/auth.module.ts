import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import {
  AUTH_OPTIONS,
  SESSION_MIDDLEWARE_OPTIONS,
} from '../../common/constants';
import { IAuthForRootAsyncOptions } from '../interfaces/auth.interface';
import { LocalSessionSerializer } from './local.session.serializer';
import { LocalAuthController } from './controllers/auth.controller';
import LocalStrategy from './strategies/local.session.strategy';
import crypto from 'crypto';
import session from 'express-session';
import passport from 'passport';

@Module({
  controllers: [LocalAuthController],
  providers: [LocalStrategy, LocalSessionSerializer],
})
export class ExpressSessionAuthModule implements NestModule {
  static forRootAsync(options: IAuthForRootAsyncOptions): DynamicModule {
    const baseAuthModuleProviders = [
      {
        provide: AUTH_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject,
      },
      {
        provide: SESSION_MIDDLEWARE_OPTIONS,
        useFactory: (authOptions) => {
          const sessionOptions = authOptions.session;
          const secret = sessionOptions.secret;
          const hash = crypto.createHash('sha256');
          hash.update(secret);
          const hashedSecret = hash.digest('hex');
          sessionOptions.secret = hashedSecret;
          sessionOptions.resave = sessionOptions.resave ?? false;
          sessionOptions.saveUninitialized =
            sessionOptions.saveUninitialized ?? false;
          return sessionOptions;
        },
        inject: [AUTH_OPTIONS],
        isGlobal: true,
      },
    ];
    return {
      module: ExpressSessionAuthModule,
      imports: options.imports,
      providers: baseAuthModuleProviders,
      exports: baseAuthModuleProviders,
    };
  }
  constructor(@Inject(SESSION_MIDDLEWARE_OPTIONS) private readonly options) {}
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(session(this.options), passport.initialize(), passport.session())
      .forRoutes('*');
  }
}
