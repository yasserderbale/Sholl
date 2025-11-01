import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SchoolSettings {
  schoolNameFr: string;
  schoolNameAr: string;
  address: string;
  phone: string;
  email: string;
}

interface SchoolContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: SchoolSettings) => void;
  loading: boolean;
  clearSettings: () => void;
}

const defaultSettings: SchoolSettings = {
  schoolNameFr: "Al Amal Private School",
  schoolNameAr: "مدرسة الأمل الخاصة", 
  address: "الجزائر العاصمة",
  phone: "+213 21 12 34 56",
  email: "contact@alamal.dz"
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

interface SchoolProviderProps {
  children: ReactNode;
}

export const SchoolProvider: React.FC<SchoolProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // تحميل الإعدادات من قاعدة البيانات
  const loadSettings = async () => {
    try {
      // أولاً، جرب تحميل من localStorage
      const savedSettings = localStorage.getItem('schoolSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        } catch (e) {
          console.log('خطأ في قراءة الإعدادات المحفوظة محلياً');
        }
      }

      // ثم جرب تحميل من قاعدة البيانات
      const token = localStorage.getItem('token');
      if (!token) {
        // إذا لم يكن هناك token، استخدم الإعدادات المحفوظة محلياً أو الافتراضية
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.StatusCode === 200 && data.data) {
          setSettings(data.data);
          // احفظ في localStorage للمرة القادمة
          localStorage.setItem('schoolSettings', JSON.stringify(data.data));
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل إعدادات المدرسة:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث الإعدادات
  const updateSettings = (newSettings: SchoolSettings) => {
    setSettings(newSettings);
    // احفظ في localStorage أيضاً
    localStorage.setItem('schoolSettings', JSON.stringify(newSettings));
  };

  // مسح الإعدادات (عند تسجيل الخروج)
  const clearSettings = () => {
    localStorage.removeItem('schoolSettings');
    setSettings(defaultSettings);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const value: SchoolContextType = {
    settings,
    updateSettings,
    loading,
    clearSettings
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
