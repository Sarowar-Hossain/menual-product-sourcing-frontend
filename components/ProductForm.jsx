import { useState } from 'react';
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    productImageUrl: '',
    shopVisitingCardImageUrl: '',
    isSampleCollected: false,
    packageNumber: generatePackageNumber(),
    sellerInfo: { name: '', wechat: '', email: '', onlineStore: '' },
  });

  const [loading, setLoading] = useState(false);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [uploadingShopCardImage, setUploadingShopCardImage] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  function generatePackageNumber() {
    return `${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSellerInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      sellerInfo: {
        ...prev.sellerInfo,
        [name]: value,
      },
    }));
  };

  const handleFileUpload = async (e, field) => {
    const setUploading = field === 'productImageUrl' ? setUploadingProductImage : setUploadingShopCardImage;
    setUploading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `${field}/${formData.packageNumber}-${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.productImageUrl) newErrors.productImageUrl = 'Product image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post('https://sourcexpet-apis-qtuam.ondigitalocean.app/api/product-sourcing', formData);
      console.log(response);
      if (response.status === 201) {
        toast.success('Product added successfully!');
        setFormData({
          name: '',
          category: '',
          price: '',
          description: '',
          productImageUrl: '',
          shopVisitingCardImageUrl: '',
          isSampleCollected: false,
          packageNumber: generatePackageNumber(),
          sellerInfo: { name: '', wechat: '', email: '', onlineStore: '' },
        });
        router.push('/');
      } else {
        toast.error('Failed to add product.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white shadow-md rounded-lg px-3 space-y-4 max-w-sm mx-auto" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-center text-indigo-500">Add New Product</h1>

      {/* Mandatory Fields */}
      <InputField label="Name *" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} />
      <InputField label="Category *" name="category" value={formData.category} onChange={handleInputChange} error={errors.category} />
      <InputField label="Price *" type="number" name="price" value={formData.price} onChange={handleInputChange} error={errors.price} />
      <TextAreaField label="Description" name="description" value={formData.description} onChange={handleInputChange} />

      {/* File Uploads */}
      <FileUploadField
        label="Product Image *"
        onChange={(e) => handleFileUpload(e, 'productImageUrl')}
        uploading={uploadingProductImage}
        error={errors.productImageUrl}
      />
      <FileUploadField
        label="Shop Visiting Card"
        onChange={(e) => handleFileUpload(e, 'shopVisitingCardImageUrl')}
        uploading={uploadingShopCardImage}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Package Number</label>
        <input type="text" className="mt-1 block w-full p-2 border rounded-md bg-gray-200" value={formData.packageNumber} disabled />
      </div>

      {/* Seller Information */}
      <InputField label="Seller Name" name="name" value={formData.sellerInfo.name} onChange={handleSellerInfoChange} />
      <InputField label="WeChat" name="wechat" value={formData.sellerInfo.wechat} onChange={handleSellerInfoChange} />
      <InputField label="Email" name="email" value={formData.sellerInfo.email} onChange={handleSellerInfoChange} />
      <InputField label="Online Store" name="onlineStore" value={formData.sellerInfo.onlineStore} onChange={handleSellerInfoChange} />

      <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

const InputField = ({ label, name, value, onChange, error, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      className={`mt-1 text-black block  w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
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

const FileUploadField = ({ label, onChange, uploading, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type="file" accept="image/*" onChange={onChange} />
    {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default ProductForm;
