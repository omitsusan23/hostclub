// ✅ 修正済み AdminProfilePage（全文）
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from '../context/AppContext';
import AvatarCropper from '../components/AvatarCropper';
import { uploadAvatar } from '../lib/uploadAvatar';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const {
    state: { session },
  } = useAppContext();

  const [displayName, setDisplayName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (!session?.user) navigate('/login');
  }, [session, navigate]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setUploading(true);

    const storeId = session?.user.user_metadata?.store_id;
    const userId = session?.user.id;

    if (!storeId || !userId || !croppedFile) {
      setError('情報が不足しています');
      setUploading(false);
      return;
    }

    try {
      const publicUrl = await uploadAvatar({ file: croppedFile, storeId, userId });
      setPhotoUrl(publicUrl);

      const insertPayload = {
        display_name: displayName,
        photo_url: publicUrl,
        auth_user_id: userId,
        is_active: true,
        store_id: storeId,
        email: session?.user.email,
        role: session?.user.user_metadata?.role,
      };

      console.log('💾 insert payload', insertPayload);

      const { error: insertError } = await supabase
        .from('admins')
        .insert(insertPayload);

      if (insertError) throw insertError;

      setSuccess('登録が完了しました');
      setTimeout(() => navigate('/tables'), 1500);
    } catch (err: any) {
      console.error(err);
      setError('登録またはアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleCropComplete = (file: File, previewUrl: string) => {
    setCroppedFile(file);
    setPhotoUrl(previewUrl);
    setShowCropper(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール登録</h1>
      <p className="text-gray-600 mb-4">管理者としての名前とアイコン画像を登録してください。</p>

      <input
        type="text"
        placeholder="表示名"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="border px-3 py-2 mb-2 w-64 rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {photoUrl && (
        <img
          src={photoUrl}
          alt="preview"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        onClick={handleSave}
        disabled={uploading || !croppedFile}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {uploading ? 'アップロード中...' : '登録する'}
      </button>

      {showCropper && imageSrc && (
        <AvatarCropper
          image={imageSrc}
          onCancel={() => setShowCropper(false)}
          onComplete={(file) => {
            const preview = URL.createObjectURL(file);
            handleCropComplete(file, preview);
          }}
        />
      )}
    </div>
  );
};

export default AdminProfilePage;