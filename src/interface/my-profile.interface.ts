export type FormProfileValues = {
  avatar_path: string;
  first_name: string;
  last_name: string;
  tags: string[];
  role_id: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export interface DataMyProfileType {
  key: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
