import { useState, useRef } from 'react';
import { useAuth } from '../context/authContext';
import { storage, db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Edit2, Loader, Save, AlertCircle } from 'lucide-react';

const AvatarUpload = ({ onUploadComplete }) => {
  const { usuarioActual } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(usuarioActual?.photoURL || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setIsUploading(true);
    setError(null);

    try {
      const fileRef = ref(storage, `avatares/${usuarioActual.uid}/${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(uploadResult.ref);

      const userDocRef = doc(db, 'usuarios', usuarioActual.uid);
      await updateDoc(userDocRef, { photoURL });
      
      if (onUploadComplete) {
        onUploadComplete(photoURL);
      }

    } catch (err) {
      console.error("Error al subir la imagen:", err);
      setError('Error al subir la imagen. Por favor, inténtalo de nuevo.');
      // Revert preview if upload fails
      setImagePreview(usuarioActual?.photoURL || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group w-32 h-32">
        <img
          src={imagePreview || 'https://via.placeholder.com/128'}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <button
          onClick={handleFileSelect}
          disabled={isUploading}
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {isUploading ? (
            <Loader className="animate-spin" />
          ) : (
            <Edit2 size={24} />
          )}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100 p-2 rounded-md">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
