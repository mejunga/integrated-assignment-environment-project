import '../assets/css-files/Base.css';
import userManualIcon from '../assets/icons/user_manual.svg';
import importIcon from '../assets/icons/import_icon.svg';
import exportIcon from '../assets/icons/export_icon.svg';
import DefaultUserIcon from '../assets/icons/user_default.svg';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Base() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    assignmentTitle: string | null;
  }>({ visible: false, x: 0, y: 0, assignmentTitle: null });

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

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [contextMenu.visible]);

  const handleImportClick = async () => {
    try {
      if (!selectedAssignment) {
        alert('Please select an assignment before importing.');
        return;
      }

      const result = await window.electron.importZipFiles(selectedAssignment);
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

  const handleImportConfigs = async () => {
  const result = await window.electron.importConfigsFromJson();
  if (result.success) {
    alert('Configurations imported successfully.');
    window.electron.requestSelectedUser();
  } else {
    alert(`Failed to import configurations: ${result.error || 'Unknown error'}`);
  }
};

const handleExportConfigs = async () => {
  const result = await window.electron.exportConfigsToJson();
  if (result.success) {
    alert('Configurations exported successfully.');
  } else {
    alert('Failed to export configurations.');
  }
};

  const handleDeleteAssignment = (title: string) => {
  const confirmed = confirm(`Are you sure you want to delete "${title}"?`);
  if (confirmed) {
    window.electron.deleteAssignment(title)
      .then((success) => {
        if (success) {
          alert(`Assignment "${title}" deleted successfully.`);
          window.electron.requestSelectedUser(); 
        } else {
          alert('Failed to delete assignment.');
        }
      })
      .catch((err) => {
        alert(`Error while deleting assignment: ${err}`);
      });
  }
};

const handleOpenUserManual = async () => {
  navigate('/UserManual');
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
        <div className='container1'>
          <div className='container2'>
            <div className='import-json' onClick={() => handleImportConfigs()}>
              <img src={importIcon} alt="" />
              <h4>Import Configurations</h4>
            </div>
            <div className='export-json' onClick={() => handleExportConfigs()}>
              <img src={exportIcon} alt="" />
              <h4>Export configurations</h4>
            </div>
          </div>
          <div className="user-manual" onClick={() => handleOpenUserManual()}>
            <img src={userManualIcon} alt=""/>
            <div className="hover-text">User Manual</div>
          </div>
        </div>
      </div>
      <div>
        <div className='main-page'>
          <Outlet/>
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
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        assignmentTitle: asgn.title
                      });
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
      {contextMenu.visible && (
        <ul
          className="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            position: 'fixed',
            zIndex: 9999,
            listStyle: 'none',
            padding: 0,
            margin: 0,
            width: '100px'
          }}>
          <li
            onClick={() => {
              if (contextMenu.assignmentTitle) {
                handleDeleteAssignment(contextMenu.assignmentTitle);
              }
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}>
            Delete
          </li>
        </ul>
      )}
    </div>
  );
}
