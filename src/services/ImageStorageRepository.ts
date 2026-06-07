/**
 * Generic repository interface for managing cloud file storage uploads.
 * This abstracts the actual cloud provider (e.g. ImageKit, Firebase Storage)
 * away from the UI code, satisfying separation of concerns and dependency inversion.
 */
export interface ImageStorageRepository {
  /**
   * Uploads a file from the local device filesystem to the remote storage server.
   * @param localPath The local filesystem URI of the selected image.
   * @param destinationFolder The folder name on the remote storage server (e.g. 'products', 'profiles').
   * @returns A promise resolving to the public, optimized HTTPS URL of the uploaded image.
   */
  uploadFile(localPath: string, destinationFolder: string): Promise<string>;
}
