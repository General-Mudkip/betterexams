'use client'
import MyForm from './components/form';
import PaperCard from './components/paperCard';
import PaperGrid from './components/paperGrid';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-16 p-24">
      <h1 className="text-6xl font-bold text-center">Exam Helper Form Tests</h1>
      <div className="text-slate-400">
        <MyForm />
      </div>

      <PaperGrid />
    </main>
  )
}