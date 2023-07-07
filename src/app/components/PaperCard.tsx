import { AnimatePresence, motion } from "framer-motion";

interface PaperCardProps {
    type: string;
    subject: string;
    paperName: string;
    year: string;
    url: string;
}

function PaperCard({ type, subject, paperName, year, url }: PaperCardProps) {
    function determineCategoryName(catName: string) {
        switch (catName) {
            case "exampapers":
                return "Exam Paper";
            case "markingschemes":
                return "Marking Scheme";
            case "deferredexams":
                return "Deferred Exams";
            case "deferredmarkingschemes":
                return "Deferred Marking Schemes";
            default:
                return "Unknown";
        }
    }

    function determineCardColour(catName: string) {
        switch (catName) {
            case "exampapers":
                return "border-l-blue-500 hover:border-l-blue-600";
            case "markingschemes":
                return "border-l-red-500 hover:border-l-red-500";
            case "deferredexams":
                return "border-l-green-500 hover:border-l-green-600";
            case "deferredmarkingschemes":
                return "border-l-yellow-300 hover:border-l-yellow-400";
            default:
                return "border-l-slate-300 hover:border-l-slate-400";
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0.7, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.35 }}
            >
                <a href={url} target="_blank">
                    <div
                        className={`group
                        w-auto h-auto min-w-[320px] min-h-[8rem] max-h-9 lg:min-h-[9rem] border-l-8 p-3 rounded-lg text-white flex flex-col justify-between group bg-zinc-900
                        ${determineCardColour(type)} overflow-auto
                        transform transition-all duration-[350ms] ease-in-out
                        hover:scale-105
                        sm:w-96
                        `}
                    >
                        <div>
                            <h3 className="italic">
                                {determineCategoryName(type)} • {subject}{" "}
                                {/*  TODO: Add a language */}
                            </h3>
                            <h1 className="text-2xl font-bold mt-1">
                                {paperName}
                            </h1>
                        </div>

                        <div>
                            <p className="font-mono italic text-slate-300 self-end">
                                {year}
                            </p>
                        </div>
                    </div>
                </a>
            </motion.div>
        </AnimatePresence>
    );
}

export default PaperCard;
