import '../assets/Configurations.css';

export default function Configurations() {
  return (
    <div className="configurations-page">
      <h2>Manage Configurations</h2>

      <div className="config-list">
        {}
        <div className="config-item">
          <span>C Programming</span>
          <div className="config-actions">
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </div>

        <div className="config-item">
          <span>Python Script</span>
          <div className="config-actions">
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </div>

        {}
      </div>

      <button className="add-config-btn">Add New Configuration</button>
    </div>
  );
}
