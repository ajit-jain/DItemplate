import { SessionRepository } from 'domains/session/repositories/session.repository';

export const SessionRepositoryMock = (): jest.Mocked<SessionRepository> => {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findByIdWithRelations: jest.fn(),
  };
};
