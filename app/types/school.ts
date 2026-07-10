export interface School {
  id: string;
  name: string;
  slug: string;

  email: string;
  phone: string;
  state: string;

  website?: string;
  subscription_plan?: string;

  is_active: boolean;

  admin?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
    password?: string;
  };
}
