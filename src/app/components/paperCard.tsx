interface PaperCardProps {
    type: string;
    subject: string;
    paperName: string;
    year: string;
    url: string;
}

function PaperCard({type, subject, paperName, year, url}: PaperCardProps) {
    return(
        <a href={url} target="_blank">
            <div className="w-96 h-36 border-2 p-3 border-white rounded-lg">
                <h1 className="text-2xl font-bold">{subject}</h1>
                <h2>{paperName}</h2>
                <p>{year}</p>
            </div>
        </a>
        
    )
}

export default PaperCard