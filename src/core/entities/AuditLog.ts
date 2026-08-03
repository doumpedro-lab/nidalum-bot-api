export interface AuditLog {
  id?: string;
  entityType: 'Publication' | 'Campaign' | 'Config' | 'System';
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH_ATTEMPT';
  performedBy: string; // ex: 'scheduler', 'worker', 'admin-userId'
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  timestamp: Date;
}
