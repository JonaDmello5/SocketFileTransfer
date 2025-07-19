'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, File, X, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

type TransferStatus = 'idle' | 'uploading' | 'transferring' | 'completed' | 'failed';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [ipAddress, setIpAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<TransferStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
  }, [toast]);

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
    setIpAddress('');
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const startTransfer = () => {
    if (!file || !ipAddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please select a file and enter a valid IP address.',
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
          if (status === 'uploading') {
            addLog('File uploaded to temporary storage.');
            setStatus('transferring');
            startSocketTransfer();
          } else {
            addLog('File transfer complete.');
            setStatus('completed');
          }
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };
  
  const startSocketTransfer = () => {
    setProgress(0);
    addLog(`Initiating socket transfer to ${ipAddress}...`);
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (Math.random() > 0.95 && prev > 20 && prev < 80) { // Random failure
           clearInterval(intervalRef.current!);
           addLog(`Error: Connection to ${ipAddress} lost.`);
           setStatus('failed');
           return prev;
        }
        if (newProgress >= 100) {
          clearInterval(intervalRef.current!);
          addLog('File transfer complete.');
          setStatus('completed');
          return 100;
        }
        addLog(`Sent chunk... ${prev + 5}%`);
        return newProgress;
      });
    }, 400);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">New Transfer</CardTitle>
              <CardDescription>Select a file and destination IP address.</CardDescription>
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium truncate">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="ip-address">Destination IP Address</Label>
                <Input
                  id="ip-address"
                  placeholder="e.g., 192.168.1.100"
                  value={ipAddress}
                  onChange={e => setIpAddress(e.target.value)}
                  disabled={status === 'uploading' || status === 'transferring'}
                />
              </div>

              <Button
                onClick={startTransfer}
                disabled={!file || !ipAddress || status === 'uploading' || status === 'transferring'}
                className="w-full"
              >
                Send File
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-headline">Transfer Status</CardTitle>
              <CardDescription>Real-time progress and logs of your transfer.</CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'idle' && !file && (
                <div className="text-center text-muted-foreground p-8">
                  <p>Waiting for a new transfer to start...</p>
                </div>
              )}
              {(status !== 'idle' || file) && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {status === 'uploading' && 'Uploading to cloud...'}
                      {status === 'transferring' && `Transferring to ${ipAddress}...`}
                      {status === 'completed' && 'Transfer Completed!'}
                      {status === 'failed' && 'Transfer Failed.'}
                      {(status === 'idle' && file) && 'Ready to transfer.'}
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
                      <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <LinkIcon className="w-5 h-5 text-primary"/>
                              <p className="text-sm font-medium">As a fallback, your file is available at this secure link for 1 hour.</p>
                          </div>
                          <Button variant="outline" size="sm">Copy Link</Button>
                      </CardContent>
                    </Card>
                  )}
                  {status === 'failed' && (
                     <Card className="bg-destructive/10 border-destructive/20">
                      <CardContent className="p-4 flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-destructive"/>
                          <div>
                            <p className="text-sm font-semibold text-destructive">The transfer could not be completed.</p>
                            <p className="text-sm text-destructive/80">Please check the receiver status and try again.</p>
                          </div>
                      </CardContent>
                    </Card>
                  )}
                   {(status === 'completed' || status === 'failed') && (
                     <Button onClick={resetState} variant="secondary" className="w-full">Start New Transfer</Button>
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
