'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGeo } from '../../../components/GeoContext';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const params = useParams();
  const { currency, symbol } = useGeo();

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id);
    }
  }, [params.id]);

  const fetchProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setSelectedSize(data.sizes[0]); // Default to first size
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (product) => {
    const priceKey = `price_in_${currency.toLowerCase()}`;
    const price = product[priceKey] || product.price_in_usd;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.size === selectedSize
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product[`price_in_${currency.toLowerCase()}`] || product.price_in_usd,
        image: product.images[0],
        quantity: quantity,
        size: selectedSize
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link href="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
                     <div className="aspect-w-1 aspect-h-1 mb-4">
             <img
               src={product.images[currentImageIndex] || '/suit-001-1.jpg'}
               alt={product.title}
               className="w-full h-96 object-cover rounded-lg"
               onError={(e) => {
                 e.target.src = '../../../assets/products/suit-001-1.jpg';
               }}
             />

           </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                                     <img
                     src={image}
                     alt={`${product.title} ${index + 1}`}
                     className="w-full h-full object-cover"
                     onError={(e) => {
                       e.target.src = '/suit-001-1.jpg';
                     }}
                   />
                </button>
              ))}
            </div>
          )}

          {/* Product Videos */}
          {product.videos && product.videos.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Product Video</h4>
                             <video
                 controls
                 className="w-full rounded-lg"
                 poster={product.images[0] || '/suit-001-1.jpg'}
               >
                                 <source src={product.videos[0]} type="video/mp4" />
                 <source src="/suit-001-video.mp4" type="video/mp4" />
                 Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary-600">Products</Link>
            <span className="mx-2">/</span>
            <span>{product.title}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          
          <div className="text-4xl font-bold text-primary-600 mb-6">
            {formatPrice(product)}
          </div>

          <div className="prose prose-gray mb-8">
            <p>{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg font-medium ${
                    selectedSize === size
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-3">Quantity</h4>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <div className="flex items-center text-green-600">
                <jpg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </jpg>
                <span>{product.stock} in stock</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <jpg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </jpg>
                <span>Out of stock</span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`btn-primary flex-1 ${
                product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="btn-secondary">
              <jpg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </jpg>
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-8">
            <h4 className="text-lg font-semibold mb-4">Product Details</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Available sizes: {product.sizes.join(', ')}</li>
              <li>• Premium fabric construction</li>
              <li>• Professional tailoring</li>
              <li>• Available in {product.countryAvailability.join(', ')}</li>
              <li>• Free shipping on orders over $500</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

