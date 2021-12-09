import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument, User } from './schemas/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //create a new user
  async create(createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;
      const user = await this.userModel.findOne({ email });
      if (user) {
        throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
      }
      const createdUser = new this.userModel(createUserDto);
      const hash = await this.generateHash();
      createdUser.paymentId.push(hash);
      createdUser.walletBalance = 5000;
      const result = await createdUser.save();
      return {
        message: 'User created success',
        user: result,
      };
    } catch (error) {
      throw error;
    }
  }

  //generate payment id
  async generatePaymentId(id) {
    try {
      const user = await this.userModel.findById(id);
      if (user.paymentId.length < 5) {
        const hash = await this.generateHash();
        await this.userModel.findByIdAndUpdate(id, {
          $push: { paymentId: hash },
        });
        return {
          message: 'Payment id generated successfully',
        };
      }

      throw new HttpException('user already has 5 Ids', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw error;
    }
  }

  //find a user by email(returns password created mainly for login verification)
  async findByEmail(email) {
    try {
      return this.userModel.findOne({ email: email }).select('+password');
    } catch (error) {
      throw error;
    }
  }

  //find a user by id
  async findById(id) {
    try {
      return this.userModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  //find user by paymentId
  async findByPaymentId(paymentId) {
    try {
      return this.userModel.findOne({ paymentId: paymentId });
    } catch (error) {
      throw error;
    }
  }

  //search user by paymentId
  async searchByPaymentId(paymentId) {
    try {
      const result = await this.userModel.findOne({ paymentId: paymentId });
      if (!result) {
        throw new HttpException('user already has 5 Ids', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Found success',
        user: result,
      };
    } catch (error) {
      throw error;
    }
  }

  //add to users wallet balance
  async addToBalance(id, amount: number, session: ClientSession | null = null) {
    try {
      return this.userModel
        .findByIdAndUpdate(id, {
          $inc: { walletBalance: amount },
        })
        .session(session);
    } catch (error) {
      throw error;
    }
  }

  //remve from users wallet balance
  async subtractFromBalance(
    id,
    amount: number,
    session: ClientSession | null = null,
  ) {
    try {
      return this.userModel
        .findByIdAndUpdate(id, {
          $inc: { walletBalance: -amount },
        })
        .session(session);
    } catch (error) {
      throw error;
    }
  }

  //delete users payment id
  async deletePaymentId(userId, paymentId) {
    try {
      const user = await this.userModel.findById(userId);
      if (user.paymentId.length > 1) {
        await this.userModel.findByIdAndUpdate(userId, {
          $pull: { paymentId: paymentId },
        });
        return {
          message: `delete paumentId: ${paymentId} success`,
        };
      }

      throw new HttpException(
        'user must have at least 1 payment id',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw error;
    }
  }

  //hash 7 digit alphanumeric paymentid
  async generateHash(): Promise<string> {
    try {
      const hash = await crypto.randomBytes(4).toString('hex').substring(0, 7);
      return hash;
    } catch (error) {
      throw error;
    }
  }
}
