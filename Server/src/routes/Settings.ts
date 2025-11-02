import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import { getSettings, updateSettings, createSettings } from "../models/sqlite/SettingsModel";

const route = express.Router();

// GET /settings/test - اختبار بدون authentication
route.get("/settings/test", async (req: any, res: any) => {
  try {
    return res.status(200).json({
      StatusCode: 200,
      data: "Settings API is working!"
    });
  } catch (error) {
    return res.status(500).json({
      StatusCode: 500,
      data: "خطأ في الخادم"
    });
  }
});

// GET /settings - الحصول على الإعدادات
route.get("/settings", validatejwt, async (req: any, res: any) => {
  try {
    const identifiante = (req as any).payload;
    
    if (!identifiante) {
      return res.status(401).json({
        StatusCode: 401,
        data: "غير مصرح بالوصول"
      });
    }

    const settings = getSettings();
    
    if (!settings) {
      return res.status(404).json({
        StatusCode: 404,
        data: "لم يتم العثور على الإعدادات"
      });
    }

    return res.status(200).json({
      StatusCode: 200,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({
      StatusCode: 500,
      data: "خطأ في الخادم"
    });
  }
});

// PUT /settings - تحديث الإعدادات
route.put("/settings", validatejwt, async (req: any, res: any) => {
  try {
    const identifiante = (req as any).payload;
    
    if (!identifiante) {
      return res.status(401).json({
        StatusCode: 401,
        data: "غير مصرح بالوصول"
      });
    }

    const {
      schoolNameFr,
      schoolNameAr,
      address,
      phone,
      email,
      logo
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!schoolNameFr && !schoolNameAr && !address && !phone && !email) {
      return res.status(400).json({
        StatusCode: 400,
        data: "يجب توفير بيانات للتحديث"
      });
    }

    const success = updateSettings({
      schoolNameFr,
      schoolNameAr,
      address,
      phone,
      email,
      logo
    });

    if (success) {
      const updatedSettings = getSettings();
      return res.status(200).json({
        StatusCode: 200,
        data: updatedSettings,
        message: "تم تحديث الإعدادات بنجاح"
      });
    } else {
      return res.status(500).json({
        StatusCode: 500,
        data: "فشل في تحديث الإعدادات"
      });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({
      StatusCode: 500,
      data: "خطأ في الخادم"
    });
  }
});

// POST /settings - إنشاء إعدادات جديدة
route.post("/settings", validatejwt, async (req: any, res: any) => {
  try {
    const identifiante = (req as any).payload;
    
    if (!identifiante) {
      return res.status(401).json({
        StatusCode: 401,
        data: "غير مصرح بالوصول"
      });
    }

    const {
      schoolNameFr,
      schoolNameAr,
      address,
      phone,
      email,
      logo
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!schoolNameFr || !schoolNameAr || !address || !phone || !email) {
      return res.status(400).json({
        StatusCode: 400,
        data: "جميع الحقول مطلوبة"
      });
    }

    const settingsId = createSettings({
      schoolNameFr,
      schoolNameAr,
      address,
      phone,
      email,
      logo
    });

    if (settingsId) {
      const newSettings = getSettings();
      return res.status(201).json({
        StatusCode: 201,
        data: newSettings,
        message: "تم إنشاء الإعدادات بنجاح"
      });
    } else {
      return res.status(500).json({
        StatusCode: 500,
        data: "فشل في إنشاء الإعدادات"
      });
    }
  } catch (error) {
    console.error('Error creating settings:', error);
    return res.status(500).json({
      StatusCode: 500,
      data: "خطأ في الخادم"
    });
  }
});

export default route;
