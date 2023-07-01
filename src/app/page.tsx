'use client'
import ChoicesForm from './components/Form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-16 p-24">
      <h1 className="text-6xl font-bold text-center">Better Exams</h1>

      <div className="text-slate-400 items-center">
        <ChoicesForm />
      </div>
    </main>
  )
}