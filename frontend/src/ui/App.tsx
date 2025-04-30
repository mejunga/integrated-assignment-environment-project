import './assets/css-files/Base.css'
import userDefault from './assets/icons/user_default.svg';
import userManual from './assets/icons/user_manual.svg';
import folderIcon from './assets/icons/folder_icon.svg';
import importIcon from './assets/icons/import_icon.svg';
import addIcon from './assets/icons/add_icon.svg';
import { useEffect } from 'react';

export default function App() {

  useEffect(() => {
    const config = {
      language: "Java",
      compile: {
        command: "javac",
        args: ["*.java"]
      },
      run: {
        command: "java",
        args: ["Main", "1", "2", "3"]
      },
    };
    if (window?.electron?.sendConfig) {
      window.electron.sendConfig(config);
    } else {
      console.warn("window.electron.sendConfig is undefined");
    }
  }, []);

  return (
    <div className="base">
      <div className="tool-bar">
        <div className="profile">
          <img src={userDefault} alt=""/>
          <div className='profile-info'>
            <h3>  
              {}
            </h3>
            <h4>
              {}
            </h4>
          </div>
        </div>
        <div className="user-manual">
          <img src={userManual} alt=""/>
          <div className="hover-text">User Manual</div>
        </div>
      </div>
      <div>
        <div className='student-dirs'>
          {}
        </div>
        <div className="assignment-manager">
          <div className='crs-asgn'>
            <div className='courses'>
              <div className='add'>
                <h3>Courses</h3>
                <img src={addIcon} alt="" />
              </div>
              <ul className='course-list'>
                {}
              </ul>
            </div>
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
            <div className='configs-view'>
              Configurations
            </div>
            <div className='assignments-view'>
              Assignments
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}