import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';
import { Role } from '../../roles/domain/role';
import { Status } from '../../statuses/domain/status';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

// Determine the ID type based on database configuration.
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
    description: 'Email address of the user.',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @ApiProperty({
    type: String,
    example: 'email',
    description:
      'Provider used for authentication (e.g., email, Google, etc.).',
  })
  @Expose({ groups: ['me', 'admin'] })
  authProvider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
    description: 'Social ID of the user, if applicable.',
  })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
    description: 'First name of the user.',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
    description: 'Last name of the user.',
  })
  lastName: string | null;

  @ApiProperty({
    type: () => FileType,
    description: 'Profile picture of the user.',
  })
  photo?: FileType | null;

  @ApiProperty({
    type: () => Role,
    description: 'Role assigned to the user.',
  })
  role?: Role | null;

  @ApiProperty({
    type: () => Status,
    description: 'Current status of the user.',
  })
  status?: Status;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the user was created.',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the user was last updated.',
  })
  updatedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the user was deleted. Null if not deleted.',
  })
  deletedAt: Date;

  @Exclude({ toPlainOnly: true })
  password?: string;

  // constructor(props: {
  //   id: number | string;
  //   email: string | null;
  //   authProvider: string;
  //   socialId?: string | null;
  //   firstName: string | null;
  //   lastName: string | null;
  //   photo?: FileType | null;
  //   role?: Role | null;
  //   status?: Status;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   deletedAt: Date;
  //   password?: string;
  // }) {
  //   this.id = props.id;
  //   this.email = props.email;
  //   this.authProvider = props.authProvider;
  //   this.socialId = props.socialId;
  //   this.firstName = props.firstName;
  //   this.lastName = props.lastName;
  //   this.photo = props.photo;
  //   this.role = props.role;
  //   this.status = props.status;
  //   this.createdAt = props.createdAt;
  //   this.updatedAt = props.updatedAt;
  //   this.deletedAt = props.deletedAt;
  //   this.password = props.password;
  // }

  /**
   * Get the full name of the user by concatenating first and last names.
   */
  // getFullName(): string | null {
  //   if (!this.firstName && !this.lastName) return null;
  //   return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
  // }

  /**
   * Mask sensitive fields before returning user details.
   */
  // maskSensitiveFields(): Partial<User> {
  //   return {
  //     id: this.id,
  //     email: this.email,
  //     authProvider: this.authProvider,
  //     firstName: this.firstName,
  //     lastName: this.lastName,
  //     photo: this.photo,
  //     role: this.role,
  //     status: this.status,
  //   };
  // }
}
