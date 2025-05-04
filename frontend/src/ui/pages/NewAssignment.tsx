import '../assets/css-files/NewAssignment.css';
import { useEffect, useState } from 'react';

export default function NewAssignment() {
  
  const [title, setTitle] = useState('');
  const [configs, setConfigs] = useState<Config[]>([]);
  const [selectedConfigName, setSelectedConfigName] = useState('');
  const [compareOptions, setCompareOptions] = useState<string[]>([]);

  const handleCompareOptionChange = (option: string) => {
    setCompareOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleCreate = async () => {
    if (!title || !selectedConfigName) {
      alert("Please fill in title and select a configuration.");
      return;
    }
  
    const selectedConfig = configs.find(c => c.name === selectedConfigName);
    if (!selectedConfig) {
      alert("Selected configuration not found.");
      return;
    }
  
    const newAssignment: Assignment = {
      title,
      config: selectedConfig,
      compareOptions
    };
  
    const result = await window.electron.addAssignment(newAssignment);
    if (result.success) {
      window.electron.closeCurrentWindow();
    } else {
      alert("Failed to add assignment: " + result.error);
    }
  };

  useEffect(() => {
    const handleUser = (_: any, user: User) => {
      setConfigs(user.configs || []);
    };
  
    window.electron.getSelectedUser(handleUser);
    window.electron.requestSelectedUser();
  
    return () => window.electron.removeSelectedUserListener(handleUser);
  }, []);

  return (
    <div className="new-assignment-page">
      <h2>Create New Assignment</h2>
      <form className="assignment-form">
        <label>Assignment Title</label>
        <input type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <label>Configuration</label>
          <div className='config-selection'>
          <select
            value={selectedConfigName}
            onChange={(e) => setSelectedConfigName(e.target.value)}
          >
            <option value="">Select configuration</option>
            {configs.map((config) => (
              <option key={config.name} value={config.name}>
                {config.name}
              </option>
            ))}
          </select>
            <button className='new' onClick={() => window.electron.openConfigurationsWindowWithSource("fromAssignment")}>New</button>
          </div>
        <label>Compare Options</label>
        <div className="compare-options-grid">
          <label>
            <input
              type="checkbox"
              checked={compareOptions.includes('Case Sensitive')}
              onChange={() => handleCompareOptionChange('Case Sensitive')}
            />
            Case Sensitive
          </label>
          <label>
            <input
              type="checkbox"
              checked={compareOptions.includes('Sequential Output')}
              onChange={() => handleCompareOptionChange('Sequential Output')}
            />
            Sequential Output
          </label>
          <label>
            <input
              type="checkbox"
              checked={compareOptions.includes('Ignore Whitespace')}
              onChange={() => handleCompareOptionChange('Ignore Whitespace')}
            />
            Ignore Whitespace
          </label>
          <label>
            <input
              type="checkbox"
              checked={compareOptions.includes('Trim Lines')}
              onChange={() => handleCompareOptionChange('Trim Lines')}
            />
            Trim Lines
          </label>
        </div>
      </form>
      <div className='buttons'>
        <button className='create' onClick={handleCreate}>Create Assignment</button>
        <button className='cancel' onClick={() => window.electron.closeCurrentWindow()}>Cancel</button>
      </div>
    </div>
  );
}