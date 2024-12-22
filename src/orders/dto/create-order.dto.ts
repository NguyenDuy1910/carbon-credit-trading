import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'buyer-001', type: String })
  @IsNotEmpty()
  buyerId: string;

  @ApiProperty({ example: 100, type: Number })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 10.5, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  pricePerUnit?: number;

  @ApiProperty({ example: 1050, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiProperty({ example: 'USD', type: String })
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: '2024-12-20T00:00:00Z', type: String })
  @IsNotEmpty()
  @IsDateString()
  orderDate: Date;

  @ApiProperty({ example: 'Pending', type: String, required: false })
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'Credit Card', type: String, required: false })
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({
    example: 'Details about the carbon credit',
    type: String,
    required: false,
  })
  @IsOptional()
  carbonCreditDetails?: string;

  @ApiProperty({
    example: 'Please process this order quickly.',
    type: String,
    required: false,
  })
  @IsOptional()
  buyerNote?: string;
}
