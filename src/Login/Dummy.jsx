import React, { useRef, useState, useEffect } from "react";
import Editor, { loader } from "@monaco-editor/react";
import axios from "axios";
import monokai from "monaco-themes/themes/Monokai.json"; // You can pick any
import PortalSelectField from "../Common/PortalSelectField";
import "./styles.css";

const languages = [
  { id: 62, name: "Java", monacoLang: "java" },
  { id: 71, name: "Python", monacoLang: "python" },
  { id: 63, name: "JavaScript", monacoLang: "javascript" },
  { id: 54, name: "C++", monacoLang: "cpp" },
];

export default function Dummy() {
  const codeRef = useRef("# Write your code here");
  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState(62);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const intervalRef = useRef();
  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(0);
  //   useEffect(() => {
  //     loader.init().then((monaco) => {
  //       monaco.editor.defineTheme("monokai", monokai);
  //       monaco.editor.setTheme("monokai");
  //       setIsThemeLoaded(true); // only render editor after theme is ready
  //     });
  //   }, []);

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [active]);

  const startTimer = () => {
    setActive(true);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const resetTimer = () => {
    setActive(false);
    setTimer(0);
    clearInterval(intervalRef.current);
  };

  const runCode = async () => {
    setOutput("Running...");
    try {
      const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language:
          languageId === 62
            ? "java"
            : languageId === 71
            ? "python"
            : languageId === 63
            ? "javascript"
            : languageId === 51
            ? "csharp"
            : "cpp",
        version:
          languageId === 62
            ? "15.0.2"
            : languageId === 71
            ? "3.10.0"
            : languageId === 63
            ? "18.15.0"
            : languageId === 51
            ? "10.0.1"
            : "10.2.0",
        files: [
          {
            name: `main.javascript`, // file extension
            content: code,
          },
        ],
        stdin: input,
      });

      const result = res.data;
      setOutput(result.run.output || "No output");
    } catch (error) {
      setOutput("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <p>{formatTime(timer)}</p>
      <button onClick={startTimer}>start</button>
      <button onClick={stopTimer}>end</button>
      <button onClick={resetTimer}>reset</button>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <PortalSelectField
          options={languages}
          value={languageId}
          onChange={(value) => setLanguageId(value)}
          style={{ width: "12%" }}
          hideError={true}
        />
      </div>
      {/* {isThemeLoaded ? ( */}
      <div
        style={{
          border: "1px solid #00000038",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <Editor
          height="400px"
          language={
            languageId === 62
              ? "java"
              : languageId === 71
              ? "python"
              : languageId === 63
              ? "javascript"
              : languageId === 51
              ? "csharp"
              : "cpp"
          }
          value={code}
          // defaultValue={codeRef.current}
          theme="vs-light"
          onChange={(val) => setCode(val || "")}
          options={{
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            parameterHints: { enabled: false },
            wordBasedSuggestions: false,
            tabCompletion: "off",
            suggest: { snippetsPreventQuickSuggestions: false },
          }}
        />
      </div>
      {/* ) : (
        ""
      )} */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={runCode} className="onlinetest_runcodebutton">
          Compile And Test
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 style={{ fontWeight: 600 }}>Output:</h3>
        <pre className="onlinetest_codeoutputContainer">{output}</pre>
      </div>
    </div>
  );
}
