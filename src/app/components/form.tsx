'use client'
import { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';

// INITIALISATION
var data = require('../files/data.json');
var subNumsToNames = data["subNumsToNames"]

const url:string = "https://www.examinations.ie/archive/"

let examListEl = document.getElementById("exam-list");

  // Handles form inputs and displays the exam papers
function ChoicesForm() {
    const [certificate, setCertificate] = useState<string>('lc');
    const [subject, setSubject] = useState<string>('2');
    const [year, setYear] = useState<string>('2019');
    const [language, setLanguage] = useState<string>('EV');
    const [level, setLevel] = useState<string>('Higher');

    const examListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        examListEl = examListRef.current;
    }, []);

    // Adds the exam link to the list of exam papers (TEMPORARY (hopefuly...))
    function addExamToList(examName: string, examUrl: string, category: string, year: string) {
        let examEl = document.createElement("li");
        examEl.innerHTML = `<a target="_blank" href="${url}/${category}/${year}/${examUrl}">${category}: ${examName}</a>`;
        examListEl?.appendChild(examEl);
    }

    // Returns a list of exam papers for a given subject, year, language, and level.
    function grabExamUrls(cert:string, subjectId:string, year:string, language:string, level:string) {
        if(examListEl?.innerHTML) {
            examListEl.innerHTML = "<li>Papers:</li>";
        }
        let documentList = data[cert][subjectId][year]; // Navigates to the specific subject and year.
        let categories = Object.keys(documentList); // exampapers, marking schemes, etc.

        for (const cat of categories) {
            for (const doc of documentList[cat]) {
                let docName = doc["details"];
                let docUrl = doc["url"];

                if ((docName.includes(language) || docName.includes("BV") || docName.includes("File")) && (docName.includes(level) || docName.includes("Common") || docName.includes("File"))) { // Using "File" here is a janky workaround, that might break with some other files.
                    addExamToList(docName, docUrl, cat, year);
                }
            }
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
                subjectChoiceLoad(); // Call subjectChoiceLoad to update the subject options
                yearChoiceLoad();
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
  
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      grabExamUrls(certificate, subject, year, language, level);
    };

    // Loads the subject choices from the data file dependant on what subject is selected
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
    
    // Loads the year choices dependant on what subject is selected
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
        <form onSubmit={handleSubmit}>
            <select name="certificate" value={certificate} onChange={handleChange}>
                <option value="lc">Leaving Certificate</option>
                <option value="jc">Junior Certificate</option>
                <option value="lb">???</option>
            </select>
        </form>

        <form onSubmit={handleSubmit}>
          <select name="subject" value={subject} onChange={handleChange}>
            {subjectChoiceLoad()}
          </select>
  
          <select name="year" value={year} onChange={handleChange}>
            {yearChoiceLoad()}
          </select>
  
          <select name="language" value={language} onChange={handleChange}>
            <option value="EV">English</option>
            <option value="IV">Irish</option>
          </select>
  
          <select name="level" value={level} onChange={handleChange}>
            <option value="Higher">Higher</option>
            <option value="Ordinary">Ordinary</option>
            <option value="Foundation">Foundation</option>
            <option value="Common">Common</option>
          </select>
  
          <input type="submit" />
        </form>
  
        <ul id="exam-list" className="mt-5 text-white" ref={examListRef}>
            <li>Papers:</li>
        </ul>
      </div>
    );
  }

export default ChoicesForm;