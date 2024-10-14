import React, { useState } from "react";
import useProducts from "../../../Hooks/useProducts";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";

const Sales = () => {
  const [products, refetch, isPending] = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Add a product to the sales list
  const addProductToSale = (product) => {
    setSelectedProducts([...selectedProducts, product]);
    setTotalPrice(totalPrice + parseInt(product.productPrice));
  };

  // Handle the product search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="m-12">
      {/* Section Title */}
      <div className="mb-8">
        <SectionTitle
          subHeading="Search and sell your Products"
          heading="Sales"
        />
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Search Products section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-blue-500">
            Search Products
          </h2>
          <input
            type="text"
            placeholder="Search product by brand or category"
            value={searchTerm}
            onChange={handleSearch}
            className="input input-bordered w-full mb-4"
          />

          <h3 className="text-xl font-medium mb-2">Search Results:</h3>
          <ul className="space-y-2">
            {products
              .filter((product) => {
                // Split the search term into words
                const searchWords = searchTerm.toLowerCase().split(" ");
                
                // Check if every word is present in either the brand or subsubCategory
                return searchWords.every((word) =>
                  product.brand?.toLowerCase().includes(word) ||
                  product.subsubCategory?.toLowerCase().includes(word)
                );
              })
              .map((product) => (
                <li
                  key={product._id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                >
                  <span>
                    {product.subsubCategory} - {product.brand} - ${product.productPrice}
                  </span>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => addProductToSale(product)}
                  >
                    Add
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* Selected Products Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-green-500">
            Selected Products
          </h2>
          <ul className="space-y-2 mb-4">
            {selectedProducts.map((product, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span>
                  {product.brand} - ${product.productPrice}
                </span>
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-bold">Total Price: ${totalPrice}</h2>
        </div>
      </div>
    </div>
  );
};

export default Sales;
