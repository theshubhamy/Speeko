import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const StorageService = {
  /**
   * Uploads a file (blob/uri) to Firebase Storage
   * @param path Full path including filename (e.g. 'avatars/uid.jpg')
   * @param uri Local file URI
   */
  async uploadFile(path: string, uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);
      
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },

  /**
   * Deletes a file from Storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  },

  /**
   * Gets a download URL for an existing file
   */
  async getFileUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }
};
