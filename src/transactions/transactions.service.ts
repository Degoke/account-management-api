import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private usersService: UsersService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  // make a transaction
  async create(id: string, createTransactionDto: CreateTransactionDto) {
    try {
      const { receiversPaymentId, amount } = createTransactionDto;

      //check wallet balance is > amount
      const sender = await this.usersService.findById(id);
      if (sender.walletBalance < amount) {
        throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
      }

      //check receiver exists
      const receiver = await this.usersService.findByPaymentId(
        receiversPaymentId,
      );
      if (!receiver) {
        throw new HttpException('Receiver dosent Exist', HttpStatus.NOT_FOUND);
      }

      //ensure sender !== receiver
      if (sender._id === receiver._id) {
        throw new HttpException('Cannot send to self', HttpStatus.BAD_REQUEST);
      }

      //initialize seseion and start transaction
      const session = await this.connection.startSession();

      await session.withTransaction(async () => {
        await this.usersService.subtractFromBalance(
          sender._id,
          amount,
          session,
        );
        await this.usersService.addToBalance(receiver._id, amount, session);

        const transaction = new this.transactionModel();
        transaction.amount = amount;
        transaction.sender = sender._id;
        transaction.receiver = receiver._id;
        await transaction.save();
      });

      session.endSession();
      return {
        message: 'Transaction created Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findUserSentTransactions(userId) {
    try {
      const transactions = await this.transactionModel
        .find({ sender: userId })
        .populate('receiver');
      if (!transactions) {
        throw new HttpException(
          'No available transactions',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'success',
        transactions: transactions,
      };
    } catch (error) {
      throw error;
    }
  }

  async findUserReceivedTransactions(userId) {
    try {
      const transactions = await this.transactionModel
        .find({ receiver: userId })
        .populate('sender');
      if (!transactions) {
        throw new HttpException(
          'No available transactions',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'success',
        transactions: transactions,
      };
    } catch (error) {
      throw error;
    }
  }
}
