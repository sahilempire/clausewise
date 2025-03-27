import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string;
  company: string;
  role: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  email_notifications: boolean;
  document_notifications: boolean;
  marketing_emails: boolean;
  dark_mode: boolean;
}

class UserService {
  async getCurrentUser(): Promise<{ data: User | null; error: Error | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { data: user, error: error as Error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error('No user found') };

      // First ensure the profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError?.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: profile.full_name || '',
            company: profile.company || '',
            role: profile.role || '',
            phone: profile.phone || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (createError) throw createError;
      } else {
        // Profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            ...profile,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      return { error: null };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error: error as Error };
    }
  }

  async getProfile(): Promise<{ data: UserProfile | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: new Error('No user found') };

      // First try to get the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If no profile exists, create one
      if (error?.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) throw createError;
        return { data: newProfile, error: null };
      }

      return { data, error: error as Error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error('No user found') };

      // First ensure settings exist
      const { data: existingSettings, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError?.code === 'PGRST116') {
        // Settings don't exist, create them
        const { error: createError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            email_notifications: settings.email_notifications ?? true,
            document_notifications: settings.document_notifications ?? true,
            marketing_emails: settings.marketing_emails ?? false,
            dark_mode: settings.dark_mode ?? true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (createError) throw createError;
      } else {
        // Settings exist, update them
        const { error: updateError } = await supabase
          .from('user_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }

      return { error: null };
    } catch (error) {
      console.error('Error in updateSettings:', error);
      return { error: error as Error };
    }
  }

  async getSettings(): Promise<{ data: UserSettings | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: new Error('No user found') };

      // First try to get the settings
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // If no settings exist, create default ones
      if (error?.code === 'PGRST116') {
        const defaultSettings: UserSettings = {
          email_notifications: true,
          document_notifications: true,
          marketing_emails: false,
          dark_mode: true,
        };

        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            ...defaultSettings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) throw createError;
        return { data: newSettings, error: null };
      }

      return { data, error: error as Error };
    } catch (error) {
      console.error('Error in getSettings:', error);
      return { data: null, error: error as Error };
    }
  }

  async deleteAccount(): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error('No user found') };

      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) return { error: profileError as Error };

      // Delete user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id);

      if (settingsError) return { error: settingsError as Error };

      // Delete user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      return { error: deleteError as Error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { error: error as Error };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      return { error: error as Error };
    }
  }
}

export const userService = new UserService(); 