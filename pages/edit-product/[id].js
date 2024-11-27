import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import { storage, ref, uploadBytes, getDownloadURL } from "../../firebase";

// Fetcher function for SWR
const fetcher = (url) => axios.get(url).then((res) => res.data);

const EditProductForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: product,
    error,
    isValidating,
  } = useSWR(
    id
      ? `https://sourcexpet-apis-qtuam.ondigitalocean.app/api/product-sourcing/${id}`
      : null,
    fetcher
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    productImageUrl: "",
    shopVisitingCardImageUrl: "",
    isSampleCollected: false,
    packageNumber: "",
    sellerInfo: { name: "", wechat: "", email: "", onlineStore: "" },
  });

  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [uploadingShopCardImage, setUploadingShopCardImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update formData when product data is fetched
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  if (error)
    return <p className="text-red-500">Failed to load product details</p>;
  if (!product || isValidating)
    return <p className="text-blue-500">Loading product details...</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSellerInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      sellerInfo: { ...prev.sellerInfo, [name]: value },
    }));
  };

  // Handle file upload
  const handleFileUpload = async (e, field) => {
    const setUploading =
      field === "productImageUrl"
        ? setUploadingProductImage
        : setUploadingShopCardImage;
    setUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }

    const storageRef = ref(
      storage,
      `${field}/${formData.packageNumber}-${file.name}`
    );
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, [field]: url }));
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.productImageUrl)
      newErrors.productImageUrl = "Product image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.put(
        `https://sourcexpet-apis-qtuam.ondigitalocean.app/api/product-sourcing/${id}`,
        formData
      );
      if (response.status === 200) {
        alert("Product updated successfully!");
        router.push("/");
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white shadow-md rounded-lg px-2 space-y-4 max-w-sm mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-center text-indigo-500">
        Edit Product
      </h1>

      <InputField
        label="Name *"
        name="name"
        value={formData?.name}
        onChange={handleInputChange}
        error={errors?.name}
      />
      <InputField
        label="Category *"
        name="category"
        value={formData?.category}
        onChange={handleInputChange}
        error={errors?.category}
      />
      <InputField
        label="Price *"
        type="number"
        name="price"
        value={formData?.price}
        onChange={handleInputChange}
        error={errors?.price}
      />
      <TextAreaField
        label="Description"
        name="description"
        value={formData?.description}
        onChange={handleInputChange}
      />

      <FileUploadField
        label="Product Image *"
        field="productImageUrl"
        formData={formData}
        setFormData={setFormData}
        uploading={uploadingProductImage}
        handleFileUpload={handleFileUpload} // Pass the handleFileUpload function here
      />
      <FileUploadField
        label="Shop Visiting Card"
        field="shopVisitingCardImageUrl"
        formData={formData}
        setFormData={setFormData}
        uploading={uploadingShopCardImage}
        handleFileUpload={handleFileUpload} // Pass the handleFileUpload function here
      />

      <InputField
        label="Seller Name"
        name="name"
        value={formData?.sellerInfo?.name}
        onChange={handleSellerInfoChange}
      />
      <InputField
        label="WeChat"
        name="wechat"
        value={formData?.sellerInfo?.wechat}
        onChange={handleSellerInfoChange}
      />
      <InputField
        label="Email"
        name="email"
        value={formData?.sellerInfo?.email}
        onChange={handleSellerInfoChange}
      />
      <InputField
        label="Online Store"
        name="onlineStore"
        value={formData?.sellerInfo?.onlineStore}
        onChange={handleSellerInfoChange}
      />

      <button
        type="submit"
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

// Reuse existing input field components
const InputField = ({ label, name, value, onChange, error, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      className={`mt-1 text-black block w-full p-2 border rounded-md ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      value={value}
      onChange={onChange}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      className="mt-1 text-black block w-full p-2 border rounded-md border-gray-300"
      rows="3"
      value={value}
      onChange={onChange}
    ></textarea>
  </div>
);

const FileUploadField = ({
  label,
  field,
  formData,
  setFormData,
  uploading,
  handleFileUpload,
}) => {
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {formData[field] ? (
        <div className="relative">
          <img
            src={formData[field]}
            alt="Uploaded"
            className="w-full h-32 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
          >
            ✕
          </button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, field)}
            className="mt-1 text-black block w-full p-2 border rounded-md border-gray-300"
          />
        </div>
      )}
      {uploading && <p className="text-blue-500">Uploading...</p>}
    </div>
  );
};

export default EditProductForm;
