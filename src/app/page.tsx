import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, KeySquare, DownloadCloud } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
          <div className="container px-4 md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-foreground">
              SimpleShare
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Securely and efficiently transfer files from one browser to another using a simple code.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard">Send a File</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/receive">Receive a File</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-headline font-bold tracking-tighter text-center mb-10">
              How It Works
            </h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <UploadCloud className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-headline">1. Upload Your File</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Select any file from your device to begin the transfer.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <KeySquare className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-headline">2. Share The Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Share the unique transfer code with your recipient.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <DownloadCloud className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-headline">3. Receive The File</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                   The recipient enters the code to download the file directly.
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
