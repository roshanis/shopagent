import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { ProductData } from '../types';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ingredients: z.string().optional().or(z.literal('')),
  reviews: z.string().optional().or(z.literal('')),
  rating: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).max(5).optional()
  ),
});

interface ProductFormProps {
  onSubmit: (data: ProductData) => void;
  isLoading?: boolean;
}

const sampleData: ProductData = {
  name: 'Natural Vitamin C Serum',
  price: 45.99,
  brand: 'Pure Radiance',
  category: 'Skincare',
  description: 'Premium vitamin C serum with natural ingredients for brighter, healthier skin. Clinically tested and dermatologist approved.',
  ingredients: 'L-Ascorbic Acid (20%), Hyaluronic Acid, Vitamin E, Ferulic Acid, Aloe Vera Extract, Jojoba Oil',
  reviews: 'Great product! My skin looks brighter. Gentle and effective. Worth the price.',
  rating: 4.5,
};

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
  });

  const loadSampleData = () => {
    Object.entries(sampleData).forEach(([key, value]) => {
      setValue(key as keyof ProductData, value);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Information
          </h2>
          <button
            type="button"
            onClick={loadSampleData}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Load Sample Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price ($) *
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price.message}</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand *
            </label>
            <input
              {...register('brand')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter brand name"
            />
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.brand.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <input
              {...register('category')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Skincare, Electronics"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Ingredients */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ingredients (Optional)
          </label>
          <textarea
            {...register('ingredients')}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="List ingredients (if applicable)"
          />
        </div>

        {/* Reviews */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            User Reviews (Optional)
          </label>
          <textarea
            {...register('reviews')}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter user reviews or feedback"
          />
        </div>

        {/* Rating */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Average Rating (Optional)
          </label>
          <input
            {...register('rating', { valueAsNumber: true })}
            type="number"
            step="0.1"
            min="0"
            max="5"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="0.0 - 5.0"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Starting Evaluation...
              </>
            ) : (
              'Start Evaluation'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
