'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Tag,
  Sparkles,
  Check,
  X,
  Link2,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  Building2,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { Property } from '@/types';

interface PropertiesViewProps {
  properties: Property[];
  onRefresh: () => void;
  api: any;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({ properties, onRefresh, api }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [viewingDetailsProperty, setViewingDetailsProperty] = useState<Property | null>(null);
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCopyBookingLink = (propertyId: string) => {
    const bookingUrl = `${window.location.origin}/book/${propertyId}`;
    navigator.clipboard.writeText(bookingUrl);
    setCopiedId(propertyId);
    toast.success('Client booking link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Add Form State
  const initialFormState = {
    title: '',
    description: '',
    price: 350000,
    type: 'Sale',
    propertyType: 'Apartment',
    status: 'Available',
    city: 'Miami',
    street: 'Central Avenue',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    images: [] as string[]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editFormData, setEditFormData] = useState(initialFormState);

  const filtered = properties.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.address?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle Create Property
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createProperty({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type,
        propertyType: formData.propertyType,
        status: formData.status,
        address: { city: formData.city, street: formData.street || 'Central Avenue', zipCode: '10001' },
        specs: {
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          areaSqFt: Number(formData.areaSqFt)
        },
        images: formData.images
      });
      setShowAddModal(false);
      setFormData(initialFormState);
      toast.success('Property listing created successfully!');
      onRefresh();
    } catch (err: any) {
      console.error('Error creating property:', err);
      toast.error(err.message || 'Error creating property');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal with selected property data
  const handleOpenEdit = (property: Property) => {
    setEditingProperty(property);
    setEditFormData({
      title: property.title,
      description: property.description || '',
      price: property.price,
      type: property.type,
      propertyType: property.propertyType,
      status: property.status,
      city: property.address?.city || '',
      street: property.address?.street || '',
      bedrooms: property.specs?.bedrooms || 1,
      bathrooms: property.specs?.bathrooms || 1,
      areaSqFt: property.specs?.areaSqFt || 0,
      images: property.images || []
    });
  };

  // Handle Update Property
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    setIsSubmitting(true);
    try {
      await api.updateProperty(editingProperty._id, {
        title: editFormData.title,
        description: editFormData.description,
        price: Number(editFormData.price),
        type: editFormData.type,
        propertyType: editFormData.propertyType,
        status: editFormData.status,
        address: {
          ...editingProperty.address,
          city: editFormData.city,
          street: editFormData.street
        },
        specs: {
          bedrooms: Number(editFormData.bedrooms),
          bathrooms: Number(editFormData.bathrooms),
          areaSqFt: Number(editFormData.areaSqFt)
        },
        images: editFormData.images
      });
      setEditingProperty(null);
      toast.success('Property updated successfully!');
      onRefresh();
    } catch (err: any) {
      console.error('Error updating property:', err);
      toast.error(err.message || 'Error updating property');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Property
  const handleDelete = async () => {
    if (!deletingProperty) return;
    setIsSubmitting(true);
    try {
      await api.deleteProperty(deletingProperty._id);
      setDeletingProperty(null);
      if (viewingDetailsProperty?._id === deletingProperty._id) {
        setViewingDetailsProperty(null);
      }
      toast.success('Property deleted successfully!');
      onRefresh();
    } catch (err: any) {
      console.error('Error deleting property:', err);
      toast.error(err.message || 'Error deleting property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Property Listings</h2>
          <p className="text-slate-400 text-sm">
            Manage your real estate portfolio, edit details, and copy booking links.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData(initialFormState);
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700">
            {['All', 'Sale', 'Rent'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  filterType === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700">
            {['All', 'Available', 'Under Offer', 'Sold/Let'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  filterStatus === s
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((property) => (
          <div
            key={property._id}
            className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setViewingDetailsProperty(property)}>
                <img
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md force-white ${
                    property.status === 'Available'
                      ? 'bg-emerald-500/90 text-white'
                      : property.status === 'Under Offer'
                      ? 'bg-amber-500/90 text-white'
                      : 'bg-rose-500/90 text-white'
                  }`}>
                    {property.status}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-600/90 text-white shadow-md backdrop-blur-md force-white">
                    {property.type}
                  </span>
                </div>

                {/* Quick Action Overlay (View, Edit, Delete) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingDetailsProperty(property);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-slate-200 hover:text-white backdrop-blur-md transition-colors"
                    title="View Full Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(property);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-blue-300 hover:text-blue-100 backdrop-blur-md transition-colors"
                    title="Edit Property"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingProperty(property);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600/80 text-rose-300 hover:text-white backdrop-blur-md transition-colors"
                    title="Delete Property"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-white">
                    ${property.price?.toLocaleString()}
                    {property.type === 'Rent' && <span className="text-xs font-normal text-slate-400">/mo</span>}
                  </span>
                  <span className="text-xs text-blue-400 font-medium">
                    {property.propertyType}
                  </span>
                </div>

                <h3
                  onClick={() => setViewingDetailsProperty(property)}
                  className="font-semibold text-slate-100 text-base line-clamp-1 group-hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {property.title}
                </h3>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {property.address?.city || 'Location'}, {property.address?.state || 'USA'}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-slate-500" />
                    <span>{property.specs?.bedrooms || 0} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-slate-500" />
                    <span>{property.specs?.bathrooms || 0} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-slate-500" />
                    <span>{property.specs?.areaSqFt || 0} sqft</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Booking Link & Details Action Bar */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">ID: {property._id?.slice(-6)}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyBookingLink(property._id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    copiedId === property._id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                  title="Copy shareable link for clients to book viewings"
                >
                  {copiedId === property._id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Link Copied!
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" /> Booking Link
                    </>
                  )}
                </button>
                <a
                  href={`/book/${property._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-slate-400 hover:text-white"
                  title="Preview client booking page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No properties found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new property listing.
          </p>
        </div>
      )}

      {/* ==================== 1. ADD PROPERTY MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Add New Property</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Sunset Penthouse"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Listing Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold/Let">Sold/Let</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">SqFt</label>
                  <input
                    type="number"
                    value={formData.areaSqFt}
                    onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Photo Upload Zone */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Property Photos</label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                    if (files.length === 0) return;
                    setUploading(true);
                    try {
                      const res = await api.uploadImages(files);
                      if (res.urls && res.urls.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, ...res.urls]
                        }));
                      }
                    } catch (err) {
                      console.error('Failed to upload dropped files:', err);
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-800/40 relative"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={async (e) => {
                      if (!e.target.files) return;
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;
                      setUploading(true);
                      try {
                        const res = await api.uploadImages(files);
                        if (res.urls && res.urls.length > 0) {
                          setFormData(prev => ({
                            ...prev,
                            images: [...prev.images, ...res.urls]
                          }));
                        }
                      } catch (err) {
                        console.error('Failed to upload selected files:', err);
                      } finally {
                        setUploading(false);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-blue-400 font-medium py-1">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading to media server...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-slate-300 font-medium">
                        Drag & Drop photos here or <span className="text-blue-400 underline">Browse files</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        High-resolution JPG, PNG, WEBP, AVIF (Up to 10MB each)
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Previews */}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group w-16 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="absolute top-0.5 right-0.5 bg-black/70 text-rose-400 p-0.5 rounded-full hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
                >
                  {isSubmitting ? 'Saving...' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 2. EDIT PROPERTY MODAL ==================== */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-lg text-white">Edit Property</h3>
              </div>
              <button onClick={() => setEditingProperty(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Listing Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value as any })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold/Let">Sold/Let</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Property Type</label>
                  <select
                    value={editFormData.propertyType}
                    onChange={(e) => setEditFormData({ ...editFormData, propertyType: e.target.value as any })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={editFormData.bedrooms}
                    onChange={(e) => setEditFormData({ ...editFormData, bedrooms: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={editFormData.bathrooms}
                    onChange={(e) => setEditFormData({ ...editFormData, bathrooms: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">SqFt</label>
                  <input
                    type="number"
                    value={editFormData.areaSqFt}
                    onChange={(e) => setEditFormData({ ...editFormData, areaSqFt: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Photos Edit Zone */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Manage Photos</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-800/40 relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={async (e) => {
                      if (!e.target.files) return;
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;
                      setUploading(true);
                      try {
                        const res = await api.uploadImages(files);
                        if (res.urls && res.urls.length > 0) {
                          setEditFormData(prev => ({
                            ...prev,
                            images: [...prev.images, ...res.urls]
                          }));
                        }
                      } catch (err) {
                        console.error('Failed to upload images:', err);
                      } finally {
                        setUploading(false);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-blue-400 font-medium py-1">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading new photos...</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-300 font-medium">
                      + Add more photos <span className="text-blue-400 underline">Browse</span>
                    </div>
                  )}
                </div>

                {/* Existing Images */}
                {editFormData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {editFormData.images.map((img, idx) => (
                      <div key={idx} className="relative group w-16 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setEditFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="absolute top-0.5 right-0.5 bg-black/70 text-rose-400 p-0.5 rounded-full hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
                >
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 3. DELETE CONFIRMATION MODAL ==================== */}
      {deletingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Delete Property?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-white">"{deletingProperty.title}"</span>? All booking links and associated viewing data will be removed.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingProperty(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-rose-600/30"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. FULL DETAILS DRAWER / MODAL ==================== */}
      {viewingDetailsProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    viewingDetailsProperty.status === 'Available'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {viewingDetailsProperty.status}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {viewingDetailsProperty.type}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-white">{viewingDetailsProperty.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {viewingDetailsProperty.address?.street}, {viewingDetailsProperty.address?.city}, {viewingDetailsProperty.address?.state || 'USA'}
                </p>
              </div>
              <button onClick={() => setViewingDetailsProperty(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Gallery in Details */}
            {viewingDetailsProperty.images && viewingDetailsProperty.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {viewingDetailsProperty.images.map((img, i) => (
                  <div key={i} className="h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-800">
                    <img src={img} alt="Property" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 text-xs border border-slate-800">
                No photos uploaded for this property
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-500 block">Listing Price</span>
                <span className="text-lg font-bold text-white">${viewingDetailsProperty.price?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Type</span>
                <span className="text-sm font-semibold text-slate-200">{viewingDetailsProperty.propertyType}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Bedrooms / Baths</span>
                <span className="text-sm font-semibold text-slate-200">
                  {viewingDetailsProperty.specs?.bedrooms} Beds / {viewingDetailsProperty.specs?.bathrooms} Baths
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Area</span>
                <span className="text-sm font-semibold text-slate-200">{viewingDetailsProperty.specs?.areaSqFt} sqft</span>
              </div>
            </div>

            {/* Booking Link Bar */}
            <div className="p-3.5 bg-blue-950/30 border border-blue-900/50 rounded-xl flex items-center justify-between gap-3">
              <div className="text-xs">
                <div className="font-semibold text-blue-300">Public Booking Link</div>
                <div className="text-slate-400 text-[11px]">Share this direct link with clients to book self-serve viewing slots.</div>
              </div>
              <button
                onClick={() => handleCopyBookingLink(viewingDetailsProperty._id)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                {copiedId === viewingDetailsProperty._id ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </button>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const prop = viewingDetailsProperty;
                  setViewingDetailsProperty(null);
                  setDeletingProperty(prop);
                }}
                className="px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Property
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const prop = viewingDetailsProperty;
                    setViewingDetailsProperty(null);
                    handleOpenEdit(prop);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Property
                </button>
                <button
                  type="button"
                  onClick={() => setViewingDetailsProperty(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
