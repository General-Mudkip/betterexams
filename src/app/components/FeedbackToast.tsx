const FeedbackToast = () => {
  return (
    <div className="absolute flex flex-col align-middle bottom-12 mx-auto max-w-[90%] w-[26rem] h-32 p-3 rounded-lg bg-gray-900">
      <p className="italic">How has your experience with the website been?</p>
      <div className="flex text-5xl flex-row gap-x-4 m-auto">
        <button className="!bg-transparent hover:scale-125 transition-all duration-250">
          ☹️
        </button>
        <button className="!bg-transparent hover:scale-125 transition-all duration-250">
          😐
        </button>
        <button className="!bg-transparent hover:scale-125 transition-all duration-250">
          🙂
        </button>
      </div>
    </div>
  );
};

export default FeedbackToast;
