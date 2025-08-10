'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminOnly from '../../../components/AdminOnly';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_in_usd: '',
    price_in_inr: '',
    price_in_gbp: '',
    price_in_cad: '',
    sizes: [],
    stock: '',
    countryAvailability: ['IN', 'UK', 'CA', 'US']
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const availableSizes = ['36', '38', '40', '42', '44', '46', '48'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleFileUpload = async (file, type) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const result = await response.json();
        if (type === 'image') {
          setImages(prev => [...prev, result.url]);
        } else {
          setVideos(prev => [...prev, result.url]);
        }
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.sizes.length === 0) {
      setError('Please select at least one size');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price_in_usd: parseFloat(formData.price_in_usd),
          price_in_inr: parseFloat(formData.price_in_inr) || Math.round(parseFloat(formData.price_in_usd) * 82),
          price_in_gbp: parseFloat(formData.price_in_gbp) || Math.round(parseFloat(formData.price_in_usd) * 0.79),
          price_in_cad: parseFloat(formData.price_in_cad) || Math.round(parseFloat(formData.price_in_usd) * 1.35),
          stock: parseInt(formData.stock),
          images,
          videos
        }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create product');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminOnly>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                required
                className="input-field"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="input-field"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  name="price_in_usd"
                  required
                  step="0.01"
                  className="input-field"
                  value={formData.price_in_usd}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  className="input-field"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (INR)
                </label>
                <input
                  type="number"
                  name="price_in_inr"
                  step="0.01"
                  className="input-field"
                  value={formData.price_in_inr}
                  onChange={handleChange}
                  placeholder="Auto-calculated"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (GBP)
                </label>
                <input
                  type="number"
                  name="price_in_gbp"
                  step="0.01"
                  className="input-field"
                  value={formData.price_in_gbp}
                  onChange={handleChange}
                  placeholder="Auto-calculated"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (CAD)
                </label>
                <input
                  type="number"
                  name="price_in_cad"
                  step="0.01"
                  className="input-field"
                  value={formData.price_in_cad}
                  onChange={handleChange}
                  placeholder="Auto-calculated"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange(size)}
                    className={`px-3 py-2 border rounded-lg font-medium ${
                      formData.sizes.includes(size)
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  Array.from(e.target.files).forEach(file => {
                    handleFileUpload(file, 'image');
                  });
                }}
                className="input-field"
              />
              {images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((url, index) => (
                    <img key={index} src={url} alt={`Upload ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Videos
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleFileUpload(e.target.files[0], 'video');
                  }
                }}
                className="input-field"
              />
              {videos.length > 0 && (
                <div className="mt-2">
                  {videos.map((url, index) => (
                    <p key={index} className="text-sm text-gray-600">Video uploaded: {url}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminOnly>
  );
}

