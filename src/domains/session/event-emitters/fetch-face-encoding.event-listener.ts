import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FetchFaceEncodingEvent } from 'domains/session/event-emitters/fetch-face-encoding.event';
import { SESSION_FACADE_TOKEN } from 'domains/session/constants/session.contants';
import { SessionFacade } from 'domains/session/session.facade';

@Injectable()
export class FetchFaceEncodingEventListener {
  private readonly logger = new Logger(FetchFaceEncodingEvent.name);
  constructor(
    @Inject(SESSION_FACADE_TOKEN) private readonly sessionFacade: SessionFacade,
  ) {}
  @OnEvent(FetchFaceEncodingEvent.name, { async: true })
  async handleFetchFaceEncodingEvent(event: FetchFaceEncodingEvent) {
    if (!event.imageEncodingId) {
      this.logger.error(`Tampered event object: ${JSON.stringify(event)}`);
      return;
    }
    await this.sessionFacade.upsertFaceEncodings(event.imageEncodingId);
  }
}
