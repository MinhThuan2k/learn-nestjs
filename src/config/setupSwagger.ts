import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('Learn The Jira Clone API Description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  console.log(`Swagger URL: url:${process.env.PORT ?? 3000}/api/docs`);
}
