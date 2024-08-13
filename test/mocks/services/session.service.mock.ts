import { SessionService } from 'domains/session/services/session.service';

export const SessionServiceMock = (): jest.Mocked<SessionService> => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdWithRelations: jest.fn(),
  };
};
