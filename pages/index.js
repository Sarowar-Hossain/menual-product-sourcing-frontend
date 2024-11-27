import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Home() {
  const { data, error, mutate, isLoading } = useSWR(
    "https://sourcexpet-apis-qtuam.ondigitalocean.app/api/product-sourcing",
    fetcher
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDelete = async (productId) => {
    setIsDeleteLoading(true);
    try {
      await axios.delete(
        `https://sourcexpet-apis-qtuam.ondigitalocean.app/api/product-sourcing/${productId}`
      );
      alert("Product deleted successfully!");
      mutate();
      setSelectedProduct(null);
    } catch (err) {
      alert("Failed to delete the product");
    } finally {
      setIsDeleteLoading(false);
    }
  };
  return (
    <div className="grid gap-3 p-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load products.</p>
      ) : (
        <>
          {data?.length > 0 ? (
            data?.map((product) => {
              return (
                <div
                  key={product?._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <img
                    className="w-full h-48 object-cover rounded-t-lg"
                    src={product?.productImageUrl}
                    alt={product?.name}
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-indigo-500">
                      {product?.name}
                    </h2>
                    <p className="text-gray-700 text-sm">
                      {product?.description.slice(0, 50)}
                    </p>
                    <p className="text-lg font-semibold mt-2">
                      Price: ${product?.price}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Category: {product?.category}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Package: {product?.packageNumber}
                    </p>

                    <div className="mt-4 flex justify-between">
                      <Link href={`/edit-product/${product?._id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{selectedProduct?.name}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedProduct?._id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
