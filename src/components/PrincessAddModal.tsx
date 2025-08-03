import React, { useState } from 'react';
import { ModalNavigation } from './ModalNavigation';
import { BasicInfoSection } from './BasicInfoSection';
import { supabase } from '../lib/supabaseClient';
import { useStoreContext } from '../context/StoreContext';

interface PrincessAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrincessAddModal: React.FC<PrincessAddModalProps> = ({ isOpen, onClose }) => {
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

  // ESCで閉じる、左右の矢印キーを無効化
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // 左右の矢印キーでのフォーカス移動を無効化
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // フォームフィールドの更新
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const { currentStore } = useStoreContext();

  // 姫追加完了
  const handleRegister = async () => {
    // 名前が未入力の場合は登録しない
    if (!formData.name.trim()) {
      // TODO: 名前未入力のため登録できませんモーダルを表示
      console.log('名前が未入力のため登録できません');
      return;
    }

    try {
      // Supabaseに姫情報を保存
      const { data, error } = await supabase
        .from('princess_profiles')
        .insert({
          store_id: currentStore?.id,
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
          partner: formData.partner || null
        });

      if (error) {
        console.error('姫情報の登録に失敗しました:', error);
        return;
      }

      console.log('姫情報を登録しました:', data);
      onClose();
    } catch (error) {
      console.error('予期しないエラーが発生しました:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="princess-add-modal-title"
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
            <span className="text-xl font-bold">姫追加</span>
          </div>
        </div>
      </div>
      
      {/* Fixed Navigation - 戻ると登録 */}
      <ModalNavigation onBack={onClose} onComplete={handleRegister} completeText="登録" />
      
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

export default PrincessAddModal;