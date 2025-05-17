import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PhotoIcon } from "@heroicons/react/24/outline";
import type { AppDispatch, RootState } from "../../store";
import {
  createItem,
  updateItem,
  selectItemsLoading,
  selectItemsError,
} from "../../store/slices/itemSlice";
import type { Item } from "../../store/slices/itemSlice";

// Predefined categories
const PREDEFINED_CATEGORIES = [
  "T-Shirt",
  "Polo",
  "Jacket",
  "Pants",
  "Shorts",
  "Trouser",
  "Shoes",
  "Bags",
  "Cap/Hat",
  "Other",
];

// Predefined sizes
const PREDEFINED_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

interface ItemFormProps {
  item?: Item;
  mode: "create" | "edit";
}

export const ItemForm = ({ item, mode }: ItemFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(selectItemsLoading);
  const error = useSelector(selectItemsError);

  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    price: item?.price || "",
    category: item?.category || "",
    size: item?.size || "",
    condition: item?.condition || "GOOD",
    photo: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    item?.photoUrl || null
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = "Price must be a positive number";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.size) {
      errors.size = "Size is required";
    }

    if (mode === "create" && !formData.photo) {
      errors.photo = "Image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setImagePreview(URL.createObjectURL(file));
      if (formErrors.photo) {
        setFormErrors((prev) => ({ ...prev, photo: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // For debugging
    console.log("Form data before submission:", formData);

    // Create a simple object instead of FormData
    const itemData = {
      title: formData.title,
      description: formData.description,
      price: formData.price.toString(),
      category: formData.category,
      size: formData.size,
      condition: formData.condition,
      // Use a placeholder image URL since we're having issues with file upload
      photoUrl: "https://via.placeholder.com/300",
    };

    console.log("Submitting item data:", itemData);

    try {
      if (mode === "create") {
        // Get the authentication token
        const token = localStorage.getItem("token");

        // Make direct API call to the backend with proper authorization
        const response = await fetch("http://localhost:5000/api/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Response Error:", errorData);
          throw new Error(errorData.error || "Failed to create item");
        }

        const data = await response.json();
        console.log("API Response Success:", data);

        navigate("/admin/items");
      } else if (item) {
        await dispatch(updateItem({ id: item.id, data: itemData })).unwrap();
        navigate(`/items/${item.id}`);
      }
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error saving item
              </h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Product Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm text-gray-900 ${
            formErrors.title
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {formErrors.title && (
          <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm text-gray-900 ${
            formErrors.description
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₱</span>
          </div>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className={`block w-full pl-7 pr-12 rounded-md shadow-sm sm:text-sm text-gray-900 ${
              formErrors.price
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
        </div>
        {formErrors.price && (
          <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm text-gray-900 ${
            formErrors.category
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        >
          <option value="">Select a category</option>
          {PREDEFINED_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {formErrors.category && (
          <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
        )}
      </div>

      {/* Size */}
      <div>
        <label
          htmlFor="size"
          className="block text-sm font-medium text-gray-700"
        >
          Size
        </label>
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm text-gray-900 ${
            formErrors.size
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        >
          <option value="">Select a size</option>
          {PREDEFINED_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        {formErrors.size && (
          <p className="mt-1 text-sm text-red-600">{formErrors.size}</p>
        )}
      </div>

      {/* Condition */}
      <div>
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700"
        >
          Condition
        </label>
        <select
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md shadow-sm sm:text-sm text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="NEW">New</option>
          <option value="LIKE_NEW">Like New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, photo: null }));
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                >
                  <svg
                    className="h-4 w-4 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image-upload"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
        {formErrors.photo && (
          <p className="mt-1 text-sm text-red-600">{formErrors.photo}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : mode === "create"
            ? "Create Item"
            : "Update Item"}
        </button>
      </div>
    </form>
  );
};
