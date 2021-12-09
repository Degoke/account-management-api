import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '9ab4y6e',
    description: 'The payment Id of the receiver',
  })
  receiversPaymentId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '3000',
    description: 'The Amount to send',
  })
  amount: number;
}
