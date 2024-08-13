import { EventEmitter2 } from '@nestjs/event-emitter';

export class MockEventEmitter2 extends EventEmitter2 {
  emit = jest.fn();
}
