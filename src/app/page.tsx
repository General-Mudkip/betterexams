"use client";
import AboutDialog from "./components/Dialogs/AboutDialog";
import ContactDialog from "./components/Dialogs/ContactDialog";
import Footer from "./components/Footer";
import ChoicesForm from "./components/Form";

export default function Home() {
    return (
        <main className="min-h-screen h-full flex flex-col items-center p-24">
            <h1 className="text-6xl font-bold text-center">Better Exams</h1>
            <p className="italic text-white/70 mt-1">An Alternative To Examinations.ie</p>

            <div className="text-slate-400 items-center h-full mt-8 md:mt-14">
                <ChoicesForm />
            </div>

            <div className="flex-grow mt-14" />
            <AboutDialog />
            <ContactDialog />
            <Footer />
        </main>
    );
}
