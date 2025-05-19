export default function() {
    return(
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Manual - Integrated Assignment Environment</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          The Integrated Assignment Environment (IAE) is a comprehensive desktop application designed for educators
          to efficiently manage, process, and evaluate programming assignments. It supports multiple languages and
          provides automated compilation, execution, and output comparison capabilities.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Key Features</h2>
        <ul className="list-disc list-inside">
          <li>Multi-language Support: Python, C, and Java</li>
          <li>Automated Processing: Compilation, execution, and output verification</li>
          <li>Batch Processing: Handle multiple student submissions simultaneously</li>
          <li>Project Management: Save and load assignment configurations</li>
          <li>Detailed Reporting: Comprehensive results and analysis</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
        <p>Start the application from your system's application menu.</p>
        <ul className="list-disc list-inside mt-2">
          <li>Welcome message: "Welcome to Integrated Assignment Environment"</li>
          <li>User profile section (top-left)</li>
          <li>Assignment list panel (right side)</li>
          <li>Configuration and New Assignment buttons (bottom-right)</li>
          <li>Built-in server starts automatically on port 8080</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Creating Assignment Projects</h2>
        <h3 className="font-semibold">Step 1: Create Language Configuration</h3>
        <ul className="list-disc list-inside mb-2">
          <li>Open Configurations Manager</li>
          <li>Click "New Configuration"</li>
          <li>Fill in: Name, Language, Interpreted, Commands</li>
        </ul>
        <p><strong>Examples:</strong></p>
        <ul className="list-disc list-inside mb-2">
          <li>Python → Interpreted: Yes, Run: <code>python main.py</code></li>
          <li>Java → Interpreted: No, Compile: <code>javac Main.java</code>, Run: <code>java Main</code></li>
        </ul>
        <h3 className="font-semibold">Step 2: Create New Assignment</h3>
        <ul className="list-disc list-inside">
          <li>Click "New Assignment"</li>
          <li>Fill in title, config, I/O files</li>
          <li>Select comparison options (case, whitespace, etc.)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Managing Submissions</h2>
        <ol className="list-decimal list-inside">
          <li>Prepare student ZIP files (named by student ID)</li>
          <li>Select an assignment</li>
          <li>Import via folder icon and choose ZIP folder</li>
          <li>View confirmation messages and submission statuses</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Processing and Evaluation</h2>
        <p>Click "Process" to begin. System performs:</p>
        <ul className="list-disc list-inside">
          <li>File Discovery</li>
          <li>Compilation (if needed)</li>
          <li>Execution</li>
          <li>Output Comparison</li>
        </ul>
        <p>Status: Pending → Compiling → Running → Comparing → Complete/Error</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Reports and Results</h2>
        <p>After processing, view results with:</p>
        <ul className="list-disc list-inside">
          <li>Student ID, Compilation, Execution, Output Match, Score, Errors</li>
          <li>Export as CSV, PDF, JSON, or individual logs</li>
          <li>Scoring: 3/3 (success), 2/3 (minor issue), 1/3 (error), 0/3 (fail)</li>
        </ul>
      </section>
    </div>
    );
}