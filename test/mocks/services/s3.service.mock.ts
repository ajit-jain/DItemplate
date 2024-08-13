import { ImageStoreFacade } from 'core/media-store/image-store.facade';

export const S3ServiceMock = (): jest.Mocked<ImageStoreFacade> => {
  return {
    uploadImage: jest.fn(),
    getImageUrl: jest.fn(),
  };
};
