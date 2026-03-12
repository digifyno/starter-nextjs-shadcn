import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
      <p className="text-lg text-muted-foreground">
        Next.js + React + shadcn/ui starter template
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/about">Get Started</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn More (opens in a new tab)"
          >
            Learn More <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
