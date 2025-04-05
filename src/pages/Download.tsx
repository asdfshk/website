
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface FileDetails extends Tables<'files'> {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  created_at: string;
}

const Download = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<FileDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    const fetchFile = async () => {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error || !data) {
          setNotFound(true);
        } else {
          setFile(data as FileDetails);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFile();
  }, [id]);
  
  const handleDownload = () => {
    if (file) {
      // Create a temporary anchor to trigger download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="container max-w-lg mx-auto py-16">
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">File Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The file you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-lg mx-auto py-16">
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Download File</h1>
          <p className="text-muted-foreground mt-2">
            You're about to download a file from John Connor's portfolio
          </p>
        </div>
        
        <div className="border border-border rounded-md p-4 mb-6">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">File Name:</span>
              <span className="font-medium">{file?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span>{((file?.size || 0) / 1024).toFixed(2)} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span>{file?.type || 'Unknown'}</span>
            </div>
          </div>
        </div>
        
        <Button className="w-full" onClick={handleDownload}>
          Download Now
        </Button>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-primary text-sm hover:underline">
            Back to John Connor's Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Download;
