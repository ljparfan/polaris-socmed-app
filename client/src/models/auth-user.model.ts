export interface AuthUser {
  createdAt: Date;
  deletedAt: Date;
  email: string;
  id: number;
  key: string;
  name: string;
  updatedAt: Date;
  username: string;
  profilePhotoUrl?: string;
}
