import { Exclude, Expose, Transform } from 'class-transformer';

export class LoginTransform {
  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  token: string;

  @Expose()
  @Transform(
    ({ obj }) => ({
      email: obj.email,
      token: obj.token,
      password: obj.password,
    }),
    { toClassOnly: true },
  )
  user: object;
}
