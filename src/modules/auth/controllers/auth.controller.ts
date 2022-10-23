import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Inject,
  Res,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { IAuthLoginBaseOptions } from '../../interfaces/auth.interface';
import { AUTH_OPTIONS } from '../../../common/constants';
import { LocalGuard } from '../guards/local.guard';
@ApiTags('Authorization')
@Controller('auth')
export class LocalAuthController {
  private readonly logger = new Logger('AuthController');
  constructor(@Inject(AUTH_OPTIONS) private readonly options: IAuthLoginBaseOptions) { }
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @UseGuards(LocalGuard)
  login(@Res() res) {
    if (this.options?.successRedirect) {
      return res.redirect(this.options.successRedirect);
    }
    return res.send({
      message: this.options?.successMessage ?? 'Authenticated',
    });
  }
  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.session.destroy((err) => {
      if (err) {
        this.logger.error(err);
      }
    });
    if (this.options?.logoutRedirect?.length > 0) {
      return res.redirect(this.options.logoutRedirect);
    }
    res.clearCookie(this.options?.session?.name ?? 'connect.sid');
    return res.send({
      message: this.options?.loggedOutMessage ?? 'Logged out',
    });
  }
}
