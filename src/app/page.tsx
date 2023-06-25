'use client'
import Image from 'next/image'
import { useState, FormEvent, ChangeEvent } from 'react';
import MyForm from './components/form';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-16 p-24">
      <h1 className="text-6xl font-bold text-center">"Exam Helper" Form Tests</h1>
      <div className="text-slate-400">
        <MyForm />
      </div>
    </main>
  )
}