import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  /**
   * The name of the user
   * @example 'John Doe'
   */
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  /**
   * The email of the user
   * @example 'H4V8H@example.com'
   */
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(255)
  email?: string;
}
