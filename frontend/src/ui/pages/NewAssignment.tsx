import '../assets/NewAssignment.css';

export default function NewAssignment() {
  return (
    <div className="new-assignment-page">
      <h2>Create New Assignment</h2>
      <form className="assignment-form">
        <label>Assignment Title</label>
        <input type="text" placeholder="Enter title" />

        <label>Configuration</label>
        <select>
          <option>Select configuration</option>
          <option>New configuration</option>

          {}
        </select>

        <label>Command Line Arguments</label>
        <textarea placeholder="Enter arguments separated by space"></textarea>

        <label>Expected Output</label>
        <textarea placeholder="Enter expected output"></textarea>

        <button type="submit">Create Assignment</button>
      </form>
    </div>
  );
}