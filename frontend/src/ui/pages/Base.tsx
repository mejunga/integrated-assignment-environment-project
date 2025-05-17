import '../assets/css-files/Base.css';
import userManualIcon from '../assets/icons/user_manual.svg';
import importIcon from '../assets/icons/import_icon.svg';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DefaultUserIcon from '../assets/icons/user_default.svg';

export default function Base() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<String | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    const handleUser = (_: any, user: User) => {
      setSelectedUser(user);
    };

    window.electron.requestSelectedUser();
    window.electron.getSelectedUser(handleUser);

    const refreshHandler = () => {
      window.electron.requestSelectedUser();
    };

    window.electron.onAssignmentListRefresh(refreshHandler);

    return () => {
      window.electron.removeSelectedUserListener(handleUser);
      window.electron.removeAssignmentListRefreshListener(refreshHandler);
    };
  }, []);

  const handleImportClick = async () => {
    try {
      if (!selectedAssignment) {
        alert('Please select an assignment before importing.');
        return;
      }

      const result = await window.electron.importZipFiles(selectedAssignment as string);
      if (result?.success) {
        alert('ZIP file imported and sent to server successfully!');
      } else {
        alert('Import failed or server rejected the data.');
      }
    } catch (err) {
      alert('Import failed. Make sure an assignment is selected.');
    }
  };

  const handleAssignmentClick = (assignmentTitle: string) => {
    window.electron.setSelectedAssignment(assignmentTitle);
    navigate(`/AssignmentsDir/${assignmentTitle}`);
  };

  return (
    <div className="base">
      <div className="tool-bar">
        <div className="profile">
          <img src={selectedUser?.iconDir || DefaultUserIcon} alt="" />
          <div className="profile-info">
            <h3>{selectedUser?.name}</h3>
            <h4>{selectedUser?.id}</h4>
          </div>
        </div>
        <div className="user-manual">
          <img src={userManualIcon} alt=""/>
          <div className="hover-text">User Manual</div>
        </div>
      </div>
      <div>
        <div className='main-page'>
          <Outlet />
        </div>
        <div className="assignment-manager">
          <div className='crs-asgn'>
            <div className='assignments'>
              <div className='import'>            
                <h3>Assignments</h3>
                <img src={importIcon} alt="" onClick={handleImportClick}/>
              </div>
              <ul className='assignment-list'>
                {selectedUser?.assignments?.map((asgn, index) => (
                  <li
                    key={index}
                    className={`assignment-item ${selectedAssignment === asgn.title ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAssignment(asgn.title);
                      handleAssignmentClick(asgn.title);
                    }}>
                    {asgn.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='options'>
            <div className='configs-view' onClick={() => window.electron.openConfigurationsWindow()}>
              Configurations
            </div>
            <div className='assignments-view' onClick={() => window.electron.openNewAssignmentWindow()}>
              New Assignment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
