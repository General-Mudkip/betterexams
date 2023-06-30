import PaperCard from "./paperCard";

function PaperGrid() {
    
    function refreshCards() {
        
    }

    return(
        <div className="grid grid-flow-col auto-cols-max gap-4 justify-items-center">
            <PaperCard 
                type="exampapers"
                subject="Mathematics"
                paperName="Paper One / Higher Level (EV)"
                year="2019"
                url="https://www.examinations.ie/archive//exampapers/2019/LC003ALP100EV.pdf"
            />
            <PaperCard 
                type="exampapers"
                subject="Mathematics"
                paperName="Paper One / Higher Level (EV)"
                year="2019"
                url="https://www.examinations.ie/archive//exampapers/2019/LC003ALP100EV.pdf"
            />
            <PaperCard 
                type="exampapers"
                subject="Mathematics"
                paperName="Paper One / Higher Level (EV)"
                year="2019"
                url="https://www.examinations.ie/archive//exampapers/2019/LC003ALP100EV.pdf"
            />
        </div>
    )
}

export default PaperGrid;