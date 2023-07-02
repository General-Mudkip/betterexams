interface PaperCardProps {
    type: string;
    subject: string;
    paperName: string;
    year: string;
    url: string;
}

function PaperCard({type, subject, paperName, year, url}: PaperCardProps) {

    function determineCategoryName(catName: string) {
        switch(catName) {
            case "exampapers":
                return "Exam Paper"
            case "markingschemes":
                return "Marking Scheme"
            case "deferredexams":
                return "Deferred Exams"
            case "deferredmarkingschemes":
                return "Deferred Marking Schemes"
            default:
                return "Unknown"
        }
    }

    function determineCardColour(catName: string) {
        switch(catName) {
            case "exampapers":
                return "border-l-blue-500 hover:border-l-blue-600"
            case "markingschemes":
                return "border-l-red-500 hover:border-l-red-500"
            case "deferredexams":
                return "border-l-green-500 hover:border-l-green-600"
            case "deferredmarkingschemes":
                return "border-l-yellow-300 hover:border-l-yellow-400"
            default:
                return "border-l-slate-300 hover:border-l-slate-400"
        }
    }

    return(
        <a href={url} target="_blank">
            <div 
            className={
                `
                w-96 h-36 border-l-8 p-3 rounded-lg text-white flex flex-col justify-between group bg-zinc-900
                ${determineCardColour(type)}
                transform transition-all duration-[350ms] ease-in-out
                hover:scale-105 hover:bg-[#595959] hover:shadow-lg
                `
            }>
                <div> 
                    <h3 className="italic">
                    {determineCategoryName(type)} • {subject} {/*  TODO: Add a language */}
                    </h3>
                    <h1 className="text-2xl font-bold mt-1">{paperName}</h1>
                </div>

                <div>
                    <p className="font-mono italic text-slate-300 self-end">{year}</p>
                </div>

            </div>
        </a>
        
    )
}

export default PaperCard