import React from "react";

export default function RoleSwitcher({ role, setRole }) {
  return (
    <div className="role-switcher">
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="role-dropdown"
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}