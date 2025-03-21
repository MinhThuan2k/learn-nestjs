import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Email không được để trống!' })
  password: string;
}
