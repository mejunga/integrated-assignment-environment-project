import '../assets/css-files/Base.css'
import userManualIcon from '../assets/icons/user_manual.svg';
import importIcon from '../assets/icons/import_icon.svg';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserManual from './base_inner/UserManual'
import AssignmentDir from './base_inner/AssignmentDir';
import UserOptions from './base_inner/UserProfile';
import DefaultUserIcon from '../assets/icons/user_default.svg';
import '../assets/css-files/Base.css';

export default function Base() {

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const handleUser = (_event: any, user: User) => {
      setSelectedUser(user);
    };
  
    window.electron.getSelectedUser(handleUser);
    window.electron.requestSelectedUser();
  
    return () => {
      window.electron.removeSelectedUserListener(handleUser);
    };
  }, []);

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
          <Routes>
            <Route path='/' element={
                <div className='welcome-page'>
                <h2 className='welcome-title'>Welcome to Integrated Assignment Environment</h2>
                <p className='welcome-body'>
                  This application helps you manage and evaluate programming assignments with ease.
                </p>
              </div>
            }/>
            <Route path='/UserOptions' element={<UserOptions/>}/>
            <Route path='/AssignmentDir' element={<AssignmentDir/>}/>
            <Route path='/UserManual' element={<UserManual/>}/>
          </Routes>
        </div>
        <div className="assignment-manager">
          <div className='crs-asgn'>
            <div className='assignments'>
              <div className='import'>            
                <h3>Assignments</h3>
                <img src={importIcon} alt="" />
              </div>
              <ul className='assignment-list'>
                {}
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
  )
}