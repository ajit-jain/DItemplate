export interface ImageStoreFacade {
  uploadImage(imageName: string, image: Express.Multer.File): Promise<string>;
  getImageUrl(imageName: string): Promise<string>;
}
