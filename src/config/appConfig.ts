export const appConfig = {
  // Authentication settings
  auth: {
    enabled: true, // Set to false to bypass authentication completely for development
    provider: 'supabase', // 'supabase' or 'firebase' or 'local'
    requireRole: true, // If true, users must have a specific role to access dashboards
  },
  
  // Dashboard access configuration
  dashboards: {
    sales: { enabled: true, allowedRoles: ['admin', 'sales'] },
    supervisor: { enabled: true, allowedRoles: ['admin', 'supervisor'] },
    accountant: { enabled: true, allowedRoles: ['admin', 'accountant'] },
    delivery: { enabled: true, allowedRoles: ['admin', 'delivery'] },
    admin: { enabled: true, allowedRoles: ['admin'] },
  },

  // Feature flags
  features: {
    dataSync: true,
    notifications: true,
    chat: true,
  }
};
