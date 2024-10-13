import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { FaUtensils } from "react-icons/fa";
import useCategories from "../../../Hooks/useCategories";
import Swal from "sweetalert2";

const UpdateSubcategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();
  const Navigate = useNavigate();
  const [categories] = useCategories();

  const subcategory = useLoaderData();
  const { _id: id, name, categoryId } = subcategory?.[0] || {};
  //   console.log(id, name, categoryId);

  const findingCategory = (categoryId) => {
    const matchCategory = categories.find(
      (category) => category._id === categoryId
    );
    return matchCategory?.name;
  };

  const onSubmit = async (data) => {
    const subcategoryItem = {
      name: data.name,
      categoryId: data.category,
    };
    try {
      const Response = await axiosPublic.patch(
        `/subcategory/${id}`,
        subcategoryItem
      );
      if (Response.data.modifiedCount > 0) {
        // Show success popup
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.name} is updated successfully.`,
          showConfirmButton: false,
          timer: 1500,
        });
        // Reset the form fields
        reset();
        Navigate("/dashboard/manage-subcategory");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `Failed to update ${data.name}. Please try again.`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="m-12">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-x-4 mb-4">
          {/* Subcategory id */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Subcategory Id*</span>
            </label>
            <input
              type="text"
              defaultValue={id}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          {/* Subcategory name */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Subcategory Name*</span>
            </label>
            <input
              type="text"
              defaultValue={name}
              {...register("name", { required: true })}
              className="input input-bordered w-full"
            />
          </div>
          {/* Current Category  Name*/}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Current Category*</span>
            </label>
            <input
              type="text"
              disabled
              //   defaultValue={findingCategory(categoryId)} -- id to name
              defaultValue={findingCategory(categoryId)}
              className="input input-bordered w-full"
            />
          </div>
          {/*Update Category Dropdown  */}
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Change Category*</span>
            </div>
            <select
              defaultValue={categoryId}
              {...register("category")}
              className="textarea textarea-bordered"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500">{errors.category.message}</span>
            )}
          </div>
        </div>
        {/* Button */}
        <div>
          <button className="btn btn-active btn-primary my-4">
            Submit <FaUtensils className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSubcategory;
