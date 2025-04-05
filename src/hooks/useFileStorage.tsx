
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Tables } from '@/integrations/supabase/types';

interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface FileStorageContextType {
  files: FileInfo[];
  isUploading: boolean;
  uploadFile: (file: File) => Promise<FileInfo>;
  deleteFile: (id: string) => void;
  getShareableLink: (id: string) => string;
}

const FileStorageContext = createContext<FileStorageContextType | undefined>(undefined);

export const FileStorageProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedFiles: FileInfo[] = data.map((file: Tables<'files'>) => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url,
          createdAt: new Date(file.created_at || ''),
        }));
        setFiles(formattedFiles);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error fetching files",
        description: "There was a problem loading your files.",
        variant: "destructive",
      });
    }
  };

  const uploadFile = async (file: File): Promise<FileInfo> => {
    setIsUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('project_files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project_files')
        .getPublicUrl(filePath);

      // Create a record in the files table
      const newFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
      };

      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert([newFile])
        .select()
        .single();

      if (dbError) {
        // If database insert fails, try to delete the uploaded file
        await supabase.storage.from('project_files').remove([filePath]);
        throw dbError;
      }

      if (!fileRecord) {
        throw new Error("Failed to retrieve uploaded file record");
      }

      // Format the returned file
      const fileInfo: FileInfo = {
        id: fileRecord.id,
        name: fileRecord.name,
        size: fileRecord.size,
        type: fileRecord.type,
        url: fileRecord.url,
        createdAt: new Date(fileRecord.created_at || ''),
      };

      setFiles(prevFiles => [fileInfo, ...prevFiles]);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      
      return fileInfo;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your file.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (id: string) => {
    try {
      // Find the file first to get its path
      const fileToDelete = files.find(file => file.id === id);
      
      if (!fileToDelete) {
        toast({
          title: "Error",
          description: "File not found.",
          variant: "destructive",
        });
        return;
      }

      // Extract the file path from the URL
      const url = new URL(fileToDelete.url);
      const pathMatch = url.pathname.match(/\/project_files\/(.+)$/);
      const filePath = pathMatch?.[1];

      if (filePath) {
        // Delete from storage
        await supabase.storage
          .from('project_files')
          .remove([decodeURIComponent(filePath)]);
      }

      // Delete from database
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update state
      setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
      
      toast({
        title: "File deleted",
        description: `${fileToDelete.name} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete failed",
        description: error.message || "There was a problem deleting your file.",
        variant: "destructive",
      });
    }
  };

  const getShareableLink = (id: string): string => {
    const file = files.find(file => file.id === id);
    return file ? `/download/${file.id}` : "";
  };

  return (
    <FileStorageContext.Provider 
      value={{ 
        files, 
        isUploading, 
        uploadFile, 
        deleteFile, 
        getShareableLink 
      }}
    >
      {children}
    </FileStorageContext.Provider>
  );
};

export const useFileStorage = () => {
  const context = useContext(FileStorageContext);
  
  if (context === undefined) {
    throw new Error('useFileStorage must be used within a FileStorageProvider');
  }
  
  return context;
};
