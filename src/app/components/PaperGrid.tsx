import PaperCard from "./PaperCard";

interface PaperGridProps {
  examPaperList: string[][];
}

function PaperGrid({ examPaperList }: PaperGridProps) {
  const refreshGrid = () => {
    return examPaperList.map((paper) => (
      <PaperCard
        key={paper[0] + paper[1] + paper[2] + paper[3]} // I'm only human after all
        type={paper[0]}
        subject={paper[1]}
        paperName={paper[2]}
        year={paper[3]}
        url={paper[4]}
      />
    ));
  };

  return (
    <div className="flex flex-row flex-wrap gap-8 mt-8 justify-center">
      {refreshGrid()}
    </div> // 
  );
}

export default PaperGrid;