import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';

export enum CompanyType {
  MANUFACTURING = 'Manufacturing',
  TRADING = 'Trading',
  SERVICE = 'Service',
  TECHNOLOGY = 'Technology',
  CONSTRUCTION = 'Construction',
  ENERGY = 'Energy',
  ENVIRONMENTAL = 'Environmental',
  EDUCATION = 'Education',
  RESEARCH_AND_DEVELOPMENT = 'ResearchAndDevelopment',
  NON_PROFIT = 'NonProfit',
  FINANCIAL = 'Financial',
  MEDIA_AND_ENTERTAINMENT = 'MediaAndEntertainment',
  PHARMACEUTICAL = 'Pharmaceutical',
  AGRICULTURE = 'Agriculture',
  TRANSPORTATION_AND_LOGISTICS = 'TransportationAndLogistics',
}
export class CreateCompanyDto {
  @ApiProperty({ example: 'TechJdi', type: String })
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'vn-0123', type: String })
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: '318/48A Phan Van Tri', type: String })
  @IsNotEmpty()
  companyAddress: string;

  @ApiProperty({ example: 'techJdi@gmail.com', type: String })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({ example: 'Ho Chi Minh City', type: String })
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Nguyen Dinh Quoc Duy', type: String })
  @IsNotEmpty()
  representativeName: string;

  @ApiProperty({ example: '0123321789', type: String })
  @IsNotEmpty()
  registerNumber: string;

  @ApiProperty({ example: 'www.techjdi.com', type: String })
  @IsNotEmpty()
  website: string;

  @IsOptional()
  companyType: CompanyType;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo: FileDto;
}
