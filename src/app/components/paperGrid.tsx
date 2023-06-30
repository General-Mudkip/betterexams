import PaperCard from "./paperCard";

interface PaperGridProps {
  examPaperList: string[][];
}

function PaperGrid({ examPaperList }: PaperGridProps) {
  const refreshGrid = () => {
    console.log("papergrid:" + examPaperList);
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
    <div className="grid grid-cols-3 gap-4 mt-8 justify-items-center">
      {refreshGrid()}
    </div>
  );
}

export default PaperGrid;