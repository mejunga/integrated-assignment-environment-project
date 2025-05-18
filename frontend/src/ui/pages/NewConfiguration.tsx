import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css-files/NewConfiguration.css';

type Props = {
  editConfig?: Config;
};

export default function NewConfiguration({ editConfig }: Props) {
  const [name, setName] = useState(editConfig?.name || '');
  const [interpreted, setInterpreted] = useState(editConfig?.interpreted || false);
  const [language, setLanguage] = useState(editConfig?.language || '');
  const [compileCommands, setcompileCommands] = useState(
    editConfig?.compile ? `${editConfig.compile.command} ${editConfig.compile.args.join(' ')}` : '');
  const [runCommands, setrunCommands] = useState(
    editConfig?.run ? `${editConfig.run.command} ${editConfig.run.args.join(' ')}` : '');
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!name.trim() || !language.trim() || !runCommands.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const newConfig: Config = {
      name: name.trim(),
      language: language.trim(),
      run: parseCommand(runCommands),
      interpreted,
    };

    if (!interpreted && compileCommands.trim() && compileCommands.trim() !== "''") {
      newConfig.compile = parseCommand(compileCommands);
    }

    if (editConfig) {
      const user = await new Promise<User>((resolve) => {
        const callback = (_: any, user: User) => {
          resolve(user);
          window.electron.removeSelectedUserListener(callback);
        };
        window.electron.getSelectedUser(callback);
        window.electron.requestSelectedUser();
      });

      const newConfigs = user.configs?.map(c => c.name === editConfig.name ? newConfig : c) ?? [];
      const updatedUser = { ...user, configs: newConfigs };

      window.electron.changeSelectedUser(updatedUser);
      window.electron.syncSelectedUserToUsers();
      window.electron.requestSelectedUser();
      navigate("/configurations");
    } else {
      const result = await window.electron.addConfig(newConfig);
      if (result.success) {
        window.electron.syncSelectedUserToUsers();
        window.electron.requestSelectedUser();
        navigate("/configurations");
      } else {
        alert(result.error);
        console.error(result.error);
      }
    }
  };

  function parseCommand(commandStr: string): { command: string; args: string[] } {
    const parts = commandStr.trim().split(/\s+/);
    return {
      command: parts[0],
      args: parts.slice(1),
    };
  }

  return (
    <div className="new-configuration">
      <h2>{editConfig ? "Edit Configuration" : "Create New Configuration"}</h2>
      <div className='config-form'>
        <div className="form-group">
          <label>Configuration Name:</label>
          <input
            type="text"
            spellCheck={false}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!!editConfig}
          />
        </div>
        <div className="form-group">
          <label>Language:</label>
          <input type="text" spellCheck={false} placeholder="e.g., JavaScript" value={language} onChange={(e) => setLanguage(e.target.value)} />
        </div>
        <div className="interpreted-group">
          <label className='is-interpreted'>Interpreted?</label>
          <div className="interpreted-options">
            <label>
              <input type="radio" checked={interpreted} onChange={() => setInterpreted(true)} />
              Yes
            </label>
            <label>
              <input type="radio" checked={!interpreted} onChange={() => setInterpreted(false)} />
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Compile Command:</label>
          <input type="text" spellCheck={false} placeholder="e.g., javac Main.java" value={compileCommands} onChange={(e) => setcompileCommands(e.target.value)} disabled={interpreted} />
        </div>
        <div className="form-group">
          <label>Run Command:</label>
          <input type="text" spellCheck={false} placeholder="e.g., java Main" value={runCommands} onChange={(e) => setrunCommands(e.target.value)} />
        </div>
      </div>
      <div className="buttons1">
        <button className="save-button1" onClick={handleSave}>Save</button>
        <button className="cancel-button1" onClick={() => navigate("/configurations")}>Cancel</button>
      </div>
    </div>
  );
}
