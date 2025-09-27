import React, { useState, useEffect } from "react";

function App() {
  const [command, setCommand] = useState("");
  const [sites, setSites] = useState([]);
  const [output, setOutput] = useState("");
  const [newSite, setNewSite] = useState({ subdomain: "", folder: "", files: [], mainFile: "" });

  // Fetch sites list
  const fetchSites = () => {
    fetch("http://localhost:5000/sites")
      .then((res) => res.json())
      .then((data) => { if (data.success) setSites(data.sites); })
      .catch((err) => console.error(err));
  };

  useEffect(() => { fetchSites(); }, []);

  const runCommand = async () => {
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      setOutput(data.output || data.error);
    } catch (err) { setOutput(`Error: ${err.message}`); }
    setCommand("");
  };

  const handleApache = async (action) => {
    try {
      const res = await fetch("http://localhost:5000/apache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setOutput(data.output || data.error);
    } catch (err) { setOutput(`Error: ${err.message}`); }
  };

  const handleAction = (site, action) => {
    fetch("http://localhost:5000/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: site.name, action }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOutput(`${site.name} → ${action.toUpperCase()}`);
          fetchSites(); // refresh site list
        } else setOutput(`Error: ${data.error}`);
      });
  };

  const handleNewSiteChange = (e) => {
    const { name, value } = e.target;
    setNewSite((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewSite((prev) => ({ ...prev, files: Array.from(e.target.files) }));
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (!newSite.mainFile) {
      setOutput("Please select the main file to host");
      return;
    }

    const formData = new FormData();
    formData.append("subdomain", newSite.subdomain);
    formData.append("folder", newSite.folder);
    formData.append("mainFile", newSite.mainFile); // selected main file
    newSite.files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("http://localhost:5000/site/add", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setOutput(`Site ${newSite.subdomain} deployed: ${data.output}`);
        setNewSite({ subdomain: "", folder: "", files: [], mainFile: "" });
        fetchSites();
      } else setOutput(`Error: ${data.error}`);
    } catch (err) { setOutput(`Error: ${err.message}`); }
  };

  // ----- Simple styling -----
  const buttonStyle = { padding: "8px 15px", marginRight: "5px", border: "none", borderRadius: "5px", cursor: "pointer" };
  const greenButton = { ...buttonStyle, background: "#4CAF50", color: "#fff" };
  const redButton = { ...buttonStyle, background: "#f44336", color: "#fff" };
  const yellowButton = { ...buttonStyle, background: "#ff9800", color: "#fff" };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>⚡ Hosting Manager Dashboard</h1>

      {/* Command Runner */}
      <section style={{ marginBottom: "20px" }}>
        <h2>💻 Run Command</h2>
        <input value={command} onChange={(e) => setCommand(e.target.value)} placeholder="Enter command" />
        <button onClick={runCommand} style={greenButton}>Run</button>
        <p><b>Output:</b> {output}</p>
      </section>

      {/* Apache Controls */}
      <section style={{ marginBottom: "20px" }}>
        <h2>🌐 Apache Controls</h2>
        <button onClick={() => handleApache("start")} style={greenButton}>Start</button>
        <button onClick={() => handleApache("stop")} style={redButton}>Stop</button>
        <button onClick={() => handleApache("restart")} style={yellowButton}>Restart</button>
      </section>

      {/* Add New Site */}
      <section style={{ marginBottom: "20px" }}>
        <h2>➕ Add New Site</h2>
        <form onSubmit={handleDeploy}>
          <input name="subdomain" value={newSite.subdomain} onChange={handleNewSiteChange} placeholder="Subdomain" required />
          <input name="folder" value={newSite.folder} onChange={handleNewSiteChange} placeholder="Folder Name" required />
          <input type="file" multiple onChange={handleFileChange} required />

          {/* Dropdown to select main file */}
          {newSite.files.length > 0 && (
            <div style={{ margin: "10px 0" }}>
              <label>Select Main File to Host:</label>
              <select
                name="mainFile"
                value={newSite.mainFile || ""}
                onChange={(e) => setNewSite((prev) => ({ ...prev, mainFile: e.target.value }))}
                required
              >
                <option value="">--Select File--</option>
                {newSite.files.map((file, idx) => (
                  <option key={idx} value={file.name || file.originalname}>
                    {file.name || file.originalname}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" style={greenButton}>Deploy</button>
        </form>
      </section>

      {/* Website Manager */}
      <section>
        <h2>📂 Website Manager</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Site Name</th><th>Domain</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site, idx) => (
              <tr key={idx}>
                <td>{site.name}</td>
                <td>{site.domain}</td>
                <td>
                  {site.status === "enabled" ? "🟢 Enabled" : site.status === "disabled" ? "🔴 Disabled" : "🟡 Maintenance"}
                </td>
                <td>
                  <button onClick={() => handleAction(site, "enable")} style={greenButton}>Enable</button>
                  <button onClick={() => handleAction(site, "disable")} style={redButton}>Disable</button>
                  <button onClick={() => handleAction(site, "maintenance")} style={yellowButton}>Maintenance</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
