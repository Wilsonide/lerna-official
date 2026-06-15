export interface School {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  website?: string;
  subscription_plan?: string;
  is_active: boolean;
}
