import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NewConfiguration from './NewConfiguration';
import '../assets/css-files/Configurations.css';

export default function Configurations() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editTarget, setEditTarget] = useState<Config | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleUser = (_: any, user: User) => {
      setSelectedUser(user);
      setConfigs(user.configs ?? []);
    };

    window.electron.getSelectedUser(handleUser);
    window.electron.requestSelectedUser();

    return () => {
      window.electron.removeSelectedUserListener(handleUser);
    };
  }, []);

  const deleteConfig = (index: number) => {
    if (!selectedUser) return;
    const newConfigs = [...configs];
    newConfigs.splice(index, 1);
    const updatedUser = { ...selectedUser, configs: newConfigs };
    setConfigs(newConfigs);
    setSelectedUser(updatedUser);
    window.electron.changeSelectedUser(updatedUser);
    window.electron.syncSelectedUserToUsers();
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="configurations-page">
            <h2>Configurations Manager</h2>
            <div className="config-list">
              {configs.map((config, index) => (
                <div className="config-item" key={index}>
                  <span>{config.name}</span>
                  <div className="actions">
                  <button onClick={() => {setEditTarget(config); navigate("edit-config");}}>Edit</button>
                    <button onClick={() => deleteConfig(index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="buttons">
              <button className="add-config-button" onClick={() => navigate("new-config")}>
                New Configuration
              </button>
              <button className="cancel-button" onClick={() => window.electron.closeCurrentWindow()}>
                Cancel
              </button>
            </div>
          </div>
        }
      />
      <Route path="new-config" element={<NewConfiguration />} />
      <Route path="edit-config" element={<NewConfiguration editConfig={editTarget!} />} />
    </Routes>
  );
}

