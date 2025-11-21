import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side redirect to landing page (instant, no blank page)
  redirect('/landing');
}