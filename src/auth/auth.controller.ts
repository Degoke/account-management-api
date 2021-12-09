import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/common/guards/local-auth.gaurd';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/schemas/user.schema';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //login
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({ description: 'login success', type: User })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiBody({ type: LoginDto })
  @Post('/login')
  async login(@Request() req) {
    return this.authService.loginUser(req.user);
  }
}
