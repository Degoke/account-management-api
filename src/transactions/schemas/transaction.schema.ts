import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  @ApiProperty()
  sender: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  @ApiProperty()
  receiver: User;

  @Prop()
  @ApiProperty()
  amount: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
