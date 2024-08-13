import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SWAGGER_DOCS_PARAMETERS } from 'core/constants/swagger.constants';
import { API_BASE_PREFIX } from 'core/constants/api.constants';
import {
  API_KEY_HEADER,
  API_SECURITY_STRATEGY_NAME,
} from 'core/auth/constants/api-headers.constants';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_BASE_PREFIX);
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_DOCS_PARAMETERS.title)
    .setDescription(SWAGGER_DOCS_PARAMETERS.description)
    .setVersion(SWAGGER_DOCS_PARAMETERS.version)
    .addApiKey(
      { type: 'apiKey', name: API_KEY_HEADER, in: 'header' },
      API_SECURITY_STRATEGY_NAME,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
