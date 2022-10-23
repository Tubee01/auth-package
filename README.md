<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
</div>

<h3 align="center">NestJS Express Session Auth Package</h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Installation

```bash
npm i nestjs-package-express-session-auth
```
### Usage
  
  ```ts
  // auth.module.ts
  @Module({
    imports: [
      ExpressSessionAuthModule.forRootAsync({
        imports: [UserModule],
        useFactory: (authService: UserService): IAuthLoginBaseOptions => {
          const pgSession = connectPgSimple(session);
          return {
            authService,
            session: {
              name: 'sid',
              secret: 'secret',
              rolling: true,
              cookie: {
                maxAge: 60 * 1000,
                secure: process?.env?.NODE_ENV === 'production',
                httpOnly: process?.env?.NODE_ENV === 'production',
              },
              store: new pgSession({
                conString: 'postgresql://user:password@localhost:5432/db?schema=public',
              }),
            },
          };
        },
        inject: [UserService],
      }),
    ]
  })
  ```

## Change Log

See [Changelog](CHANGELOG.md) for more information.
