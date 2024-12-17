import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { KycStatus } from '../infrastructure/persistence/relational/enums/kyc-status.enum';

export class CreateCompanyKycDto {
  @ApiProperty({
    example: 'Document123',
    type: String,
    description: 'Identifier for the documents submitted for KYC',
  })
  @IsNotEmpty()
  @IsString()
  documents: string;

  @ApiProperty({
    example: 'file.jpg',
    description: 'File associated with the KYC process',
  })
  @IsNotEmpty()
  @IsString()
  file: string;
  @IsOptional()
  status: KycStatus;

  @ApiProperty({
    example: '2024-12-31',
    description: 'Date when the check is conducted',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkDay: Date;

  @ApiProperty({
    example: 'Verifier123',
    description: 'Person who verified the KYC',
  })
  @IsNotEmpty()
  @IsString()
  verifiedBy: string;

  @ApiProperty({
    example: 'All documents verified successfully',
    description: 'Additional notes on the KYC process',
  })
  @IsOptional()
  @IsString()
  notes: string;

  @ApiProperty({
    example: '2024-12-15T14:00:00Z',
    description: 'Timestamp when verification was completed',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  verifiedAt: Date;
}
