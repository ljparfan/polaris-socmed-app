import Multer from "multer";
import config from "config";
import { getStorage } from "firebase-admin/storage";

export const filesMiddleware = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

export const getFileReadOptions = () => ({
  version: "v2", // defaults to 'v2' if missing.
  action: "read",
  expires: Date.now() + 1000 * 60 * 60, // one hour
});

const bucketName = config.get<string>("Firebase.bucketName");
export const getStorageBucket = () => getStorage().bucket(bucketName);

export const getPhotoUrl = async (fileName: string) => {
  const [url] = await getStorageBucket()
    .file(fileName)
    .getSignedUrl(getFileReadOptions() as any);

  return url;
};

export const clearFilesInStorage = async () => {
  const bucket = getStorageBucket();
  await bucket.deleteFiles();
};
