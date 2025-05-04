import { Routes, Route } from 'react-router-dom';
import Base from './pages/Base';
import Configurations from './pages/Configurations';
import NewAssignment from './pages/NewAssignment';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Base />} />
      <Route path="/configurations/*" element={<Configurations />} />
      <Route path="/new-assignment" element={<NewAssignment />} />
    </Routes>
  );
}