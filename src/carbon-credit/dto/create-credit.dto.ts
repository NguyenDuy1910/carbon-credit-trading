import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { CreditStatus } from '../infrastructure/persistence/relational/enums/credit-status.enum';

export class CreateCreditDto {
  @ApiProperty({
    description: 'Serial number of the carbon credit',
    example: 'CC-12345-2024',
  })
  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @ApiProperty({
    description: 'Certification standard of the carbon credit',
    example: 'ISO 14064-2',
  })
  @IsNotEmpty()
  @IsString()
  certificationStandard: string;

  @ApiProperty({
    description: 'Date when the carbon credit was issued',
    example: '2024-12-15T14:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date) // Transform to Date instance
  issuedAt: Date;

  @ApiProperty({
    description: 'Date when the carbon credit will expire',
    example: '2034-12-15T14:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date) // Transform to Date instance
  expirationAt: Date;

  @ApiProperty({
    description: 'Price of the carbon credit in USD',
    example: 150.75,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiHideProperty()
  @IsNotEmpty()
  @IsEnum(CreditStatus)
  status: CreditStatus = CreditStatus.AVAILABLE; // Set default value

  @ApiProperty({
    description: 'Amount of carbon credits (in tons of CO2)',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  creditAmount: number;
}
