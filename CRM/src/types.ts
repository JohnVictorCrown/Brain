export interface Contact {
  id?: number;
  name: string;
  phone: string;
  email: string;
  website: string;
  group_name: string;
  tags: string; // Comma-separated string
  address: string;
  company: string;
  job_title: string;
  notes: string;
  birthday: string;
  created_at?: string;
}

export type ScreenType = 'contacts' | 'import' | 'settings';

export interface ImportMapping {
  name: string;
  phone: string;
  email: string;
  website: string;
  group_name: string;
  tags: string;
  address: string;
  company: string;
  job_title: string;
  notes: string;
  birthday: string;
}
