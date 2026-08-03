export type Role = 'Admin' | 'Editor' | 'Publisher' | 'Viewer';

export interface UserRBAC {
  id: string;
  email: string;
  role: Role;
  permissions: string[]; // ex: ['publish:social', 'view:analytics']
  createdAt: Date;
}
