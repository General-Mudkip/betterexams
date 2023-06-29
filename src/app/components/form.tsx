'use client'
import { useState, ChangeEvent, useRef, useEffect } from 'react';

// INITIALISATION
var data = require('../files/data.json');
var subNumsToNames = data["subNumsToNames"]

const url: string = "https://www.examinations.ie/archive/";

function ChoicesForm() {
    const [certificate, setCertificate] = useState<string>('lc');
    const [subject, setSubject] = useState<string>('2');
    const [year, setYear] = useState<string>('2019');
    const [language, setLanguage] = useState<string>('EV');
    const [level, setLevel] = useState<string>('Higher');

    const [englishDisabled, setEnglishDisabled] = useState<boolean>(false);
    const [irishDisabled, setIrishDisabled] = useState<boolean>(true);

    const[higherDisabled, setHigherDisabled] = useState<boolean>(false);
    const[ordinaryDisabled, setOrdinaryDisabled] = useState<boolean>(false);
    const[foundationDisabled, setFoundationDisabled] = useState<boolean>(false);
    const[commonDisabled, setCommonDisabled] = useState<boolean>(false);

    const examListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        determineLanguageAvailability();
        determineLevelAvailability();
    }, [certificate, subject, year]);

    useEffect(() => { // Have to use two useEffects because of the asynchronity of updating the language state.
        console.log("After Determine: \n Higher Disabled? : " + higherDisabled + "\n Ordinary Disabled? : " + ordinaryDisabled + "\n Foundation Disabled? : " + foundationDisabled + "\n Common Disabled? : " + commonDisabled)
        grabExamUrls(certificate, subject, year, language, level);
    }, [certificate, subject, year, language, level, englishDisabled, irishDisabled]);
      
    // Adds the exam link to the list of exam papers (TEMPORARY (hopefully...))
    function addExamToList(examName: string, examUrl: string, category: string, year: string) {
        const examListEl = examListRef.current;
        if (examListEl) {
            let examEl = document.createElement("li");
            examEl.innerHTML = `<a target="_blank" href="${url}/${category}/${year}/${examUrl}">${category}: ${examName}</a>`;
            examListEl.appendChild(examEl);
        }
    }

    // Returns a list of exam papers for a given subject, year, language, and level.
    function grabExamUrls(cert: string, subjectId: string, year: string, language:string, level: string) {
        const examListEl = examListRef.current;
      
        if (englishDisabled) {
          setLanguage("IV");
        } else if (irishDisabled) {
          setLanguage("EV");
        }

        setCorrectLevel();
      
        if (examListEl) {
          examListEl.innerHTML = "<li>Papers:</li>";
        }
        let documentList = data[cert][subjectId][year]; // Navigates to the specific subject and year.
        let categories = Object.keys(documentList); // exampapers, marking schemes, etc.
      
        for (const cat of categories) {
          for (const doc of documentList[cat]) {
            let docName = doc["details"];
            let docUrl = doc["url"];
      
            if ((docName.includes(language) || docName.includes("BV") || docName.includes("File")) && (docName.includes(level) || docName.includes("Common") || docName.includes("File"))) {
              addExamToList(docName, docUrl, cat, year);
            }
          }
        }
      }

    function setCorrectLevel() { // If Ordinary or Higher is disabled; no clue. Better way TODO this.
        if (level === "Higher" && higherDisabled) {
            setLevel("Ordinary");
        } else if (level === "Ordinary" && ordinaryDisabled) {
            setLevel("Higher");
        } else if (level === "Foundation" && foundationDisabled) {
            setLevel("Higher");
        } else if (level === "Common" && commonDisabled) {
            setLevel("Higher");
        }
    }

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const name = event.target.name;
        const value = event.target.value;

        // Update the corresponding state hook based on the name
        switch (name) {
            case 'certificate':
                setCertificate(value);
                setSubject(Object.keys(subNumsToNames)[0]); // Reset the subject to the first available option
                // Call subjectChoiceLoad to update the subject options
                break;
            case 'subject':
                setSubject(value);

                // Check if the selected year is valid for the new subject
                if (!data[certificate][value].hasOwnProperty(year)) {
                    // If the selected year is invalid, update the year state
                    setYear(Object.keys(data[certificate][value])[0]);
                }
                break;
            case 'year':
                setYear(value);
                break;
            case 'language':
                setLanguage(value);
                break;
            case 'level':
                setLevel(value);
                break;
            default:
                break;
        }
    };

    function determineLanguageAvailability() { // I promise this is the best way to do this

        const exampapers = data[certificate][subject][year]["exampapers"];
        setEnglishDisabled(true);
        setIrishDisabled(true);

        for (const doc of exampapers) {
            const docName = doc.details;
            if (docName.includes("EV")) {
                setEnglishDisabled(false);
            }
            if (docName.includes("IV")) {
                setIrishDisabled(false);
            }
        }
    }

    function determineLevelAvailability() {
        const exampapers = data[certificate][subject][year]["exampapers"];
        console.log("\n\n\nTest")

        console.log("\nBefore Determine: \n Higher Disabled? : " + higherDisabled + "\n Ordinary Disabled? : " + ordinaryDisabled + "\n Foundation Disabled? : " + foundationDisabled + "\n Common Disabled? : " + commonDisabled)
        setHigherDisabled(true);
        setOrdinaryDisabled(true);
        setFoundationDisabled(true);
        setCommonDisabled(true);

        for (const doc of exampapers) {
            const docName = doc.details;
            if (!(docName.includes("Map") || docName.includes("Illustration"))) { // Prevents common level material (e.g Maps in geography) from enabling Common level
                if (docName.includes("Higher")) {
                    setHigherDisabled(false);
                }
                if (docName.includes("Ordinary")) {
                    setOrdinaryDisabled(false);
                }
                if (docName.includes("Foundation")) {
                    setFoundationDisabled(false);
                }
                if (docName.includes("Common")) {
                    setCommonDisabled(false);
                }
            }
        }
    }

    // Loads the subject choices from the data file dependent on what subject is selected
    function subjectChoiceLoad() {
    return Object.entries(subNumsToNames).map(([id]) => {
        if (data[certificate].hasOwnProperty(id)) {
        return (
            <option key={id} value={id}>
            {subNumsToNames[id]}
            </option>
        );
        } else {
        return null; // Skip rendering the option if the ID doesn't exist in data["lc"]
        }
    });
    }

    // Loads the year choices dependent on what subject is selected
    function yearChoiceLoad() {
    return Object.entries(data[certificate][subject]).map(([year]) => {
        if (data[certificate][subject].hasOwnProperty(year)) {
        return (
            <option key={year} value={year}>
            {year}
            </option>
        );
        } else {
        return null;
        }
    });
    }

    return (
    <div>
        <form className='flex flex-row gap-3'>
        <select name="certificate" value={certificate} onChange={handleChange}>
            <option value="lc">Leaving Certificate</option>
            <option value="jc">Junior Certificate</option>
        </select>

        <select name="subject" value={subject} onChange={handleChange}>
            {subjectChoiceLoad()}
        </select>

        <select name="year" value={year} onChange={handleChange}>
            {yearChoiceLoad()}
        </select>

        <select name="level" value={level} onChange={handleChange}>
            <option className='disabled:bg-red-400' value="Higher" disabled={higherDisabled}>Higher</option>
            <option className='disabled:bg-red-400' value="Ordinary" disabled={ordinaryDisabled}>Ordinary</option>
            <option className='disabled:bg-red-400' value="Foundation" disabled={foundationDisabled}>Foundation</option>
            <option className='disabled:bg-red-400' value="Common" disabled={commonDisabled}>Common</option>
        </select>

        <div className="inline-flex">
            <button onClick={() => setLanguage("EV")} type="button" className={`text-white border-2 py-2 px-4 rounded-l disabled:text-red-900 
            ${language === "EV" ? "bg-gray-900" : "bg-black"}
            ${irishDisabled ? "bg-gray-900" : "bg-black"}
            `}
            disabled={englishDisabled}>
            English
            </button>
            <button onClick={() => setLanguage("IV")} type="button" className={`text-white border-2 py-2 px-4 rounded-r disabled:text-red-900 
            ${language === "IV" ? "bg-gray-900" : "bg-black"}
            ${englishDisabled ? "bg-gray-900" : "bg-black"}
            `} 
            disabled={irishDisabled}>
            Irish
            </button>
        </div>
        </form>

        <ul id="exam-list" className="mt-5 text-white" ref={examListRef}>
        <li>Papers:</li>
        </ul>
    </div>
    );
    }

export default ChoicesForm;
