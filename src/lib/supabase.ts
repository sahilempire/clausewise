import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Initialize storage bucket
export const STORAGE_BUCKET = 'documents';

// Initialize storage bucket if it doesn't exist
export const initializeStorage = async () => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('User not authenticated, skipping storage initialization');
      return;
    }

    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['application/pdf', 'text/plain']
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return;
      }

      // Set up RLS policies for the bucket
      const { error: policyError } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl('test.txt', 60);
      if (policyError) {
        console.error('Error setting up storage policies:', policyError);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Call initialization
initializeStorage();

// Types for our database tables
export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
};

export type Contract = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'completed' | 'archived';
  user_id: string;
  organization_id?: string;
  metadata?: {
    type: string;
    parties: {
      party1: {
        name: string;
        address?: string;
      };
      party2: {
        name: string;
        address?: string;
      };
    };
    terms?: string;
    risk_level?: string;
  };
};

export type Organization = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
};

// Database schema types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      contracts: {
        Row: Contract;
        Insert: Omit<Contract, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contract, 'id' | 'created_at' | 'updated_at'>>;
      };
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}; 