import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '../infrastructure/persistence/relational/enums/project-status.enum';

export class CreateCarbonProjectDto {
  @ApiProperty({
    example: 'Carbon Project A',
    description: 'Name of the Carbon Project',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'active',
    description: 'Status of the Carbon Project',
  })
  @IsOptional()
  @IsString()
  status: ProjectStatus;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Start date of the Carbon Project',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    example: '2024-12-15T14:00:00Z',
    description: 'End date of the Carbon Project',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    example: 'This is a sample project.',
    description: 'Description of the Carbon Project',
  })
  @IsOptional()
  @IsString()
  description: string;
}
