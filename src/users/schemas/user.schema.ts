import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Transform(({ value }) => value.toString())
  @ApiProperty()
  _id: ObjectId;

  @Prop({ required: true })
  @ApiProperty()
  name: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  @ApiProperty()
  email: string;

  @Prop({ required: true })
  @ApiProperty()
  phoneNumber: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  @ApiProperty()
  paymentId: string[];

  @Prop({ required: true })
  @ApiProperty()
  walletBalance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
