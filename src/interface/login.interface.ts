export type FormLoginValues = {
  email: string;
  password: string;
};

interface ModulesAuthType {
  id: number;
  name: string;
  action: string[];
}

interface RoleAuthType {
  id: number;
  name: string;
  modules: ModulesAuthType[];
}

export interface DataAuthType {
  username: string;
  avatar_path: string;
  email: string;
  tags: string[];
  role: RoleAuthType;
  access_token: string;
}

export interface ResLogin {
  data: {
    data: DataAuthType;
  };
}
