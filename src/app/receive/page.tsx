'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadCloud, File, AlertTriangle, Search, Loader2 } from 'lucide-react';
import { useState, useRef, useTransition } from 'react';
import { Input } from '@/components/ui/input';

// This is a mock file details object. In a real application,
// you would fetch this information from your backend using the transfer code.
const MOCK_FILES: { [code: string]: { name: string; size: string } } = {
  'ABC123': {
    name: 'example-document.pdf',
    size: '4.2 MB',
  },
  'XYZ789': {
    name: 'archive.zip',
    size: '25.6 MB',
  }
};

type FileDetails = { name: string; size: string } | null;

export default function ReceivePage() {
  const [code, setCode] = useState('');
  const [fileDetails, setFileDetails] = useState<FileDetails>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, startSearching] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    setError(null);
    setFileDetails(null);
    if (!code) {
      setError('Please enter a transfer code.');
      return;
    }
    startSearching(() => {
      // Simulate fetching file details from a backend
      setTimeout(() => {
        const file = MOCK_FILES[code.toUpperCase()];
        if (file) {
          setFileDetails(file);
        } else {
          setError('File not found. The code may be invalid or expired.');
        }
      }, 750);
    });
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // In a real application, this would trigger the actual file download
    console.log(`Downloading ${fileDetails?.name}...`);
    // A simple placeholder for a toast function
    alert(`Download Started: Downloading ${fileDetails?.name}...`);
    setTimeout(() => {
        setIsDownloading(false);
    }, 2000); // Simulate download time
  };
  
  const handleNewSearch = () => {
    setCode('');
    setFileDetails(null);
    setError(null);
    setIsDownloading(false);
    inputRef.current?.focus();
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Receive File</CardTitle>
          <CardDescription>Enter the transfer code you received to download the file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!fileDetails && (
             <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="font-mono text-lg tracking-widest"
                  maxLength={6}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={isSearching}
                />
                <Button onClick={handleSearch} disabled={isSearching || !code}>
                  {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                  <span className="sr-only">Find File</span>
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <p>{error}</p>
                </div>
              )}
            </div>
          )}
          
          {isSearching && !fileDetails && !error && (
             <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p>Searching for your file...</p>
            </div>
          )}

          {fileDetails && (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50">
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
               <Button onClick={handleNewSearch} variant="outline" className="w-full">
                Receive Another File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}