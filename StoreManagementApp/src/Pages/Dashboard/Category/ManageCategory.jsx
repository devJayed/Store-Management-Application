import Swal from "sweetalert2";
import useCategories from "../../../Hooks/useCategories";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useState } from "react";

const ManageCategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const axiosPublic = useAxiosPublic();
  // Fetch categories using the custom hook
  const [categories, refetch, isPending] = useCategories();

  if (isPending) {
    return <div className="text-3xl text-center mt-24">Loading...</div>;
  }
  // Handle Delete
  const handleDeleteItem = (item) => {
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
        const res = await axiosPublic.delete(`/category/${item._id}`);
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
    setCategoryName(""); // Reset the category input
  };
  // Handle Create Category
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Category name is required!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    try {
      const response = await axiosPublic.post("/category", {
        name: categoryName,
      });
      if (response.data.acknowledged) {
        refetch(); // Refetch to update the UI with the new category
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${categoryName} is added successfully!`,
          showConfirmButton: false,
          timer: 1500,
        });
        closeModal(); // Close modal after successful submission
      }
    } catch (error) {
      console.error("Error creating category:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add category",
        text: error.message,
      });
    }
  };

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle subHeading="Manage all categories" heading="Category" />
      </div>

      {/* Add Category [Modal and others] */}
      <div className="flex justify-end items-center mr-16">
        <button onClick={openModal} className="btn btn-primary my-2">
          Add Category
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              {/* Modal Heading */}
              <h2 className="text-xl font-bold mb-4 text-center">
                Add Category
              </h2>

              {/* Category Name Field */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Category Name</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)} // Update state on input change
                  className="input input-bordered w-full"
                  placeholder="Enter category name"
                />
              </div>

              {/* Create and Cancel Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCreateCategory}
                  className="btn btn-success"
                >
                  Create
                </button>
                <button onClick={closeModal} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Manage Table */}
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="font-bold text-xl bg-gray-300">
                <th>#</th>
                <th>Category</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"}`}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  {/* Edit  */}
                  <td>
                    <Link to={`/dashboard/update-category/${item._id}`}>
                      <button className="btn btn-ghost text-2xl text-orange-500">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  {/* Delete  */}
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

export default ManageCategory;
