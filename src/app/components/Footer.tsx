function Footer() {
  return (
    <footer className="flex flex-col items-center">
      <div className="flex w-full flex-row flex-wrap items-center justify-center space-x-2 text-center">
        <a href="/" className="group text-blue-400 hover:text-blue-500 transition-all duration-300">
          About
          <span className="block max-w-0 bg-blue-400 group-hover:max-w-full transition-all duration-300 h-0.5 group-hover:bg-blue-500"></span>
        </a>

        <p>•</p>

        <a href="/" className="group text-red-400 hover:text-red-500">
          Contact
          <span className="block max-w-0 bg-red-400 group-hover:max-w-full transition-all duration-300 h-0.5 group-hover:bg-red-500"></span>
        </a>

        
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-white hover:text-red-500 transition-all duration-300">
          •
        </a>
        {/*  teehee */}

        <a href="https://github.com/General-Mudkip/exam-help-tests" target="_blank" className="group text-green-400 hover:text-green-500">
          Github
          <span className="block max-w-0 bg-green-400 group-hover:max-w-full transition-all duration-300 h-0.5 group-hover:bg-green-500"></span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;