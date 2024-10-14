import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
// import Swal from "sweetalert2";
import { FaPlusSquare } from "react-icons/fa";
import Swal from "sweetalert2";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";

const AddProducts = () => {
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // calling useAxiosPublic hook
  const axiosPublic = useAxiosPublic();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubsubCategories] = useState([]);

  const [brands, setBrands] = useState([]);

  // Watch selected category and subcategory values from the form
  const selectedCategory = watch("category");
  const selectedSubCategory = watch("subCategory");
  console.log("selectedCategory:", selectedCategory);
  console.log("selectedSubCategory:", selectedSubCategory);

  // --++ Fetch category, subcategory and subsubcategory +--
  // Fetch categories when the component mounts
  useEffect(() => {
    axiosPublic.get("/category").then((response) => {
      setCategories(response.data);
      // console.log("categories", categories);
    });
  }, []);

  // Fetch subcategories when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      axiosPublic.get(`/subcategory2/${selectedCategory}`).then((response) => {
        setSubCategories(response.data);
        // console.log("subCategories:", subCategories);
        setSubsubCategories([]); // Reset sub-subcategories
        setValue("subCategory", ""); // Reset the subcategory field
        setValue("subsubCategory", ""); // Reset the sub-subcategory field
      });
    }
  }, [selectedCategory, setValue]);

  // Fetch sub-subcategories when selectedSubCategory changes
  useEffect(() => {
    if (selectedSubCategory) {
      axiosPublic
        .get(`/subsubcategory2/${selectedSubCategory}`)
        .then((response) => {
          setSubsubCategories(response.data);
          // console.log("subsubCategories", subsubCategories);
          setValue("subSubCategory", ""); // Reset the sub-subcategory field
        });
    }
  }, [selectedSubCategory, setValue]);

  // Fetch Brands
  useEffect(() => {
    axiosPublic.get("/brands").then((response) => {
      setBrands(response.data);
    });
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Form Submitted Data:", data);
    reset();

    // Handling form data
    const ProductDetails = {
      category: data.category,
      subCategory: data.subCategory,
      subsubCategory: data.subsubCategory,
      brand: data.brand,
      inStock: data.inStock,
      productQuantity: data.productQuantity,
      stockAlert: data.stockAlert,
      costRMB: data.costRMB,
      rmbRate: data.rmbRate,
      transportCost: data.transportCost,
      date: data.date,
    };

    try {
      const productRes = await axiosPublic.post("/products", ProductDetails);
      // console.log(productRes);
      if (productRes.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.category} is added successfully.`,
          showConfirmButton: false,
          timer: 1500,
        });
        reset(); // Clear the form after submission
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle
          subHeading="All Products' batch is here"
          heading="Products"
        />
      </div>
      <div className="p-16">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First row -- Category */}
          <div className="flex gap-x-4 mb-4">
            {/* Product Category Dropdown  */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Category*</span>
              </div>
              <select
                {...register("category")}
                defaultValue=""
                className="textarea textarea-bordered"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>
            {/* Product Sub-category Dropdown  */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Sub-category*</span>
              </div>
              <select
                {...register("subCategory")}
                defaultValue=""
                className="textarea textarea-bordered"
                disabled={!selectedCategory}
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory.name}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
              {errors.subCategory && (
                <span className="text-red-500">
                  {errors.subCategory.message}
                </span>
              )}
            </div>
            {/* Product Sub-sub-category Dropdown  */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Sub-subcategory*</span>
              </div>
              <select
                {...register("subsubCategory")}
                defaultValue=""
                className="textarea textarea-bordered"
                disabled={!selectedSubCategory}
              >
                <option value="">Select Sub-subcategory</option>
                {subsubCategories.map((subsubCategory) => (
                  <option key={subsubCategory._id} value={subsubCategory.name}>
                    {subsubCategory.name}
                  </option>
                ))}
              </select>
              {errors.subsubCategory && (
                <span className="text-red-500">
                  {errors.subsubCategory.message}
                </span>
              )}
            </div>
          </div>
          {/* Second Row  */}
          <div className="flex gap-x-4 mb-4">
            {/* Brands Dropdown  */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Brands*</span>
              </div>
              <select
                {...register("brand")}
                defaultValue="" // Set defaultValue as the first brand or empty string
                className="textarea textarea-bordered"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>
            {/* ProductCode (SKU) */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Product Code*</span>
              </div>
              <input
                type="text"
                disabled
                {...register("ProductCode")}
                className="textarea textarea-bordered"
                placeholder="Product Code"
              />
              {errors.ProductCode && (
                <span className="text-red-500">
                  {errors.ProductCode.message}
                </span>
              )}
            </div>
          </div>
          {/* Third Row  */}
          <div className="flex gap-x-4 mb-4">
            {/* In-Stock */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">In-Stock*</span>
              </div>
              <input
                type="number"
                defaultValue="0"
                {...register("inStock", {
                  required: "In-Stock is required",
                })}
                className="textarea textarea-bordered"
                placeholder="In-Stock"
              />
              {errors.inStock && (
                <span className="text-red-500">{errors.inStock.message}</span>
              )}
            </div>
            {/* Product Quantity */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Product Quantity*</span>
              </div>
              <input
                type="number"
                {...register("productQuantity", {
                  required: "Product Quantity is required",
                })}
                className="textarea textarea-bordered"
                placeholder="Product Quantity"
              />
              {errors.productQuantity && (
                <span className="text-red-500">
                  {errors.productQuantity.message}
                </span>
              )}
            </div>
            {/* Stock Alert */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Stock Alert*</span>
              </div>
              <input
                type="number"
                defaultValue="50"
                {...register("stockAlert", {
                  required: "Stock Alert is required",
                })}
                className="textarea textarea-bordered"
                placeholder="Stock Alert"
              />
              {errors.stockAlert && (
                <span className="text-red-500">
                  {errors.stockAlert.message}
                </span>
              )}
            </div>
          </div>
          {/* Fourth Row  */}
          <div className="flex gap-x-4 mb-4">
            {/* Cost at RMB per Unit */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Cost RMB*</span>
              </div>
              <input
                type="number"
                defaultValue="32"
                {...register("costRMB", {
                  required: "Cost RMB is required",
                })}
                className="textarea textarea-bordered"
                placeholder="Cost RMB"
              />
              {errors.costRMB && (
                <span className="text-red-500">{errors.costRMB.message}</span>
              )}
            </div>
            {/* RMB Rate in BD */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">RMB Rate*</span>
              </div>
              <input
                type="number"
                defaultValue="17"
                {...register("rmbRate", {
                  required: "RMB Rate is required",
                })}
                className="textarea textarea-bordered"
                placeholder="RMB Rate"
              />
              {errors.rmbRate && (
                <span className="text-red-500">{errors.rmbRate.message}</span>
              )}
            </div>
            {/* Transport Cost */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Transport Cost*</span>
              </div>
              <input
                type="number"
                defaultValue="50"
                {...register("transportCost", {
                  required: "RMB Rate is required",
                })}
                className="textarea textarea-bordered"
                placeholder="RMB Rate"
              />
              {errors.transportCost && (
                <span className="text-red-500">
                  {errors.transportCost.message}
                </span>
              )}
            </div>
          </div>
          {/* Fifth Row  */}
          {/* Date */}
          <div className="form-control w-1/2">
            <div className="label">
              <span className="label-text">Date*</span>
            </div>
            <input
              type="date"
              {...register("date", {})}
              className="textarea textarea-bordered"
              defaultValue={new Date().toISOString().split("T")[0]} // Set the current date as the default value
            />
            {errors.date && (
              <span className="text-red-500">{errors.date.message}</span>
            )}
          </div>
          {/* Submit Button */}
          <div>
            <button className="btn btn-active btn-ghost my-4" type="submit">
              Submit <FaPlusSquare />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
