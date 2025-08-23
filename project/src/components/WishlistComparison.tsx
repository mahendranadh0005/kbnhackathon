import React, { useState } from 'react';
import { Upload, ArrowRight, Star, DollarSign, Package, Truck, Store, Globe } from 'lucide-react';
import { WishlistItem } from '../types';

const WishlistComparison: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'Organic Quinoa Bowl',
      onlinePrice: 899,
      storePrice: 749,
      availability: 'both',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Cotton Comfort T-Shirt',
      onlinePrice: 1299,
      storePrice: 1499,
      availability: 'both',
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Bluetooth Wireless Headphones',
      onlinePrice: 89.99,
      storePrice: 94.99,
      availability: 'online',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'
    }
  ]);

  const [showUpload, setShowUpload] = useState(false);

  const handleWishlistUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate processing the uploaded wishlist
      console.log('Processing wishlist file:', file.name);
      setShowUpload(false);
    }
  };

  const getSavings = (item: WishlistItem) => {
    return item.onlinePrice - item.storePrice;
  };

  const getBestPrice = (item: WishlistItem) => {
    return Math.min(item.onlinePrice, item.storePrice);
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'both':
        return <Package className="w-4 h-4 text-green-600" />;
      case 'online':
        return <Globe className="w-4 h-4 text-blue-600" />;
      case 'store':
        return <Store className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Wishlist Comparison</h2>
            <p className="text-gray-600 mt-1">Compare your online wishlist with in-store availability and prices</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import Wishlist</span>
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Wishlist</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Upload your Walmart app wishlist or share your wishlist link</p>
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleWishlistUpload}
                className="hidden"
                id="wishlist-upload"
              />
              <label
                htmlFor="wishlist-upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Choose File
              </label>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Comparison Results</h3>
        
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{item.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getAvailabilityIcon(item.availability)}
                          <span className="text-sm text-gray-600 capitalize">{item.availability}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        Best: ${getBestPrice(item).toFixed(2)}
                      </div>
                      {getSavings(item) !== 0 && (
                        <div className="text-sm text-gray-600">
                          Save ${Math.abs(getSavings(item)).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* Online Price */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Online</span>
                      </div>
                      <div className="text-lg font-bold text-blue-700">₹{item.onlinePrice}</div>
                      <div className="text-xs text-blue-600 mt-1">Free shipping over $35</div>
                    </div>
                    
                    {/* Store Price */}
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Store className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">In-Store</span>
                      </div>
                      <div className="text-lg font-bold text-purple-700">₹{item.storePrice}</div>
                      <div className="text-xs text-purple-600 mt-1">Available now</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Add to Cart
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      Find in Store
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">Total Savings</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              ${wishlistItems.reduce((sum, item) => sum + Math.abs(getSavings(item)), 0).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700">Items Available</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {wishlistItems.filter(item => item.availability !== 'online').length}/{wishlistItems.length}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-700">Avg Rating</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {(wishlistItems.reduce((sum, item) => sum + item.rating, 0) / wishlistItems.length).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistComparison;