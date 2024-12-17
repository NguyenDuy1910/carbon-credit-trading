import { ApiProperty } from '@nestjs/swagger';
import { DatabaseConfig } from '../../database/config/database-config.type';
import databaseConfig from '../../database/config/database.config';
import { Expose } from 'class-transformer';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export class Permission {
  @ApiProperty({
    type: idType,
  })
  id: number;

  @ApiProperty({
    type: () => Number, // Define the user relationship
  })
  userId?: number; // Relationship to User entity

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Expose()
  enableAdd: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Expose()
  enableEdit: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Expose()
  enableDelete: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Expose()
  enableView: boolean;
}
