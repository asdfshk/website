
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFileStorage } from '@/hooks/useFileStorage';
import { useToast } from '@/hooks/use-toast';

const FilesManager = () => {
  const { files, isUploading, uploadFile, deleteFile, getShareableLink } = useFileStorage();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        await uploadFile(selectedFiles[i]);
      }
      
      // Reset the file input
      setSelectedFiles(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your files.",
        variant: "destructive",
      });
    }
  };
  
  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/download/${id}`;
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link copied",
      description: "Download link copied to clipboard.",
    });
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">File Manager</h1>
          <p className="text-muted-foreground">Upload and manage your project files</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <Input 
            id="file-upload"
            type="file" 
            onChange={handleFileChange} 
            multiple
            className="max-w-xs"
          />
          <Button onClick={handleUpload} disabled={isUploading || !selectedFiles}>
            {isUploading ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white mr-2"></span>
                Uploading...
              </span>
            ) : (
              'Upload'
            )}
          </Button>
        </div>
      </div>
      
      {/* File list */}
      <div className="border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-12 bg-card px-4 py-3 border-b border-border">
          <div className="col-span-5 font-medium">Name</div>
          <div className="col-span-2 font-medium">Size</div>
          <div className="col-span-3 font-medium">Upload Date</div>
          <div className="col-span-2 font-medium text-right">Actions</div>
        </div>
        
        {files.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground">
            No files uploaded yet. Upload files to share with others.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {files.map((file) => (
              <div key={file.id} className="grid grid-cols-12 px-4 py-4 items-center hover:bg-secondary/20">
                <div className="col-span-5 truncate">{file.name}</div>
                <div className="col-span-2">{formatFileSize(file.size)}</div>
                <div className="col-span-3">{formatDate(file.createdAt)}</div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyLink(file.id)}
                  >
                    Copy Link
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteFile(file.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesManager;
