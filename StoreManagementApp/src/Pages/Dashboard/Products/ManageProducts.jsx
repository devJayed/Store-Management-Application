import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const ManageProducts = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Define the fetch function
  const fetchProducts = async () => {
    const response = await fetch("http://localhost:5000/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  };

  // Use useQuery to fetch the data and handle loading and error states
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Handle loading state
  if (isLoading) {
    return <div className="text-3xl text-center mt-24">Loading...</div>;
  }

  // Handle Delete
  const handleDeleteItem = (item) => {
    console.log(item);
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
        const res = await axiosPublic.delete(`/products/${item._id}`);
        if (res.data.deletedCount > 0) {
          refetch(); // Refetch to update the UI
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${item.category} is deleted successfully.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle
          subHeading="Manage your products"
          heading="Manage Products"
        />
      </div>
      {/* Render product list */}
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-300">
            {/* Table Head */}
            <thead className="text-center">
              <tr className="font-bold text-xl bg-gray-300 border border-gray-300">
                <th className="border-r border-gray-400">#</th>
                <th className="border-r border-gray-400">Category</th>
                <th className="border-r border-gray-400">SubCategory</th>
                <th className="border-r border-gray-400">SubsubCategory</th>
                <th className="border-r border-gray-400">Brand</th>
                <th className="border-r border-gray-400">Product Code</th>
                <th className="border-r border-gray-400">In Stock</th>
                <th className="border-r border-gray-400">Product Quantity</th>
                <th className="border-r border-gray-400">Stock Alert</th>
                <th className="border-r border-gray-400">Cost at RMB</th>
                <th className="border-r border-gray-400">RMB Rate</th>
                <th className="border-r border-gray-400">Transport Cost</th>
                <th className="border-r border-gray-400">Product Cost</th>
                <th className="border-r border-gray-400">Product Price</th>
                <th className="border-r border-gray-400">Date</th>
                <th className="border-r border-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${
                    index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"
                  } border border-gray-300`}
                >
                  <td className="border border-gray-300">{index + 1}</td>
                  <td className="border border-gray-300">
                    {item.category}
                  </td>
                  <td className="border border-gray-300">
                    {item.subCategory}
                  </td>
                  <td className="border border-gray-300">
                    {item.subsubCategory}
                  </td>
                  <td className="border border-gray-300">{item.brand}</td>
                  <td className="border border-gray-300">{item.productCode}</td>
                  <td className="border border-gray-300">
                    {item.inStock}
                  </td>
                  <td className="border border-gray-300">
                    {item.productQuantity}
                  </td>
                  <td className="border border-gray-300">{item.stockAlert}</td>
                  <td className="border border-gray-300">{item.costRMB}</td>
                  <td className="border border-gray-300">{item.rmbRate}</td>
                  <td className="border border-gray-300">
                    {item.transportCost}
                  </td>
                  <td className="border border-gray-300">{item.productCost}</td>
                  <td className="border border-gray-300">
                    {item.productPrice}
                  </td>
                  <td className="border border-gray-300">
                    {new Date(item.date).toLocaleDateString()}
                  </td>

                  {/* Action buttons */}
                  <td className="flex">
                    {/* Edit button */}
                    <Link>
                      <button className="btn btn-ghost text-2xl text-orange-500">
                        <FaEdit />
                      </button>
                    </Link>
                    {/* Delete button */}
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

export default ManageProducts;
