import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, Product } from '../lib/db';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, FileText, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { RichTextEditor } from '../components/RichTextEditor';

type UploadState = 'idle' | 'uploading' | 'done' | 'error';

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
    features: [''],
    isUnlocked: false,
    specSheet: ''
  });

  const [primaryUploadState, setPrimaryUploadState] = useState<UploadState>('idle');
  const [specSheetUploadState, setSpecSheetUploadState] = useState<UploadState>('idle');
  const [specSheetName, setSpecSheetName] = useState('');
  const primaryImageRef = useRef<HTMLInputElement>(null);
  const specSheetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    async function fetchProduct() {
      if (isEditing && id) {
        try {
          const products = await db.getProducts();
          const product = products.find(p => p.id === id);
          if (product) {
            setFormData(product);
            if (product.specSheet) {
              const parts = product.specSheet.split('%2F');
              const rawName = parts[parts.length - 1]?.split('?')[0] || 'spec-sheet.pdf';
              setSpecSheetName(decodeURIComponent(rawName));
            }
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

  const addFeature = () => setFormData(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
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

  const addImage = () => setFormData(prev => ({ ...prev, additionalImages: [...(prev.additionalImages || []), ''] }));
  const removeImage = (index: number) => {
    const newImages = [...(formData.additionalImages || [])];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, additionalImages: newImages }));
  };

  const uploadToFirebase = async (file: File, path: string): Promise<string> => {
    const { storage } = await import('../lib/firebase');
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const fileRef = ref(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handlePrimaryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPrimaryUploadState('uploading');
    try {
      const url = await uploadToFirebase(file, `products/images/${Date.now()}-${file.name}`);
      setFormData(prev => ({ ...prev, image: url }));
      setPrimaryUploadState('done');
    } catch {
      setPrimaryUploadState('error');
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToFirebase(file, `products/images/${Date.now()}-${file.name}`);
      handleImageChange(index, url);
    } catch {
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleSpecSheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }
    setSpecSheetUploadState('uploading');
    setSpecSheetName(file.name);
    try {
      const url = await uploadToFirebase(file, `products/specsheets/${Date.now()}-${file.name}`);
      setFormData(prev => ({ ...prev, specSheet: url }));
      setSpecSheetUploadState('done');
    } catch {
      setSpecSheetUploadState('error');
      alert('Failed to upload spec sheet. Please try again.');
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
      features: (formData.features || []).filter(f => f.trim() !== ''),
      isUnlocked: formData.isUnlocked || false,
      specSheet: formData.specSheet || undefined
    };

    if (isEditing) {
      await db.updateProduct(productData);
    } else {
      await db.saveProduct(productData);
    }
    navigate('/admin');
  };

  if (!user || user.role !== 'admin') return null;

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-2";
  const sectionClass = "bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{isEditing ? 'Update product details below' : 'Fill in the details to add a new product'}</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Basic Info */}
        <div className={sectionClass}>
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Basic Information</h2>

          <div>
            <label className={labelClass}>Product Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. VisionBay 4K Dome Camera" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>SKU</label>
              <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className={`${inputClass} font-mono`} placeholder="e.g. VB-4K-DOME-01" />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                <option value="CCTV Systems">CCTV Systems</option>
                <option value="IP Cameras">IP Cameras</option>
                <option value="NVR/DVR Recorders">NVR/DVR Recorders</option>
                <option value="Smart Alarms">Smart Alarms</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Condition</label>
              <select name="condition" value={formData.condition || 'New'} onChange={handleChange} className={inputClass}>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-colors w-full">
                <input
                  type="checkbox"
                  checked={!!formData.isUnlocked}
                  onChange={(e) => setFormData(prev => ({ ...prev, isUnlocked: e.target.checked }))}
                  className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">Direct Checkout</p>
                  <p className="text-xs text-slate-500">Skip inquiry process</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <p className="text-xs text-slate-400 mb-2">Use the toolbar to add bold, bullets, numbered lists and more.</p>
            <RichTextEditor
              value={formData.description || ''}
              onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
              placeholder="Describe the product — use the toolbar to format with bullets, bold text, headings and more..."
              minHeight="160px"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className={sectionClass}>
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Current Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} className={`${inputClass} pl-8 font-bold`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Original Price <span className="text-slate-400 font-normal">(optional — shows discount)</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                <input type="number" step="0.01" min="0" name="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} className={`${inputClass} pl-8`} placeholder="0.00" />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Image */}
        <div className={sectionClass}>
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Primary Product Image</h2>

          <div className="flex gap-4 flex-col sm:flex-row">
            {/* Upload area */}
            <button
              type="button"
              onClick={() => primaryImageRef.current?.click()}
              className="flex-shrink-0 w-full sm:w-40 h-40 rounded-2xl border-2 border-dashed border-slate-300 hover:border-orange-400 bg-slate-50 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-2xl mix-blend-multiply" />
              ) : (
                <>
                  <ImagePlus size={24} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs text-slate-500 group-hover:text-orange-500 font-medium text-center transition-colors">
                    {primaryUploadState === 'uploading' ? 'Uploading...' : 'Click to upload'}
                  </span>
                </>
              )}
            </button>
            <input
              ref={primaryImageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePrimaryImageUpload}
            />

            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Or paste image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
              {primaryUploadState === 'uploading' && (
                <div className="flex items-center gap-2 text-orange-500 text-sm">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  Uploading image...
                </div>
              )}
              {primaryUploadState === 'done' && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">✓</div>
                  Image uploaded successfully
                </div>
              )}
              {primaryUploadState === 'error' && (
                <p className="text-red-500 text-sm">Upload failed. Try again.</p>
              )}
              {formData.image && (
                <button
                  type="button"
                  onClick={() => { setFormData(prev => ({ ...prev, image: '' })); setPrimaryUploadState('idle'); }}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <X size={12} /> Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Images */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base">Additional Images <span className="text-slate-400 font-normal text-sm">(gallery)</span></h2>
            <button type="button" onClick={addImage} className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-semibold">
              <Plus size={15} /> Add Image
            </button>
          </div>

          <div className="space-y-4">
            {formData.additionalImages?.map((imgUrl, index) => (
              <div key={index} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  {imgUrl ? (
                    <img src={imgUrl} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                  ) : (
                    <ImagePlus size={18} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className={inputClass}
                    placeholder="Paste URL or upload file below"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`add-img-${index}`}
                      onChange={(e) => handleAdditionalImageUpload(e, index)}
                    />
                    <label
                      htmlFor={`add-img-${index}`}
                      className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 hover:text-orange-600 bg-white border border-slate-200 hover:border-orange-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Upload size={12} /> Choose from computer
                    </label>
                  </div>
                </div>
                <button type="button" onClick={() => removeImage(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Spec Sheet PDF */}
        <div className={sectionClass}>
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Spec Sheet (PDF)</h2>
          <p className="text-sm text-slate-500">Upload a PDF spec sheet. Customers will see a download button on the product page.</p>

          <div
            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer ${
              specSheetUploadState === 'uploading'
                ? 'border-orange-400 bg-orange-50'
                : formData.specSheet
                ? 'border-green-400 bg-green-50'
                : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50 bg-slate-50'
            }`}
            onClick={() => specSheetRef.current?.click()}
          >
            <input
              ref={specSheetRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleSpecSheetUpload}
            />

            {specSheetUploadState === 'uploading' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-orange-600 font-semibold text-sm">Uploading {specSheetName}...</p>
              </div>
            ) : formData.specSheet ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{specSheetName || 'spec-sheet.pdf'}</p>
                    <a href={formData.specSheet} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 hover:underline" onClick={e => e.stopPropagation()}>
                      Preview PDF
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData(prev => ({ ...prev, specSheet: '' }));
                    setSpecSheetName('');
                    setSpecSheetUploadState('idle');
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <FileText size={22} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 text-sm">Click to upload spec sheet</p>
                  <p className="text-xs text-slate-400 mt-1">PDF files only · Max 10MB</p>
                </div>
              </div>
            )}
          </div>

          {specSheetUploadState === 'error' && (
            <p className="text-red-500 text-sm">Upload failed. Please try again.</p>
          )}
        </div>

        {/* Features */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base">Product Features</h2>
            <button type="button" onClick={addFeature} className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-semibold">
              <Plus size={15} /> Add Feature
            </button>
          </div>
          <div className="space-y-3">
            {formData.features?.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 4K Ultra HD Resolution with Night Vision"
                />
                <button type="button" onClick={() => removeFeature(index)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link to="/admin" className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 text-sm shadow-md shadow-orange-200/50"
          >
            <Save size={17} />
            {isEditing ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
