import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('Learn The Jira Clone API Description')
    .setVersion('1.0')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);

  documentFactory.paths = Object.keys(documentFactory.paths)
    .sort((a, b) => {
      const tagA = documentFactory.paths[a]?.get?.tags?.[0] || '';
      const tagB = documentFactory.paths[b]?.get?.tags?.[0] || '';
      return tagA.localeCompare(tagB);
    })
    .reduce(
      (acc, key) => {
        acc[key] = documentFactory.paths[key];
        return acc;
      },
      {} as typeof documentFactory.paths,
    );
  SwaggerModule.setup('api/docs', app, documentFactory);
  console.log(`Swagger URL: url:${process.env.PORT ?? 3000}/api/docs`);
}
