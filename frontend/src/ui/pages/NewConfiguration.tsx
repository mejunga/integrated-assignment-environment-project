import React, { useState } from 'react';
import '../assets/NewConfiguration.css';

export default function NewConfiguration() {
  const [compilerPath, setCompilerPath] = useState('');
  const [compileParams, setCompileParams] = useState('');
  const [runParams, setRunParams] = useState('');
  const [inputFile, setInputFile] = useState('');
  const [expectedOutputFile, setExpectedOutputFile] = useState('');

  const handleSave = () => {
    const configuration = {
      compilerPath,
      compileParams,
      runParams,
      inputFile,
      expectedOutputFile,
    };
    console.log('Configuration Saved:', configuration);
  };

  const handleCancel = () => {
    setCompilerPath('');
    setCompileParams('');
    setRunParams('');
    setInputFile('');
    setExpectedOutputFile('');
  };

  return (
    <div className="configuration-form">
      <h2>Create New Configuration</h2>
      <div className="form-group">
        <label>Compiler Path:</label>
        <input
          type="text"
          value={compilerPath}
          onChange={(e) => setCompilerPath(e.target.value)}
          placeholder="/usr/bin/gcc"
        />
      </div>
      <div className="form-group">
        <label>Compile Parameters:</label>
        <input
          type="text"
          value={compileParams}
          onChange={(e) => setCompileParams(e.target.value)}
          placeholder="-o main"
        />
      </div>
      <div className="form-group">
        <label>Run Parameters:</label>
        <input
          type="text"
          value={runParams}
          onChange={(e) => setRunParams(e.target.value)}
          placeholder="input1 input2"
        />
      </div>
      <div className="form-group">
        <label>Input File (Optional):</label>
        <input
          type="text"
          value={inputFile}
          onChange={(e) => setInputFile(e.target.value)}
          placeholder="input.txt"
        />
      </div>
      <div className="form-group">
        <label>Expected Output File (Optional):</label>
        <input
          type="text"
          value={expectedOutputFile}
          onChange={(e) => setExpectedOutputFile(e.target.value)}
          placeholder="expected_output.txt"
        />
      </div>
      <div className="button-group">
        <button onClick={handleSave} className="save-button">Save</button>
        <button onClick={handleCancel} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
}
