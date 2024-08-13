import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSessionResponseDto } from 'domains/session/dtos/create-session.response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { API_SECURITY_STRATEGY_NAME } from 'core/auth/constants/api-headers.constants';
import { SESSION_FACADE_TOKEN } from 'domains/session/constants/session.contants';
import { UpdateSessionRequestDto } from 'domains/session/dtos/update-session.request.dto';
import { UpdateSessionResponseDto } from 'domains/session/dtos/update-session.response.dto';
import { SessionResponseDto } from 'domains/session/dtos/session.response.dto';
import { SWAGGER_TAGS } from 'core/auth/constants/swagger-tags.constants';
import { SessionFacade } from 'domains/session/session.facade';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageRequestDto } from 'domains/session/dtos/upload-image.request.dto';
import {
  IMAGE_TYPE_REGEX,
  MAXIMUM_IMAGE_SIZE,
} from 'domains/session/constants/image.constants';
import { UploadImageResponseDto } from 'domains/session/dtos/upload-image.response.dto';
import { SessionSummaryResponseDto } from 'domains/session/dtos/session-summary-response.dto';

@Controller('sessions')
@ApiTags(SWAGGER_TAGS.sessions)
export class SessionController {
  constructor(
    @Inject(SESSION_FACADE_TOKEN)
    private readonly sessionFacade: SessionFacade,
  ) {}

  @Get()
  @UseGuards(AuthGuard(API_SECURITY_STRATEGY_NAME))
  @ApiSecurity(API_SECURITY_STRATEGY_NAME)
  async find(): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionFacade.fetch();
    return sessions.map(
      (session) => new SessionResponseDto(session.id, session.status),
    );
  }

  @Get(':sessionId/summary')
  @UseGuards(AuthGuard(API_SECURITY_STRATEGY_NAME))
  @ApiSecurity(API_SECURITY_STRATEGY_NAME)
  async summary(
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
  ): Promise<SessionSummaryResponseDto> {
    const sessionSummary =
      await this.sessionFacade.fetchSessionSummary(sessionId);
    return new SessionSummaryResponseDto(sessionSummary);
  }

  @Post()
  @UseGuards(AuthGuard(API_SECURITY_STRATEGY_NAME))
  @ApiSecurity(API_SECURITY_STRATEGY_NAME)
  async create(): Promise<CreateSessionResponseDto> {
    const session = await this.sessionFacade.create();
    return new CreateSessionResponseDto(session.id, session.status);
  }

  @Patch(':sessionId')
  @UseGuards(AuthGuard(API_SECURITY_STRATEGY_NAME))
  @ApiSecurity(API_SECURITY_STRATEGY_NAME)
  async update(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSessionRequestDto: UpdateSessionRequestDto,
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
  ): Promise<UpdateSessionResponseDto> {
    const session = await this.sessionFacade.update(
      sessionId,
      updateSessionRequestDto,
    );
    return new UpdateSessionResponseDto(session.id, session.status);
  }

  @Post(':sessionId/images')
  @UseGuards(AuthGuard(API_SECURITY_STRATEGY_NAME))
  @ApiSecurity(API_SECURITY_STRATEGY_NAME)
  @ApiBody({ type: UploadImageRequestDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: IMAGE_TYPE_REGEX })
        .addMaxSizeValidator({ maxSize: MAXIMUM_IMAGE_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    uploadImageRequestDto: UploadImageRequestDto,
  ): Promise<UploadImageResponseDto> {
    const imageEncodingEntity = uploadImageRequestDto.disableAsyncFlow
      ? await this.sessionFacade.uploadImage(sessionId, file)
      : await this.sessionFacade.uploadImageAsync(sessionId, file);

    return new UploadImageResponseDto(
      imageEncodingEntity.id,
      imageEncodingEntity.status,
      imageEncodingEntity.imageUrl,
    );
  }
}
