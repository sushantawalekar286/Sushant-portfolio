import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCertificate, FaImage } from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import { ListRowSkeleton } from '../../components/Skeleton.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import { Input } from '../../components/Input.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const CertificatesManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/certificates');
      if (response.data?.success && response.data.data) {
        setCertificates(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load certificates list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const openAddModal = () => {
    setEditingCert(null);
    setImageFile(null);
    reset({
      name: '',
      issuer: '',
      issueDate: '',
      credentialLink: '',
      verifyButton: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setImageFile(null);
    reset({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      credentialLink: cert.credentialLink,
      verifyButton: cert.verifyButton
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      const res = await axiosInstance.delete(`/certificates/${id}`);
      if (res.data?.success) {
        toast.success('Certificate deleted successfully');
        fetchCertificates();
      }
    } catch (error) {
      toast.error('Failed to delete certificate.');
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('issuer', data.issuer);
    formData.append('issueDate', data.issueDate);
    formData.append('credentialLink', data.credentialLink);
    formData.append('verifyButton', data.verifyButton);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let res;
      if (editingCert) {
        res = await axiosInstance.put(`/certificates/${editingCert._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axiosInstance.post('/certificates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data?.success) {
        toast.success(editingCert ? 'Certificate updated!' : 'Certificate created!');
        setIsModalOpen(false);
        fetchCertificates();
      }
    } catch (err) {
      toast.error('Failed to save certificate.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            Certificates Manager
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Display, add, modify, or remove licenses and certifications.
          </p>
        </div>
        <CustomButton variant="primary" icon={<FaPlus />} onClick={openAddModal}>
          Add Certificate
        </CustomButton>
      </div>

      {loading ? (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <ListRowSkeleton />
        </div>
      ) : certificates.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 font-semibold text-sm">
          No certificates found. Add your first certificate!
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Issuer</th>
                  <th className="py-4 px-6">Issue Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr 
                    key={cert._id}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/20 dark:hover:bg-dark-800/20"
                  >
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{cert.name}</td>
                    <td className="py-4 px-6 font-semibold text-slate-655 dark:text-slate-350">{cert.issuer}</td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-mono">{cert.issueDate}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cert)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cert._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CERTIFICATES ADD/EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-[90%] max-w-md bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl relative z-10 max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {editingCert ? 'Edit Certificate' : 'Add Certificate'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850">
                <FaTimes />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">
              
              <Input label="Certificate Name" placeholder="React Developer Certificate" error={errors.name?.message} {...register('name', { required: 'Required' })} />
              <Input label="Issuer Organization" placeholder="Meta / Coursera" error={errors.issuer?.message} {...register('issuer', { required: 'Required' })} />
              
              <div className="grid grid-cols-2 gap-5">
                <Input label="Issue Date" placeholder="October 2023" error={errors.issueDate?.message} {...register('issueDate', { required: 'Required' })} />
                <Input label="Verification link URL" placeholder="https://coursera.org/verify/..." {...register('credentialLink')} />
              </div>

              {/* Upload image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Certificate Image Proof</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-950 hover:bg-slate-100 dark:hover:bg-dark-850 cursor-pointer text-xs font-bold transition-all">
                    <FaImage className="text-primary-500" />
                    <span>Upload Proof</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {imageFile && (
                    <span className="text-xxs font-bold text-primary-500 truncate max-w-xs bg-primary-500/10 px-2 py-1 rounded-lg">
                      {imageFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Verify button active toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verify-checkbox"
                  {...register('verifyButton')}
                  className="w-4 h-4 text-primary-600 border-slate-350 dark:border-slate-800 rounded focus:ring-primary-500"
                />
                <label htmlFor="verify-checkbox" className="text-xs font-semibold uppercase tracking-wider text-slate-650 dark:text-slate-300">
                  Expose Verification buttons to public
                </label>
              </div>

              {/* Actions footer inside modal */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 justify-end">
                <CustomButton variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</CustomButton>
                <CustomButton type="submit" variant="primary">
                  {editingCert ? 'Update Certificate' : 'Create Certificate'}
                </CustomButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CertificatesManager;
