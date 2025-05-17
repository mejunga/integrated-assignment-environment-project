import { Routes, Route } from 'react-router-dom';
import Base from './pages/Base';
import Configurations from './pages/Configurations';
import NewAssignment from './pages/NewAssignment';
import UserManual from './pages/base_inner/UserManual';
import AssignmentsDir from './pages/base_inner/AssignmentsDir';
import UserOptions from './pages/base_inner/UserProfile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Base />}>
        <Route index element={
          <div className='welcome-page'>
            <h2 className='welcome-title'>Welcome to Integrated Assignment Environment</h2>
            <p className='welcome-body'>
              This application helps you manage and evaluate programming assignments with ease.
            </p>
          </div>
        } />
        <Route path="UserOptions" element={<UserOptions />} />
        <Route path="AssignmentsDir/:title" element={<AssignmentsDir />} />
        <Route path="UserManual" element={<UserManual />} />
      </Route>
      <Route path="/configurations/*" element={<Configurations />} />
      <Route path="/new-assignment" element={<NewAssignment />} />
    </Routes>
  );
}
