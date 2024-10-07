"use client";

import React, { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
  const fetchUsers = async () => {
    const response = await fetch('/api');
    const data = await response.json();
    setUsers(data);
    };

    fetchUsers();
  }, []);

  // const fetchUsers = async () => {
  //   const response = await fetch("/api");
  //   const data = await response.json();
  //   setUsers(data);
  // };

  // Handle adding a user
  const handleAddUser = async () => {
    if (!name || !email) return;

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      const newUser = await response.json();
      setUsers((prev) => [...prev, newUser]);
      resetForm();
    }
  };

  // Handle updating a user
  const handleUpdateUser = async () => {
    if (!editingUser || !name || !email) return;

    const response = await fetch("/api", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((user) =>
          user.email === editingUser.email ? updatedUser : user
        )
      );
      resetForm();
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userEmail) => {
    const response = await fetch("/api", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }),
    });

    if (response.ok) {
      setUsers((prev) => prev.filter((user) => user.email !== userEmail));
    }
  };

  // Reset form inputs
  const resetForm = () => {
    setName("");
    setEmail("");
    setEditingUser(null);
  };

  // Handle edit button click
  const handleEditClick = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditingUser(user);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        User Management
      </h1>
      <form className="mb-6">
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Name of the User"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              editingUser ? handleUpdateUser() : handleAddUser();
            }}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {editingUser ? "Update User" : "Add User"}
          </button>

          {/* <button
            onClick={() => fetchUsers()}
            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Fetch Users
          </button> */}

          {editingUser && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-black p-3 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.email}
              className="hover:bg-gray-100 transition duration-200"
            >
              <td className="py-2 px-10 border-b text-gray-700">{user.name}</td>
              <td className="py-2 px-14 ml-5 border-b text-gray-600">
                {user.email}
              </td>
              <td className="py-2 px-4 border-b flex justify-center space-x-2 ">
                <button
                  onClick={() => handleEditClick(user)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition duration-200 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.email)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
