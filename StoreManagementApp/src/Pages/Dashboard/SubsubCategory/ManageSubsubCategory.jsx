import React, { useState } from "react";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import useSubcategory from "../../../Hooks/useSubcategory";
import useSubsubCategory from "../../../Hooks/useSubsubCategory";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const ManageSubsubCategory = () => {
  const [subcategories] = useSubcategory();
  const [subsubcategories, refetch, isPending] = useSubsubCategory();
  const axiosPublic = useAxiosPublic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subsubcategory, setSubsubcategory] = useState("");
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState("");

  if (isPending) {
    return <div className="text-3xl text-center mt-24">Loading...</div>;
  }

  // Handle Delete
  const handleDeleteItem = (item) => {
    // console.log("Item: ", item);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosPublic.delete(`/subsubcategory/${item._id}`);
        // console.log(res);
        if (res.data.deletedCount > 0) {
          refetch(); // Refetch to update the UI
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${item.name} is deleted successfully.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  // ----+++ Add Category using modal +++----
  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubcategoryName(""); // Reset the category input
    setSubsubcategory(""); // Reset the subcategory input
  };
  // Handle Create Subcategory
  const handleCreateSubsubcategory = async () => {
    console.log(
      "Form submitted Data: ",
      subsubcategory,
      selectedSubcategoryName
    );
    if (!subsubcategory.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Subcategory name is required!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    try {
      const response = await axiosPublic.post("/subsubcategory", {
        name: subsubcategory,
        subcategoryName: selectedSubcategoryName,
      });
      if (response.data.acknowledged) {
        refetch(); // Refetch to update the UI with the new category
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${subsubcategory} is added successfully!`,
          showConfirmButton: false,
          timer: 1500,
        });
        closeModal(); // Close modal after successful submission
      }
    } catch (error) {
      console.error("Error creating category:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add Subcategory",
        text: error.message,
      });
    }
  };

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle
          subHeading="Manage all Sub Subcategories"
          heading="Sub Subcategory"
        />
      </div>

      {/* Add Sub Subcategory button with modal */}
      <div className="flex justify-end items-center mr-16">
        <button onClick={openModal} className="btn btn-primary my-2">
          Add Sub Subcategory
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-216">
              {/* Modal Heading */}
              <h2 className="text-xl font-bold mb-4 text-center">
                Add Sub-subcategory
              </h2>

              <div className="flex justify-center gap-4">
                {/* Sub-subcategory Name Field */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Sub-subcategory Name</span>
                  </label>
                  <input
                    type="text"
                    value={subsubcategory}
                    onChange={(e) => setSubsubcategory(e.target.value)} // Update state on input change
                    className="input input-bordered w-full"
                    placeholder="Enter Subcategory name"
                  />
                </div>

                {/* Subcategory option selection  */}
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Subcategory*</span>
                  </div>
                  <select
                    value={selectedSubcategoryName} // Bind the state to the select element
                    onChange={(e) => setSelectedSubcategoryName(e.target.value)} // Update the state on change
                    className="textarea textarea-bordered"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory.name}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Create and Cancel Buttons */}
              <div className="flex justify-end gap-4 mt-16 mb-8">
                {/* Create  */}
                <button
                  onClick={handleCreateSubsubcategory}
                  className="btn btn-success"
                >
                  Create
                </button>
                {/* Cancel  */}
                <button onClick={closeModal} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sub Subcategory Manage Table */}
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="font-bold text-xl bg-gray-300">
                <th>#</th>
                <th>Sub Subcategory</th>
                <th>Subcategory</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {subsubcategories.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"}`}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.subcategoryName}</td>
                  {/* Edit button  */}
                  <td>
                    <Link to={`/dashboard/update-subsubcategory/${item._id}`}>
                      <button className="btn btn-ghost text-2xl text-orange-500">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  {/* Delete button  */}
                  <td>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="btn btn-ghost text-2xl text-red-500"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSubsubCategory;
