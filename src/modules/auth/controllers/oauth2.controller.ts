import { Controller, Get, Injectable, Query, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '@/middleware/NoAuth';
import { GoogleOAuth2Service } from '@/modules/auth/services/google-oauth2.service';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
@Injectable()
export default class OAuth2Controller {
  constructor(private readonly googleOAuth2Service: GoogleOAuth2Service) {}

  @NoAuth()
  @Get('sign-in/google')
  @ApiOperation({ summary: 'Login By Google', description: 'Login By Google' })
  async signInGoogle(@Res() response: FastifyReply) {
    const result = this.googleOAuth2Service.signInGoogle();

    return response.send({ result });
  }

  @NoAuth()
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Res() response: FastifyReply,
  ) {
    const results = await this.googleOAuth2Service.getGoogleUserProfile(code);
    console.log(results);

    return response.send(results);
  }
}
