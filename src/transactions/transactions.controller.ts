import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.gaurd';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Transaction } from './schemas/transaction.schema';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  //send transaction
  @UseGuards(JwtAuthGuard)
  @Post('/send')
  @ApiOperation({ summary: 'Send Transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiCreatedResponse({ description: 'transaction success' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'receiver not found' })
  @ApiBadRequestResponse({ description: 'not enoough balance' })
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    const { userId } = req.user;
    return this.transactionsService.create(userId, createTransactionDto);
  }

  //get all users sent transactions
  @UseGuards(JwtAuthGuard)
  @Get('/user/sent')
  @ApiOperation({ summary: 'Get user sent transactions' })
  @ApiOkResponse({ description: 'success', type: [Transaction] })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'no transactions found' })
  findSent(@Request() req) {
    const { userId } = req.user;
    return this.transactionsService.findUserSentTransactions(userId);
  }

  //get all users received transactions
  @UseGuards(JwtAuthGuard)
  @Get('/user/received')
  @ApiOperation({ summary: 'get user received transactions' })
  @ApiOkResponse({ description: 'success', type: [Transaction] })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiNotFoundResponse({ description: 'no transactions found' })
  findReceived(@Request() req) {
    const { userId } = req.user;
    return this.transactionsService.findUserReceivedTransactions(userId);
  }
}
