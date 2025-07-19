'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';

const receiverCode = `
import socket
import tqdm
import os

# device's IP address
SERVER_HOST = "0.0.0.0"
SERVER_PORT = 5001
# receive 4096 bytes each time
BUFFER_SIZE = 4096
SEPARATOR = "<SEPARATOR>"

# create the server socket
# TCP socket
s = socket.socket()

# bind the socket to our local address
s.bind((SERVER_HOST, SERVER_PORT))

# enabling our server to accept connections
# 5 here is the number of unaccepted connections that
# the system will allow before refusing new connections
s.listen(5)
print(f"[*] Listening as {SERVER_HOST}:{SERVER_PORT}")

# accept connection if there is any
client_socket, address = s.accept() 
# if below code is executed, that means the sender is connected
print(f"[+] {address} is connected.")

# receive the file infos
# receive using client socket, not server socket
received = client_socket.recv(BUFFER_SIZE).decode()
filename, filesize = received.split(SEPARATOR)
# remove absolute path if there is
filename = os.path.basename(filename)
# convert to integer
filesize = int(filesize)

# start receiving the file from the socket
# and writing to the file stream
progress = tqdm.tqdm(range(filesize), f"Receiving {filename}", unit="B", unit_scale=True, unit_divisor=1024)
with open(filename, "wb") as f:
    while True:
        # read 1024 bytes from the socket (receive)
        bytes_read = client_socket.recv(BUFFER_SIZE)
        if not bytes_read:    
            # nothing is received
            # file transmitting is done
            break
        # write to the file the bytes we just received
        f.write(bytes_read)
        # update the progress bar
        progress.update(len(bytes_read))

# close the client socket
client_socket.close()
# close the server socket
s.close()
`;

export default function SetupPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(receiverCode.trim());
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Receiver Setup Guide</CardTitle>
          <CardDescription>Follow these steps on the destination machine to prepare for file transfer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-headline text-xl font-semibold">Step 1: Install Dependencies</h3>
            <p className="text-muted-foreground">
              This script requires Python 3 and the <code className="font-code bg-muted p-1 rounded-sm">tqdm</code> library for the progress bar. You can install it using pip.
            </p>
            <pre className="font-code bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              pip install tqdm
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-xl font-semibold">Step 2: Save the Receiver Script</h3>
            <p className="text-muted-foreground">
              Save the following Python code as <code className="font-code bg-muted p-1 rounded-sm">receiver.py</code> on the machine where you want to receive files.
            </p>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              </Button>
              <pre className="font-code bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-[500px]">
                {receiverCode.trim()}
              </pre>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-headline text-xl font-semibold">Step 3: Run the Script</h3>
            <p className="text-muted-foreground">
              Execute the script from your terminal. It will wait for an incoming connection. Ensure that port 5001 is open on your firewall if you are transferring over a public network.
            </p>
            <pre className="font-code bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              python receiver.py
            </pre>
            <p className="text-muted-foreground text-sm pt-2">
              Once the script is running and shows <code className="font-code bg-muted p-1 rounded-sm">[*] Listening as 0.0.0.0:5001</code>, you can start the transfer from this web interface. Use your machine's local or public IP address as the destination.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
