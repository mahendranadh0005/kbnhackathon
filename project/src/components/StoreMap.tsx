import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Star, Zap } from 'lucide-react';
import { Product } from '../types';

interface StoreMapProps {
  selectedProduct: Product | null;
}

const StoreMap: React.FC<StoreMapProps> = ({ selectedProduct }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const storeSections = [
    { id: 'entrance', name: 'Entrance', x: 10, y: 85, color: 'bg-blue-500' },
    { id: 'produce', name: 'Produce', x: 20, y: 20, color: 'bg-green-500' },
    { id: 'dairy', name: 'Dairy', x: 80, y: 20, color: 'bg-yellow-500' },
    { id: 'bakery', name: 'Bakery', x: 50, y: 15, color: 'bg-orange-500' },
    { id: 'meat', name: 'Meat & Seafood', x: 20, y: 50, color: 'bg-red-500' },
    { id: 'frozen', name: 'Frozen Foods', x: 80, y: 50, color: 'bg-cyan-500' },
    { id: 'clothing', name: 'Clothing', x: 20, y: 80, color: 'bg-purple-500' },
    { id: 'electronics', name: 'Electronics', x: 80, y: 80, color: 'bg-indigo-500' },
    { id: 'pharmacy', name: 'Pharmacy', x: 50, y: 85, color: 'bg-pink-500' },
    { id: 'checkout', name: 'Checkout', x: 50, y: 95, color: 'bg-gray-500' }
  ];

  const getProductSection = (location: string) => {
    const locationMap: { [key: string]: string } = {
      'Aisle 1A': 'produce',
      'Aisle 5B': 'dairy',
      'Aisle 3C': 'meat',
      'Aisle 7D': 'frozen',
      'Section C2': 'clothing',
      'Section E1': 'electronics'
    };
    return locationMap[location] || 'entrance';
  };

  const currentSection = selectedProduct ? getProductSection(selectedProduct.location) : null;

  return (
    <div className="space-y-6">
      {/* Store Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Store Map & Navigation</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>6:00 AM - 11:00 PM</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </div>
          </div>
        </div>

        {selectedProduct && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <Navigation className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Navigating to: {selectedProduct.name}</h3>
                <p className="text-sm text-gray-600">{selectedProduct.location} • {selectedProduct.directions}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Store Layout</h3>
        
        <div className="relative bg-gray-100 rounded-lg" style={{ height: '400px' }}>
          {/* Map Grid */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 p-2">
            {Array.from({ length: 144 }, (_, i) => (
              <div key={i} className="bg-white rounded-sm opacity-50" />
            ))}
          </div>

          {/* Store Sections */}
          {storeSections.map((section) => (
            <div
              key={section.id}
              className={`absolute w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transform transition-all duration-200 ${
                section.color
              } ${
                activeSection === section.id ? 'scale-110 shadow-lg' : 'hover:scale-105'
              } ${
                currentSection === section.id ? 'ring-4 ring-yellow-400 animate-pulse' : ''
              }`}
              style={{ left: `${section.x}%`, top: `${section.y}%` }}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="text-white text-xs font-medium text-center">
                {section.name}
              </span>
            </div>
          ))}

          {/* Path indicator for selected product */}
          {selectedProduct && currentSection && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <path
                  d={`M ${10 * 4} ${85 * 4} Q ${50 * 4} ${70 * 4} ${storeSections.find(s => s.id === currentSection)?.x! * 4} ${storeSections.find(s => s.id === currentSection)?.y! * 4}`}
                  stroke="#3B82F6"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
          {storeSections.map((section) => (
            <div key={section.id} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded ${section.color}`} />
              <span className="text-sm text-gray-700">{section.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Find Products</h4>
              <p className="text-sm text-gray-600">Search for item locations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Express Checkout</h4>
              <p className="text-sm text-gray-600">Skip the line</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Customer Service</h4>
              <p className="text-sm text-gray-600">Get help from staff</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMap;