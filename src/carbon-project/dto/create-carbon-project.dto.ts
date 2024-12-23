import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { CarbonProjectType } from '../infrastructure/persistence/relational/enums/project-status.enum';

export class CreateCarbonProjectDto {
  @ApiProperty({
    example: 'Renewable Energy Development',
    description: 'Name of the Carbon Project',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'compensation',
    description:
      'Type of the Carbon Project (e.g., compensation, reforestation, renewable)',
  })
  @IsNotEmpty()
  @IsString()
  type: CarbonProjectType;

  @ApiProperty({
    example: true,
    description: 'Whether the project is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the project is vintage',
  })
  @IsOptional()
  @IsBoolean()
  isVintage: boolean;

  @ApiProperty({
    example: 500000,
    description: 'Total available credits in stock',
  })
  @IsOptional()
  @IsNumber()
  totalStock: number;

  @ApiProperty({
    example: 120000,
    description: 'CO₂ balance (if applicable)',
  })
  @IsOptional()
  @IsNumber()
  co2Balance: number;

  @ApiProperty({
    example: 'https://example.com/images/renewable_energy.jpg',
    description: 'URL of the project’s cover image',
  })
  @IsOptional()
  @IsUrl()
  cover: string;

  @ApiProperty({
    example: false,
    description: 'Whether the project accepts free donations',
  })
  @IsOptional()
  @IsBoolean()
  isFreeDonation: boolean;

  @ApiProperty({
    example: 1,
    description: 'Currency token of the project',
  })
  @IsOptional()
  @IsNumber()
  currencyToken: number;

  @ApiProperty({
    example: 5.5,
    description: 'Price per credit (if available)',
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Germany',
    description: 'Country name where the project is implemented',
  })
  @IsOptional()
  @IsString()
  countryName: string;

  @ApiProperty({
    example: 'https://example.com/flags/de.png',
    description: 'URL of the country’s flag',
  })
  @IsOptional()
  @IsUrl()
  countryFlag: string;
}
