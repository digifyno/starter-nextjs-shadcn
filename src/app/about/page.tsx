import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>
      <p className="text-lg text-muted-foreground">This is an example page.</p>
      <Button asChild variant="outline">
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}
