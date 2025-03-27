import { supabase } from "@/lib/supabase";

export interface ContractFile {
  id: string;
  name: string;
  content: string;
  created_at: string;
  user_id: string;
}

export const contractStorageService = {
  async saveContract(contract: string, template: string): Promise<ContractFile | null> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const fileName = `${user.data.user.id}/${template.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.txt`;
      
      const { data, error } = await supabase.storage
        .from('contracts')
        .upload(fileName, contract, {
          contentType: 'text/plain',
          upsert: false
        });

      if (error) throw error;

      return {
        id: data.path,
        name: fileName,
        content: contract,
        created_at: new Date().toISOString(),
        user_id: user.data.user.id
      };
    } catch (error) {
      console.error('Error saving contract:', error);
      return null;
    }
  },

  async getContracts(): Promise<ContractFile[]> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const { data, error } = await supabase.storage
        .from('contracts')
        .list(user.data.user.id);

      if (error) throw error;

      const contracts = await Promise.all(
        data.map(async (file) => {
          const { data: content } = await supabase.storage
            .from('contracts')
            .download(`${user.data.user.id}/${file.name}`);

          return {
            id: file.name,
            name: file.name,
            content: await content?.text() || '',
            created_at: file.created_at,
            user_id: user.data.user.id
          };
        })
      );

      return contracts;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return [];
    }
  },

  async deleteContract(fileId: string): Promise<boolean> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const { error } = await supabase.storage
        .from('contracts')
        .remove([`${user.data.user.id}/${fileId}`]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting contract:', error);
      return false;
    }
  }
}; 