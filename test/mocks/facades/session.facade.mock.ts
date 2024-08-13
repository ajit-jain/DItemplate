import { SessionFacade } from 'domains/session/session.facade';

export const SessionFacadeMock = (): jest.Mocked<SessionFacade> => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    fetch: jest.fn(),
    uploadImageAsync: jest.fn(),
    uploadImage: jest.fn(),
    upsertFaceEncodings: jest.fn(),
    fetchSessionSummary: jest.fn(),
  };
};
