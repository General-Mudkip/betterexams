'use client'
import Footer from './components/Footer';
import ChoicesForm from './components/Form';

export default function Home() {
  return (
    <main className="min-h-screen h-full flex flex-col items-center gap-16 p-24">
      <h1 className="text-6xl font-bold text-center">Better Exams</h1>

      <div className="text-slate-400 items-center h-full">
        <ChoicesForm />
      </div>
      
      <div className="flex-grow" />

      <Footer />
      
    </main>
  )
}