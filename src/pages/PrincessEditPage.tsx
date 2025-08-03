import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';
import { ModalNavigation } from '../components/ModalNavigation';
import { BasicInfoSection } from '../components/BasicInfoSection';

interface PrincessEditPageData {
  id: string;
  name: string;
  line_name?: string;
  attribute?: string;
  age?: number;
  birth_year?: number;
  birth_date?: string;
  current_residence?: string;
  birthplace?: string;
  blood_type?: string;
  occupation?: string;
  contact_time?: string;
  favorite_drink?: string;
  favorite_cigarette?: string;
  bottle_name?: string;
  favorite_help?: string;
  hobby?: string;
  specialty?: string;
  holiday?: string;
  favorite_brand?: string;
  marriage?: string;
  children?: string;
  partner?: string;
}

const PrincessEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    lineName: '',
    attribute: '',
    age: '',
    birthYear: '',
    birthDate: '',
    currentResidence: '',
    birthplace: '',
    bloodType: '',
    occupation: '',
    contactTime: '',
    favoriteDrink: '',
    favoriteCigarette: '',
    bottleName: '',
    favoriteHelp: '',
    hobby: '',
    specialty: '',
    holiday: '',
    favoriteBrand: '',
    marriage: '',
    children: '',
    partner: ''
  });

  useEffect(() => {
    fetchPrincessData();
  }, [id]);

  const fetchPrincessData = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('princess_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching princess data:', error);
        navigate('/princess-page');
        return;
      }

      if (data) {
        // データベースのフィールド名をフォームのフィールド名にマッピング
        setFormData({
          name: data.name || '',
          lineName: data.line_name || '',
          attribute: data.attribute || '',
          age: data.age?.toString() || '',
          birthYear: data.birth_year?.toString() || '',
          birthDate: data.birth_date || '',
          currentResidence: data.current_residence || '',
          birthplace: data.birthplace || '',
          bloodType: data.blood_type || '',
          occupation: data.occupation || '',
          contactTime: data.contact_time || '',
          favoriteDrink: data.favorite_drink || '',
          favoriteCigarette: data.favorite_cigarette || '',
          bottleName: data.bottle_name || '',
          favoriteHelp: data.favorite_help || '',
          hobby: data.hobby || '',
          specialty: data.specialty || '',
          holiday: data.holiday || '',
          favoriteBrand: data.favorite_brand || '',
          marriage: data.marriage || '',
          children: data.children || '',
          partner: data.partner || ''
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    // 名前が未入力の場合は更新しない
    if (!formData.name.trim()) {
      console.log('名前が未入力のため更新できません');
      return;
    }

    try {
      const { error } = await supabase
        .from('princess_profiles')
        .update({
          name: formData.name,
          line_name: formData.lineName || null,
          attribute: formData.attribute || null,
          age: formData.age ? parseInt(formData.age) : null,
          birth_year: formData.birthYear ? parseInt(formData.birthYear) : null,
          birth_date: formData.birthDate || null,
          current_residence: formData.currentResidence || null,
          birthplace: formData.birthplace || null,
          blood_type: formData.bloodType || null,
          occupation: formData.occupation || null,
          contact_time: formData.contactTime || null,
          favorite_drink: formData.favoriteDrink || null,
          favorite_cigarette: formData.favoriteCigarette || null,
          bottle_name: formData.bottleName || null,
          favorite_help: formData.favoriteHelp || null,
          hobby: formData.hobby || null,
          specialty: formData.specialty || null,
          holiday: formData.holiday || null,
          favorite_brand: formData.favoriteBrand || null,
          marriage: formData.marriage || null,
          children: formData.children || null,
          partner: formData.partner || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('姫情報の更新に失敗しました:', error);
        return;
      }

      console.log('姫情報を更新しました');
      navigate(`/princess/${id}`);
    } catch (error) {
      console.error('予期しないエラーが発生しました:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigate(-1);
    }
    // 左右の矢印キーでのフォーカス移動を無効化
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-white">読み込み中...</div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="princess-edit-modal-title"
      className="fixed inset-0 z-[200]"
      onKeyDown={handleKeyDown}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Top black area with checked label */}
      <div className="absolute top-0 left-0 right-0 bg-black" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-center py-5">
          <div className="flex items-center text-white">
            <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold">姫編集</span>
          </div>
        </div>
      </div>
      
      {/* Fixed Navigation - 戻ると更新 */}
      <ModalNavigation 
        onBack={() => navigate(-1)} 
        onComplete={handleUpdate} 
        completeText="更新" 
      />
      
      {/* Modal content - full screen from navigation bar */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+64px)] bottom-0 left-0 right-0 bg-black overflow-y-auto">
        <div className="flex flex-col w-[361px] items-start gap-4 mx-auto p-4 pb-8">
          {/* Form Fields */}
          <div className="flex flex-col items-start gap-2 self-stretch">
            <BasicInfoSection 
              formData={formData}
              onChange={handleFieldChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincessEditPage;