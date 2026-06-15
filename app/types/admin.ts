export interface AdminUser {
  id: string;

  first_name: string;
  last_name: string;

  email: string;

  role: string;

  school_id?: string;
  school_name?: string;

  is_active: boolean;
}
