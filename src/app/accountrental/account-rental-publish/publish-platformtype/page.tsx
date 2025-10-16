'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Textarea, NumberInput, Label, AlertModal } from '@/components/ui';
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';

// 定义抖音账号租赁表单类型
interface DouyinAccountRentalForm {
  // 基础信息
  accountTitle: string;
  region: string;
  accountAge: string;
  accountImages: File[];
  accountVideo?: File | null;
  
  // 商品信息
  price: number;
  rentalDuration: number;

}


export default function DouyinAccountRentalPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DouyinAccountRentalForm>({
    // 基础信息
    accountTitle: '',
    region: 'national',
    accountAge: '3-6',
    accountImages: [],
    accountVideo: null,
    
    // 商品信息
    price: 50, // 默认价格改为50元/天
    rentalDuration: 1 // 默认1天
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: null as React.ReactNode | null
  });

  // 显示通用提示框
  const showAlert = (title: string, message: string, isSuccess: boolean) => {
    setAlertConfig({ 
      title, 
      message, 
      icon: isSuccess ? <CheckCircleOutlined className="text-green-500 text-2xl" /> : <CloseCircleOutlined className="text-red-500 text-2xl" /> 
    });
    setShowAlertModal(true);
  };

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 基础信息验证
    if (!formData.accountTitle.trim()) {
      newErrors.accountTitle = '请输入账号标题';
    } else if (formData.accountTitle.length < 5 || formData.accountTitle.length > 300) {
      newErrors.accountTitle = '账号标题长度需在5-300个字符之间';
    }
    
    if (formData.accountImages.length === 0) {
      newErrors.accountImages = '请至少上传一张账号截图';
    }
    
    // 商品信息验证
    if (formData.price <= 0) {
      newErrors.price = '价格必须大于0';
    }
    
    if (formData.rentalDuration <= 0) {
      newErrors.rentalDuration = '租赁时长必须大于0';
    }
    

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string | number | boolean | File | null) => {
    // 允许用户在输入过程中删除内容至空值
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 处理输入框失焦事件 - 当用户离开输入框后，自动填充默认值
  const handleBlur = (field: string, defaultValue: number) => {
    setFormData(prev => {
      const currentValue = prev[field as keyof DouyinAccountRentalForm];
      // 如果值为空或小于等于0，则使用默认值
      if (currentValue === '' || currentValue === null || currentValue === undefined || (typeof currentValue === 'number' && currentValue <= 0)) {
        return {
          ...prev,
          [field]: defaultValue
        };
      }
      return prev;
    });
  };

  // 处理多张图片上传
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const remainingSlots = 6 - formData.accountImages.length; // 最多支持6张图片
      const filesToAdd = newFiles.slice(0, remainingSlots);
      
      setFormData(prev => ({
        ...prev,
        accountImages: [...prev.accountImages, ...filesToAdd]
      }));
    }
    
    // 清除文件输入，允许重复选择相同的文件
    if (e.target) {
      e.target.value = '';
    }
  };

  // 删除图片
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accountImages: prev.accountImages.filter((_, i) => i !== index)
    }));
  };

  // 获取图片的URL用于预览
  const getImagePreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // 表单提交
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // 模拟表单提交
      console.log('提交的表单数据:', formData);
      
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showAlert('发布成功', '抖音账号租赁信息已成功发布', true);
      // 发布成功后跳转到账号租赁市场页面
      setTimeout(() => {
        router.push('/accountrental/account-rental-market');
      }, 2000);
    } catch (err) {
        showAlert('发布失败', err instanceof Error ? err.message : '发布失败，请稍后重试', false);
      }
    };

    // 计算总价
    const calculateTotalPrice = () => {
      return (formData.price * formData.rentalDuration).toFixed(2);
    };

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 py-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <CheckCircleOutlined className="text-xl text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">抖音账号租赁信息发布</h3>
              <p className="text-blue-700 text-sm">填写抖音账号租赁的详细信息，完成发布。请确保信息真实有效，以便更快地匹配需求。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 表单区域 */}
      <div className="px-4 py-6">
        {/* 表单内容 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-5">
          {/* 基础信息 */}
          <div className="space-y-6 mb-5">  
            <div className="space-y-4">
              {/* 账号标题 - 修改为多行文本框 */}
              <div className="space-y-2">
                <Label htmlFor="accountTitle" required>账号信息</Label>
                <Textarea
                  id="accountTitle"
                  value={formData.accountTitle}
                  onChange={(e) => handleInputChange('accountTitle', e.target.value)}
                  placeholder="请输入账号的信息"
                  className={`${errors.accountTitle ? 'border-red-500' : ''} resize-none`}
                  style={{ height: 150,width: '100%' }}
                />
                {errors.accountTitle && (
                  <p className="text-red-500 text-sm">{errors.accountTitle}</p>
                )}
              </div>
              
              {/* 账号截图 - 修改为支持多张图片 */}
              <div className="space-y-2">
                <Label required>上传账号截图</Label>
                <div 
                  className={`rounded-lg p-3 border-2 transition-colors ${formData.accountImages.length >= 6 ? 'border-gray-200 bg-gray-50' : 'border-dashed border-gray-300 bg-white hover:border-blue-500'}`}
                  style={{
                    minHeight: 200,
                    height: 'auto'
                  }}
                >
                  <input
                    id="accountImagesInput"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImagesUpload}
                  />
                  
                  <div className="grid grid-cols-3 gap-3">
                    {formData.accountImages.map((file, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden shadow-sm border border-gray-100" style={{ maxHeight: 95 }}>
                        <img 
                          src={getImagePreviewUrl(file)} 
                          alt={`账号截图 ${index + 1}`} 
                          className="w-full h-full object-contain"
                          style={{ maxHeight: 95, minHeight: 90 }}
                        />
                        <button 
                          type="button"
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/70 border-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                        
                    {formData.accountImages.length < 6 && (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:border-blue-500"
                        style={{ minHeight: 90, maxHeight: 95 }}
                        onClick={() => document.getElementById('accountImagesInput')?.click()}
                      >
                        <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs text-gray-400">添加图片</span>
                      </div>
                    )}
                  </div>
                </div>
                {errors.accountImages && (
                  <p className="text-red-500 text-sm">{errors.accountImages}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* 商品信息 */}
          <div className="space-y-6 mb-10">
            <div className="space-y-4">
              {/* 价格 */}
              <div className="space-y-2">
                <Label required>价格 (元/天)</Label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                    onBlur={() => handleBlur('price', 50)}
                    className={`input ${errors.price ? 'border-red-500' : ''}`}
                    step="5"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
              
              {/* 租赁时长 */}
              <div className="space-y-2">
                <Label required>默认租赁时长 (天)</Label>
                <input
                  type="number"
                  value={formData.rentalDuration || ''}
                  onChange={(e) => handleInputChange('rentalDuration', e.target.value === '' ? '' : parseInt(e.target.value) || 1)}
                  onBlur={() => handleBlur('rentalDuration', 1)}
                  className={`input ${errors.rentalDuration ? 'border-red-500' : ''}`}
                  step="1"
                />
                {errors.rentalDuration && (
                  <p className="text-red-500 text-sm">{errors.rentalDuration}</p>
                )}
              </div>
              

            </div>
          </div>
          
          {/* 操作按钮 - 增加总价显示 */}
          <div className="mt-6">
            <Button 
              onClick={handleSubmit}
              variant="primary"
              className="bg-blue-500 hover:bg-blue-600 w-full" // 设置宽度为100%
            >
              确认无误，立即发布（¥价格：{calculateTotalPrice()}元）
            </Button>
          </div>
        </div>
      </div>

      {/* 通用提示模态框 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={() => setShowAlertModal(false)}
      />

    </div>
  );
}