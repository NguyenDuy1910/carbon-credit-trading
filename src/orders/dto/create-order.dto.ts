import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the buyer',
    example: 'buyer123',
  })
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  // @ApiProperty({
  //   description: 'ID of Project',
  //   example: 1,
  // })
  // @IsString()
  // @IsNotEmpty()
  // projectId: number;

  @ApiProperty({
    description: 'ID of the seller',
    example: 'seller456',
  })
  @IsString()
  @IsNotEmpty()
  sellerId: string;

  @ApiProperty({
    description: 'Details of the carbon credit being purchased',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  carbonCreditId: number;

  @ApiProperty({
    description: 'Quantity of carbon credits to purchase',
    example: 10,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'Price per unit of carbon credit',
    example: 5.5,
  })
  @IsNumber()
  @IsPositive()
  pricePerUnit: number;

  @ApiProperty({
    description: 'Total price of the order',
    example: 55,
  })
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @ApiProperty({
    description: 'Currency of the transaction',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Status of the order',
    example: 'Pending',
    enum: ['Pending', 'Completed', 'Cancelled', 'Failed'],
  })
  @IsEnum(['Pending', 'Completed', 'Cancelled', 'Failed'])
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Failed';

  @ApiProperty({
    description: 'Payment method used for the order',
    example: 'Credit Card',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    description: 'Date of the order',
    example: '2024-12-22T12:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  orderDate: Date;

  @ApiProperty({
    description: 'Expected delivery date of the order',
    example: '2024-12-25T12:00:00.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveryDate?: Date;

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Please prioritize delivery.',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
