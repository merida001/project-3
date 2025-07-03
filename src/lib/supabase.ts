
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxzimmiytqxqfmjoxhrq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emltbWl5dHF4cWZtam94aHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTg0NDEsImV4cCI6MjA2NjY5NDQ0MX0.1YHWeNX8jnjvN1Fy5HW3abuuMSyHXMN-_M_CI_UWPBA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: 'anonymous' | 'registered' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          role?: 'anonymous' | 'registered' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          role?: 'anonymous' | 'registered' | 'admin';
          created_at?: string;
        };
      };
      annonces: {
        Row: {
          id: string;
          titre: string;
          description: string;
          categorie: string;
          lieu: string;
          date_perte: string;
          status: 'perdu' | 'retrouve' | 'rendu';
          user_id: string;
          created_at: string;
          image_url?: string | null;
        };
        Insert: {
          id?: string;
          titre: string;
          description: string;
          categorie: string;
          lieu: string;
          date_perte: string;
          status: 'perdu' | 'retrouve' | 'rendu';
          user_id: string;
          created_at?: string;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          titre?: string;
          description?: string;
          categorie?: string;
          lieu?: string;
          date_perte?: string;
          status?: 'perdu' | 'retrouve' | 'rendu';
          user_id?: string;
          created_at?: string;
          image_url?: string | null;
        };
      };
      matching: {
        Row: {
          id: string;
          annonce_perte_id: string;
          annonce_retrouvee_id: string;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          annonce_perte_id: string;
          annonce_retrouvee_id: string;
          score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          annonce_perte_id?: string;
          annonce_retrouvee_id?: string;
          score?: number;
          created_at?: string;
        };
      };
      restitutions: {
        Row: {
          id: string;
          annonce_id: string;
          user_id: string;
          date_restitution: string;
          confirmation: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          annonce_id: string;
          user_id: string;
          date_restitution: string;
          confirmation?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          annonce_id?: string;
          user_id?: string;
          date_restitution?: string;
          confirmation?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
