import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  /**
   * The name of the user
   * @example 'John Doe'
   */
  @ApiProperty({
    description: 'The name of the user',
    example: 'Soham Das',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'H4V8H@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password!: string;
}
