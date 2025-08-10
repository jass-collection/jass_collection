'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGeo } from './GeoContext';

export default function ProductCard({ product }) {
  const { currency, symbol } = useGeo();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
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

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product[`price_in_${currency.toLowerCase()}`] || product.price_in_usd,
        image: product.images[0],
        quantity: 1,
        size: product.sizes[0] // Default to first available size
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message (you can replace with a toast notification)
    alert('Added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative cursor-pointer">
        {/* Main Image/Video Display */}
        {showVideo && product.videos && product.videos.length > 0 ? (
          <div className="relative w-full product-card-container">
            <video
              src={product.videos[0]}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs hover:bg-opacity-75"
            >
              Show Images
            </button>
          </div>
        ) : (
          <div className="relative w-full product-card-container">
            <img
              src={product.images[currentImageIndex] || '/placeholder-suit.jpg'}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 product-card-image"
            />
            {/* Video Button */}
            {product.videos && product.videos.length > 0 && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs hover:bg-opacity-75"
              >
                Play Video
              </button>
            )}
          </div>
        )}
        
        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Out of Stock
          </div>
        )}
        
        {/* Image Navigation */}
        {product.images && product.images.length > 1 && !showVideo && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product)}
          </span>
          <div className="text-sm text-gray-500">
            Sizes: {product.sizes.join(', ')}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/products/${product.id}`} className="btn-secondary flex-1 text-center">
            View Details
          </Link>
          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className={`btn-primary flex-1 ${
              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

