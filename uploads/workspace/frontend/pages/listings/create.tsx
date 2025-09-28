import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { marketplaceAPI } from '../../lib/api';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import {
  PlusIcon,
  PhotoIcon,
  CurrencyRupeeIcon,
  ScaleIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface CreateListingForm {
  product_name: string;
  product_category: string;
  product_unit: string;
  quantity: number;
  quality_grade: string;
  asking_price: number;
  description: string;
  photos: FileList;
}

function CreateListing() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateListingForm>();

  const categories = [
    'vegetables',
    'fruits',
    'cereals',
    'pulses',
    'spices',
    'herbs',
    'flowers',
    'other'
  ];

  const units = [
    'kg',
    'quintal',
    'ton',
    'piece',
    'dozen',
    'bunch',
    'bag',
    'box'
  ];

  const qualityGrades = ['A', 'B', 'C', 'Organic', 'Premium'];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setPhotos(fileArray);
    }
  };

  const onSubmit = async (data: CreateListingForm) => {
    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('product_name', data.product_name);
      formData.append('product_category', data.product_category);
      formData.append('product_unit', data.product_unit);
      formData.append('quantity', data.quantity.toString());
      formData.append('quality_grade', data.quality_grade);
      formData.append('asking_price', data.asking_price.toString());
      formData.append('description', data.description);
      formData.append('farmer_id', user?.user_id || '');

      // Add photos
      photos.forEach((photo, index) => {
        formData.append(`photos`, photo);
      });

      const response = await marketplaceAPI.createListing(formData);
      
      if (response.data.success) {
        toast.success('Listing created successfully!');
        router.push('/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <DashboardLayout title="Create New Listing">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Product Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a new listing to sell your agricultural products.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Product Name */}
              <div>
                <label className="form-label">
                  <TagIcon className="h-4 w-4 inline mr-1" />
                  Product Name *
                </label>
                <input
                  type="text"
                  {...register('product_name', { required: 'Product name is required' })}
                  className="form-input"
                  placeholder="e.g., Fresh Tomatoes, Organic Wheat"
                />
                {errors.product_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.product_name.message}</p>
                )}
              </div>

              {/* Category and Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    {...register('product_category', { required: 'Category is required' })}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.product_category && (
                    <p className="mt-1 text-sm text-red-600">{errors.product_category.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    <ScaleIcon className="h-4 w-4 inline mr-1" />
                    Unit *
                  </label>
                  <select
                    {...register('product_unit', { required: 'Unit is required' })}
                    className="form-input"
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  {errors.product_unit && (
                    <p className="mt-1 text-sm text-red-600">{errors.product_unit.message}</p>
                  )}
                </div>
              </div>

              {/* Quantity and Quality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' }
                    })}
                    className="form-input"
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Quality Grade *</label>
                  <select
                    {...register('quality_grade', { required: 'Quality grade is required' })}
                    className="form-input"
                  >
                    <option value="">Select Grade</option>
                    {qualityGrades.map((grade) => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                  {errors.quality_grade && (
                    <p className="mt-1 text-sm text-red-600">{errors.quality_grade.message}</p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="form-label">
                  <CurrencyRupeeIcon className="h-4 w-4 inline mr-1" />
                  Asking Price (per unit) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  {...register('asking_price', { 
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be at least ₹1' }
                  })}
                  className="form-input"
                  placeholder="Enter price per unit"
                />
                {errors.asking_price && (
                  <p className="mt-1 text-sm text-red-600">{errors.asking_price.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="form-input"
                  placeholder="Describe your product, growing methods, special features, etc."
                />
              </div>

              {/* Photos */}
              <div>
                <label className="form-label">
                  <PhotoIcon className="h-4 w-4 inline mr-1" />
                  Product Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="form-input"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload up to 5 photos of your product. Supported formats: JPG, PNG, WebP
                </p>
                {photos.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default CreateListing;
