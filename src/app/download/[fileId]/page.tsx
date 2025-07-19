'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadCloud, File, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// This is a mock file details object. In a real application,
// you would fetch this information from your backend using the fileId.
const MOCK_FILE_DETAILS = {
  name: 'example-document.pdf',
  size: '4.2 MB', // In a real app, you'd calculate this from bytes
  type: 'application/pdf',
};

type FileDetails = typeof MOCK_FILE_DETAILS | null;

export default function DownloadPage() {
  const params = useParams();
  const fileId = params.fileId;
  const [fileDetails, setFileDetails] = useState<FileDetails>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (fileId) {
      // Simulate fetching file details from a backend
      console.log(`Fetching details for fileId: ${fileId}`);
      setTimeout(() => {
        // In a real app, if the file ID is not found, you'd set an error.
        if (fileId === 'not-found') {
           setError('File not found. The link may have expired or is incorrect.');
        } else {
           setFileDetails(MOCK_FILE_DETAILS);
        }
      }, 500);
    }
  }, [fileId]);

  const handleDownload = () => {
    setIsDownloading(true);
    // In a real application, this would trigger the actual file download
    // from your storage service (e.g., Firebase Storage).
    toast({
      title: 'Download Started',
      description: `Downloading ${fileDetails?.name}...`,
    });
    setTimeout(() => {
        setIsDownloading(false);
    }, 2000); // Simulate download time
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
       <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Download File</CardTitle>
          <CardDescription>You have been sent a file. Click below to download.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {error ? (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                    <p className="font-semibold text-destructive">{error}</p>
                </div>
            ) : fileDetails ? (
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <File className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold break-all">{fileDetails.name}</p>
                            <p className="text-sm text-muted-foreground">{fileDetails.size}</p>
                        </div>
                    </div>
                    <Button onClick={handleDownload} disabled={isDownloading} className="w-full" size="lg">
                        <DownloadCloud className="mr-2 h-5 w-5" />
                        {isDownloading ? 'Downloading...' : 'Download'}
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-center p-6">
                    <p className="text-muted-foreground">Loading file details...</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

function toast(props: { title: string, description: string }) {
    // A simple placeholder for the toast function
    console.log(`${props.title}: ${props.description}`);
}
