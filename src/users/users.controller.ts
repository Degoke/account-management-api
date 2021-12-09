import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.gaurd';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './schemas/user.schema';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //create a user
  @Post()
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'Registration success' })
  @ApiBadRequestResponse({ description: 'User already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //get current user
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @ApiOperation({ summary: 'get user details' })
  @ApiOkResponse({ description: 'success', type: User })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  findUser(@Request() req) {
    const { userId } = req.user;
    return this.usersService.findById(userId);
  }

  //search user by payment id
  @UseGuards(JwtAuthGuard)
  @Get('/search/:paymentid')
  @ApiOperation({ summary: 'search user by payment id' })
  @ApiOkResponse({ description: 'success', type: User })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  findUserByPaymentId(@Param('paymentId') paymentId: string) {
    return this.usersService.searchByPaymentId(paymentId);
  }

  // generate new user payment id
  @UseGuards(JwtAuthGuard)
  @Get('/generate-paymentid')
  @ApiOperation({ summary: 'Generate new payment id' })
  @ApiOkResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiBadRequestResponse({ description: 'user already has 5 ids' })
  generatePaymentId(@Request() req) {
    const { userId } = req.user;
    return this.usersService.generatePaymentId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:paymentId')
  @ApiOperation({ summary: 'delete user payment id' })
  @ApiOkResponse({ description: 'delete success' })
  @ApiBadRequestResponse({ description: 'User has min 1 payment id' })
  deletePaymentId(@Request() req, @Param('paymentId') paymentId: string) {
    return this.usersService.deletePaymentId(req.user.userId, paymentId);
  }
}
