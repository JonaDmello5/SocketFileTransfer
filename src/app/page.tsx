import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Network, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
          <div className="container px-4 md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-foreground">
              SocketFileTransfer
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Securely and efficiently transfer files directly to any machine using a TCP socket connection.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/setup">View Setup Guide</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-headline font-bold tracking-tighter text-center mb-10">
              Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <FileUp className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-headline">Direct File Transfer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Send files from your browser directly to a remote host with our Python receiver script.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Network className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-headline">Real-time Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Monitor your file transfer progress and view live logs as they happen.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-headline">Secure & Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    With fallback signed URLs, your file is always accessible even if the direct transfer fails.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
