import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, Product } from '../lib/db';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminProductForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'CCTV Systems',
    condition: 'New',
    price: 0,
    originalPrice: 0,
    image: '',
    additionalImages: [''],
    description: '',
    features: ['']
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    async function fetchProduct() {
      if (isEditing && id) {
        try {
          const products = await db.getProducts();
          const product = products.find(p => p.id === id);
          if (product) {
            setFormData(product);
          } else {
            navigate('/admin');
          }
        } catch (e) {
          console.error("Failed to load product for editing:", e);
        }
      }
    }
    fetchProduct();
  }, [user, navigate, isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.additionalImages || [])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, additionalImages: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, additionalImages: [...(prev.additionalImages || []), ''] }));
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.additionalImages || [])];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, additionalImages: newImages }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { storage } = await import('../lib/firebase');
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

        const fileRef = ref(storage, `products/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        if (typeof index === 'number') {
          handleImageChange(index, downloadURL);
        } else {
          setFormData(prev => ({ ...prev, image: downloadURL }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Product = {
      id: isEditing && id ? id : `prod-${Date.now()}`,
      name: formData.name || '',
      sku: formData.sku || '',
      category: formData.category || 'CCTV Systems',
      condition: formData.condition || 'New',
      price: formData.price || 0,
      originalPrice: formData.originalPrice || undefined,
      image: formData.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
      additionalImages: (formData.additionalImages || []).filter(img => img.trim() !== ''),
      description: formData.description || '',
      features: (formData.features || []).filter(f => f.trim() !== '')
    };

    if (isEditing) {
      await db.updateProduct(productData);
    } else {
      await db.saveProduct(productData);
    }

    navigate('/admin');
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-4">
        <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Product Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">SKU</label>
            <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all appearance-none">
              <option value="CCTV Systems">CCTV Systems</option>
              <option value="IP Cameras">IP Cameras</option>
              <option value="NVR/DVR Recorders">NVR/DVR Recorders</option>
              <option value="Smart Alarms">Smart Alarms</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Condition</label>
            <select required name="condition" value={formData.condition || 'New'} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all appearance-none">
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Discounted Price (Current Price)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500">$</span>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-bold" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Original Price (Optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500">$</span>
              <input type="number" step="0.01" name="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Primary Product Image</label>
            <div className="flex gap-2">
              <input required type="text" name="image" value={formData.image} onChange={handleChange} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" placeholder="URL or Base64..." />
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" id="primary-image-upload" />
              <label htmlFor="primary-image-upload" className="cursor-pointer bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center whitespace-nowrap border border-slate-200">
                Upload File
              </label>
            </div>
            {formData.image && (
              <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
              </div>
            )}
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
              Additional Images (Gallery)
              <button type="button" onClick={addImage} className="text-orange-500 hover:text-orange-600 text-sm font-bold">+ Add Image</button>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.additionalImages?.map((imgUrl, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
                        placeholder="URL or Base64..."
                      />
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="hidden" id={`additional-img-${index}`} />
                      <label htmlFor={`additional-img-${index}`} className="cursor-pointer bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center whitespace-nowrap border border-slate-200">
                        Upload
                      </label>
                    </div>
                    {imgUrl && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                        <img src={imgUrl} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => removeImage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
              Features
              <button type="button" onClick={addFeature} className="text-orange-500 hover:text-orange-600 text-sm font-bold">+ Add Feature</button>
            </label>
            {formData.features?.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="e.g., 4K Ultra HD Resolution"
                />
                <button type="button" onClick={() => removeFeature(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
          <Link to="/admin" className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2">
            <Save size={20} />
            Save Product
          </button>
        </div>
      </motion.form>
    </div>
  );
}
