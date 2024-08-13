import { ImageEncodingRepository } from 'domains/session/repositories/image-encoding.repository';

export const ImageEncodingRepositoryMock =
  (): jest.Mocked<ImageEncodingRepository> => {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      findCountBySessionId: jest.fn(),
    };
  };
