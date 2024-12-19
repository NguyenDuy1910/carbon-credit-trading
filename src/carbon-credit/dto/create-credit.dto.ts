import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateCreditDto {
  // @ApiProperty({
  //   description: 'ID of the associated project',
  //   example: 1,
  // })
  // @IsNotEmpty()
  // @IsNumber()
  // projectId: number;

  @ApiProperty({
    description: 'Year of the carbon credit issuance',
    example: 2023,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  year: number;

  @ApiProperty({
    description: 'Total stock of credits',
    example: 250000,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Price of the carbon credit',
    example: 5.5,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Token ASA ID representing the carbon credit',
    example: 123456789,
  })
  @IsNotEmpty()
  @IsNumber()
  tokenAsaId: number;

  @ApiProperty({
    description: 'Volume of available credits for trade',
    example: 200000,
  })
  @IsOptional()
  @IsNumber()
  availableVolumeCredits: number;

  @ApiProperty({
    description: 'Indicates if credits are available for trading',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  haveAvailableCredits: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-10T12:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2024-02-10T12:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: 'Soft deletion timestamp, null if not deleted',
    example: null,
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt: Date | null;
}
