import { Client, Databases, Account, Storage } from 'appwrite';

const project_id = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const BUCKET_ID_IMAGES = import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID;

if (!project_id || !endpoint) {
  throw new Error('Appwrite project ID 또는 endpoint URL이 .env 파일에 설정되지 않았습니다.');
}

const client = new Client();
client.setEndpoint(endpoint).setProject(project_id);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

/**
 * 이미지 ID를 사용하여 Appwrite 데이터베이스에서 이미지 URL을 가져옵니다.
 * @param imageId - Appwrite 'assets' 컬렉션의 문서 ID (예: 'avatar', 'monster-goblin')
 * @returns 이미지 URL 문자열
 */
export const getImageUrl = (fileId: string): string => {
  try {
    const url = storage.getFileDownload(BUCKET_ID_IMAGES, fileId);
    return url.toString();
  } catch (error) {
    console.error(`'${fileId}'에 대한 이미지 URL을 가져오는 데 실패했습니다:`, error);
    return `https://via.placeholder.com/150?text=Error`;
  }
};
