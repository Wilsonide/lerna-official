export interface School {
  state: string;
  id: string;
  name: string;
  code: string;
  slug: string;
  email: string;
  phone: string;
  website?: string;
  subscription_plan?: string;
  is_active: boolean;
}
