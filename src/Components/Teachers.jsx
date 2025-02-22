// src/components/Teachers.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const teachersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    const dobDate = new Date(dob);
    const ageCalc = new Date().getFullYear() - dobDate.getFullYear();

    const teacherData = {
      name,
      email,
      fatherName,
      address,
      age: ageCalc,
      dob,
      phoneNumber1,
      phoneNumber2,
    };

    try {
      await addDoc(collection(db, "teachers"), teacherData);
      setTeachers([...teachers, teacherData]);
      resetForm();
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setEmail(teacher.email);
    setFatherName(teacher.fatherName);
    setAddress(teacher.address);
    setDob(teacher.dob);
    setPhoneNumber1(teacher.phoneNumber1);
    setPhoneNumber2(teacher.phoneNumber2);
    setShowForm(true);
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    const dobDate = new Date(dob);
    const ageCalc = new Date().getFullYear() - dobDate.getFullYear();

    const updatedTeacherData = {
      name,
      email,
      fatherName,
      address,
      age: ageCalc,
      dob,
      phoneNumber1,
      phoneNumber2,
    };

    try {
      await updateDoc(
        doc(db, "teachers", editingTeacher.id),
        updatedTeacherData
      );
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === editingTeacher.id
            ? { ...teacher, ...updatedTeacherData }
            : teacher
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await deleteDoc(doc(db, "teachers", id));
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTeacher(null);
    setName("");
    setEmail("");
    setFatherName("");
    setAddress("");
    setDob("");
    setPhoneNumber1("");
    setPhoneNumber2("");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Teachers</h2>
      <button
        className="mb-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={() => {
          setShowForm(true);
          setEditingTeacher(null);
        }}
      >
        + Add Teacher
      </button>
      {showForm && (
        <form
          onSubmit={editingTeacher ? handleUpdateTeacher : handleAddTeacher}
          className="mb-6 p-6 bg-white border rounded-lg shadow-md"
        >
          <h3 className="text-2xl font-bold mb-4">
            {editingTeacher ? "Edit Teacher" : "Add Teacher"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Father's Name</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number 1</label>
              <input
                type="text"
                value={phoneNumber1}
                onChange={(e) => setPhoneNumber1(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number 2</label>
              <input
                type="text"
                value={phoneNumber2}
                onChange={(e) => setPhoneNumber2(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            {editingTeacher ? "Update Teacher" : "Add Teacher"}
          </button>
        </form>
      )}
      {teachers.length === 0 ? (
        <p className="text-gray-600">No teachers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Age</th>
                <th className="py-3 px-4 text-left">Date of Birth</th>
                <th className="py-3 px-4 text-left">Phone Number 1</th>
                <th className="py-3 px-4 text-left">Phone Number 2</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{teacher.id}</td>
                  <td className="py-3 px-4">{teacher.name}</td>
                  <td className="py-3 px-4">{teacher.email}</td>
                  <td className="py-3 px-4">{teacher.age}</td>
                  <td className="py-3 px-4">{teacher.dob}</td>
                  <td className="py-3 px-4">{teacher.phoneNumber1}</td>
                  <td className="py-3 px-4">{teacher.phoneNumber2}</td>
                  <td className="py-3 px-4">
                    <button
                      className="mr-2 px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                      onClick={() => handleEditTeacher(teacher)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Teachers;
