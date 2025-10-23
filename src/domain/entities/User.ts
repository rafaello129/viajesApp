export interface User {
    uid: string;
    username: string;
    name?: string;
    email?: string;
    phone?: string;
    picture?: string;
    is_online: boolean;
    is_active: boolean;
    is_disabled: boolean;
    is_google: boolean;
    created_at: Date;
    updated_at: Date;
    profile?: any;
    role?: string;
  }