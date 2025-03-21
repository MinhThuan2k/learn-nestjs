import { FastifyReply } from 'fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserDto } from '../dto/login.dto';
import AuthController from '../controllers/auth.controller';
import { AuthModule } from '../auth.module';
import { LoginTransform } from '../transformers/login.transform';

describe('UserController', () => {
  let userController: AuthController;
  let userDto: LoginUserDto;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    userController = app.get<AuthController>(AuthController);
    userDto = app.get<LoginUserDto>(LoginUserDto);
  });

  describe('User Login', () => {
    const res = {
      send: jest.fn(),
    } as unknown as FastifyReply;
    it('User Login', () => {
      userController.login(userDto, res);
      expect(res.send).toHaveBeenCalledWith(expect.any(LoginTransform));
    });
  });
});
