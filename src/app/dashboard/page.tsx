'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, File, X, AlertCircle, HelpCircle, Copy, KeySquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type TransferStatus = 'idle' | 'uploading' | 'completed' | 'failed';

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<TransferStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [transferCode, setTransferCode] = useState('');

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
      setTransferCode('');
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
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    setTransferCode('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const startTransfer = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a file to transfer.',
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
          // Dummy code generation
          const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          setTransferCode(newCode);
          addLog(`Your transfer code is: ${newCode}`);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };
  
  const copyCode = () => {
    navigator.clipboard.writeText(transferCode);
    toast({
      title: 'Code Copied!',
      description: 'The transfer code has been copied to your clipboard.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Send a File</CardTitle>
              <CardDescription>Upload a file to generate a unique transfer code.</CardDescription>
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
              
              <Button
                onClick={startTransfer}
                disabled={!file || status === 'uploading'}
                className="w-full"
              >
                {status === 'uploading' ? 'Sending...' : 'Get Transfer Code'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-headline">Transfer Status</CardTitle>
              <CardDescription>Real-time progress of your file transfer.</CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'idle' && !file && (
                <div className="text-center text-muted-foreground p-8 space-y-4">
                   <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground/50"/>
                  <div>
                    <p>Ready to send a file.</p>
                     <p className="text-sm">Upload a file to get started.</p>
                  </div>
                </div>
              )}
              {(status !== 'idle' || file) && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {status === 'uploading' && 'Sending...'}
                      {status === 'completed' && 'Transfer Ready!'}
                      {status === 'failed' && 'Transfer Failed.'}
                      {(status === 'idle' && file) && 'Ready to send.'}
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
                        <CardTitle className="text-lg flex items-center gap-2"><KeySquare className="w-5 h-5 text-primary"/> Your file is ready to be received!</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">Share this code with the recipient. They can use it on the 'Receive' page to download the file.</p>
                          <div className="flex items-center gap-2">
                            <Input value={transferCode} readOnly className="bg-background font-mono text-lg tracking-widest"/>
                            <Button variant="outline" size="icon" onClick={copyCode}>
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
                            <p className="text-sm font-semibold text-destructive">The transfer could not be completed.</p>
                            <p className="text-sm text-destructive/80">Please check your connection and try again.</p>
                          </div>
                      </CardContent>
                    </Card>
                  )}
                   {(status === 'completed' || status === 'failed') && (
                     <Button onClick={resetState} variant="secondary" className="w-full">Send Another File</Button>
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