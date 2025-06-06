import { useEffect, useState } from 'react';
import FolderIcon from '../../assets/icons/folder_icon.svg';
import { useNavigate } from 'react-router-dom';

export default function AssignmentsDir() {
  const [zipFiles, setZipFiles] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    zipName: string | null;
  }>({ visible: false, x: 0, y: 0, zipName: null });
  const navigate = useNavigate();

  const onZipClick = async (zipName: string) => {
    await window.electron.openZipFolder(zipName);
  };

  const handleDelete = (zipName: string) => {
    const confirmed = confirm(`Are you sure you want to delete "${zipName}"?`);
    if (confirmed) {
      window.electron.deleteZipFile(zipName);
    }
  };

  useEffect(() => {
    const fetchZipFiles = () => {
      window.electron.requestZipFileNames();
    };
    const zipFilesListener = (_event: any, files: string[]) => {
      setZipFiles(files);
    };
    window.electron.getZipFileNames(zipFilesListener);

    fetchZipFiles();
    const assignmentChangeHandler = () => {
      window.electron.requestZipFileNames();
    };

    window.electron.getSelectedAssignment(assignmentChangeHandler);
    return () => {
      window.electron.removeZipFileNameListener(zipFilesListener);
      window.electron.removeSelectedAssignmentListener(assignmentChangeHandler);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    const closeMenu = () => {
      if (contextMenu.visible) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };
    window.addEventListener('click', closeMenu);
    return () => {
      window.removeEventListener('click', closeMenu);
    };
  }, [contextMenu.visible]);

  const handleExport = async () => {
    const res = await window.electron.exportResults();
    alert(res.success ? 'Export successful!' : `Export failed: ${res.error || 'Unknown error'}`);
  };

  return (
    <div className='students-base'>
      <div className="student-flow">
        {zipFiles.map((zipName, index) => (
          <div
            key={index}
            className="zip-card"
            onClick={() => onZipClick(zipName)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({
                visible: true,
                x: e.clientX,
                y: e.clientY,
                zipName
              });
            }}
          >
            <img src={FolderIcon} alt="Folder" />
            <h4>{zipName}</h4>
          </div>
        ))}
      </div>
      <div className='export-results'>
        <button className='export' onClick={() => handleExport()}>Export Results</button>
      </div>

      {contextMenu.visible && contextMenu.zipName && (
        <ul
          className="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            position: 'fixed',
            backgroundColor: 'white',
            zIndex: 9999,
            listStyle: 'none',
            padding: 0,
            margin: 0,
            width: '100px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            borderRadius: '10px'
          }}
        >
          <li
            style={{ padding: '8px', cursor: 'pointer' }}
            onClick={() => {
              handleDelete(contextMenu.zipName!);
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
          >
            Discard
          </li>
        </ul>
      )}
    </div>
  );
}
