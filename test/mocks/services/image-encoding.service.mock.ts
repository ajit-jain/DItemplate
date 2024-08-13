import { ImageEncodingService } from 'domains/session/services/image-encoding.service';

export const ImageEncodingServiceMock =
  (): jest.Mocked<ImageEncodingService> => {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      checkEncodingCountBySessionId: jest.fn(),
      update: jest.fn(),
      fetchFaceEncodings: jest.fn(),
    };
  };
