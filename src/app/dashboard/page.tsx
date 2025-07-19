'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, File, X, Link as LinkIcon, AlertCircle, HelpCircle, Copy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type TransferStatus = 'idle' | 'uploading' | 'completed' | 'failed';

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<TransferStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [shareableLink, setShareableLink] = useState('');

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select a file smaller than 100MB.',
        });
        return;
      }
      setFile(selectedFile);
      setStatus('idle');
      setProgress(0);
      setLogs([]);
      setShareableLink('');
    }
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileChange(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const resetState = () => {
    setFile(null);
    setRecipientEmail('');
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    setShareableLink('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const startTransfer = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a file to share.',
      });
      return;
    }
    
    setStatus('uploading');
    setProgress(0);
    setLogs([]);
    addLog(`Preparing to upload ${file.name}.`);

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current!);
          addLog('File uploaded successfully.');
          setStatus('completed');
          // Dummy link generation
          let newLink = `${window.location.origin}/download/${Date.now()}`;
          if (recipientEmail) {
            newLink += `?recipient=${encodeURIComponent(recipientEmail)}`;
            addLog(`File is intended for ${recipientEmail}.`);
          }
          setShareableLink(newLink);
          addLog(`Shareable link created.`);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: 'Link Copied!',
      description: 'The shareable link has been copied to your clipboard.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Share a File</CardTitle>
              <CardDescription>Upload a file and specify a recipient to generate a shareable link.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!file ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                    isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <UploadCloud className="w-12 h-12 text-muted-foreground" />
                  <p className="mt-4 text-center text-muted-foreground">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">Max file size: 100MB</p>
                  <input id="file-upload" type="file" className="hidden" onChange={e => handleFileChange(e.target.files?.[0] || null)} />
                </div>
              ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <File className="w-6 h-6 text-primary" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                </div>
              )}

              {file && (
                <div className="space-y-2">
                    <Label htmlFor="recipient-email">Recipient Email (Optional)</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input 
                            id="recipient-email" 
                            type="email" 
                            placeholder="recipient@example.com" 
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
              )}
              
              <Button
                onClick={startTransfer}
                disabled={!file || status === 'uploading'}
                className="w-full"
              >
                {status === 'uploading' ? 'Uploading...' : 'Get Share Link'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-headline">Upload Status</CardTitle>
              <CardDescription>Real-time progress of your file upload.</CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'idle' && !file && (
                <div className="text-center text-muted-foreground p-8 space-y-4">
                   <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground/50"/>
                  <div>
                    <p>Ready to share a file.</p>
                     <p className="text-sm">Upload a file to get started.</p>
                  </div>
                </div>
              )}
              {(status !== 'idle' || file) && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {status === 'uploading' && 'Uploading...'}
                      {status === 'completed' && 'Upload Complete!'}
                      {status === 'failed' && 'Upload Failed.'}
                      {(status === 'idle' && file) && 'Ready to upload.'}
                    </Label>
                    <Progress value={progress} className={cn('w-full mt-2', { 'progress-gradient': status !== 'failed' })} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Logs</Label>
                    <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/50">
                       <div ref={logsContainerRef}>
                          {logs.map((log, i) => <p key={i} className="text-sm font-code text-muted-foreground">{log}</p>)}
                       </div>
                    </ScrollArea>
                  </div>
                  
                  {status === 'completed' && (
                    <Card className="bg-green-500/10 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><LinkIcon className="w-5 h-5 text-primary"/> Your file is ready to share!</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">Anyone with this link can download the file. {recipientEmail && `It is intended for ${recipientEmail}.`}</p>
                          <div className="flex items-center gap-2">
                            <Input value={shareableLink} readOnly className="bg-background"/>
                            <Button variant="outline" size="icon" onClick={copyLink}>
                              <Copy className="w-4 h-4"/>
                            </Button>
                          </div>
                      </CardContent>
                    </Card>
                  )}
                  {status === 'failed' && (
                     <Card className="bg-destructive/10 border-destructive/20">
                      <CardContent className="p-4 flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-destructive"/>
                          <div>
                            <p className="text-sm font-semibold text-destructive">The upload could not be completed.</p>
                            <p className="text-sm text-destructive/80">Please check your connection and try again.</p>
                          </div>
                      </CardContent>
                    </Card>
                  )}
                   {(status === 'completed' || status === 'failed') && (
                     <Button onClick={resetState} variant="secondary" className="w-full">Share Another File</Button>
                   )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
