// src/components/Students.jsx
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

const Students = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [dateOfRegistration, setDateOfRegistration] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [section, setSection] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const dobDate = new Date(dob);
    const ageCalc = new Date().getFullYear() - dobDate.getFullYear();

    const studentData = {
      name,
      email,
      motherName,
      fatherName,
      address,
      age: ageCalc,
      dob,
      dateOfRegistration,
      class: studentClass,
      rollNumber,
      section,
      customId: generateUniqueId(name, fatherName, motherName, dob), // Store custom ID separately
    };

    try {
      const docRef = await addDoc(collection(db, "students"), studentData);
      setStudents([...students, { ...studentData, id: docRef.id }]);
      resetForm();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setMotherName(student.motherName);
    setFatherName(student.fatherName);
    setAddress(student.address);
    setDob(student.dob);
    setDateOfRegistration(student.dateOfRegistration);
    setStudentClass(student.class);
    setRollNumber(student.rollNumber);
    setSection(student.section);
    setShowForm(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    const dobDate = new Date(dob);
    const ageCalc = new Date().getFullYear() - dobDate.getFullYear();

    const updatedStudentData = {
      name,
      email,
      motherName,
      fatherName,
      address,
      age: ageCalc,
      dob,
      dateOfRegistration,
      class: studentClass,
      rollNumber,
      section,
      customId: generateUniqueId(name, fatherName, motherName, dob), // Update custom ID
    };

    try {
      await updateDoc(
        doc(db, "students", editingStudent.id),
        updatedStudentData
      );
      setStudents(
        students.map((student) =>
          student.id === editingStudent.id
            ? { ...student, ...updatedStudentData }
            : student
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, "students", id));
      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setName("");
    setEmail("");
    setMotherName("");
    setFatherName("");
    setAddress("");
    setDob("");
    setDateOfRegistration("");
    setStudentClass("");
    setRollNumber("");
    setSection("");
  };

  const generateUniqueId = (name, fatherName, motherName, dob) => {
    const nameInitials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 3)
      .toUpperCase();
    const fatherInitials = fatherName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    const motherInitials = motherName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    const dobPart = dob.split("-").join("");
    return `${nameInitials}${fatherInitials}${motherInitials}${dobPart}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Students</h2>
      <button
        className="mb-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={() => {
          setShowForm(true);
          setEditingStudent(null);
        }}
      >
        + Add Student
      </button>
      {showForm && (
        <form
          onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
          className="mb-6 p-6 bg-white border rounded-lg shadow-md"
        >
          <h3 className="text-2xl font-bold mb-4">
            {editingStudent ? "Edit Student" : "Add Student"}
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
              <label className="block text-gray-700">Mother's Name</label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
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
              <label className="block text-gray-700">
                Date of Registration
              </label>
              <input
                type="date"
                value={dateOfRegistration}
                onChange={(e) => setDateOfRegistration(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Class</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            {editingStudent ? "Update Student" : "Add Student"}
          </button>
        </form>
      )}
      {students.length === 0 ? (
        <p className="text-gray-600">No students found.</p>
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
                <th className="py-3 px-4 text-left">Class</th>
                <th className="py-3 px-4 text-left">Roll Number</th>
                <th className="py-3 px-4 text-left">Section</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{student.customId}</td>
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">{student.age}</td>
                  <td className="py-3 px-4">{student.dob}</td>
                  <td className="py-3 px-4">{student.class}</td>
                  <td className="py-3 px-4">{student.rollNumber}</td>
                  <td className="py-3 px-4">{student.section}</td>
                  <td className="py-3 px-4">
                    <button
                      className="mr-2 px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                      onClick={() => handleEditStudent(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDeleteStudent(student.id)}
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

export default Students;
