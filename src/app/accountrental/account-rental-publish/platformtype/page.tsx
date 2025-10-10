'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, NumberInput, Tabs, TabsContent, TabsList, TabsTrigger, Label, RadioGroup, Radio, Textarea, AlertModal, Checkbox } from '@/components/ui';
import { REGEX } from '@/lib/constants';
import { LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

// 定义抖音账号租赁表单类型
interface DouyinAccountRentalForm {
  // 基础信息
  accountTitle: string;
  accountType: 'personal' | 'business' | 'celebrity';
  followersRange: string;
  engagementRate: string;
  contentCategory: string;
  region: string;
  accountAge: string;
  accountScore: number;
  accountImage?: File | null;
  accountVideo?: File | null;
  
  // 商品信息
  price: number;
  rentalDuration: number;
  minimumRentalHours: number;
  description: string;
  advantages: string[];
  restrictions: string[];
  includedFeatures: boolean[];
  
  // 服务设置
  deliveryTime: number;
  refundPolicy: 'no_refund' | 'partial_refund' | 'full_refund';
  maxConcurrentUsers: number;
  responseTime: number;
  serviceHours: string;
  isAgreedToTerms: boolean;
}

// 地区选项
const REGION_OPTIONS = [
  { value: 'national', label: '全国' },
  { value: 'north', label: '北方' },
  { value: 'south', label: '南方' },
  { value: 'east', label: '东部' },
  { value: 'west', label: '西部' },
  { value: 'custom', label: '自定义' }
];

// 内容分类选项
const CONTENT_CATEGORY_OPTIONS = [
  { value: 'food', label: '美食' },
  { value: 'travel', label: '旅游' },
  { value: 'fashion', label: '时尚' },
  { value: 'beauty', label: '美妆' },
  { value: 'fitness', label: '健身' },
  { value: 'technology', label: '科技' },
  { value: 'finance', label: '财经' },
  { value: 'education', label: '教育' },
  { value: 'entertainment', label: '娱乐' },
  { value: 'sports', label: '体育' },
  { value: 'other', label: '其他' }
];

// 粉丝数量选项
const FOLLOWERS_RANGE_OPTIONS = [
  { value: '1k-5k', label: '1k-5k' },
  { value: '5k-10k', label: '5k-10k' },
  { value: '10k-50k', label: '10k-50k' },
  { value: '50k-100k', label: '50k-100k' },
  { value: '100k-500k', label: '100k-500k' },
  { value: '500k-1m', label: '500k-1m' },
  { value: '1m+', label: '1m+' }
];

// 包含功能选项
const FEATURES_OPTIONS = [
  '作品发布',
  '评论互动',
  '私信功能',
  '直播权限',
  '橱窗带货',
  '广告投放',
  '数据分析',
  '其他高级功能'
];

// 账号年龄选项
const ACCOUNT_AGE_OPTIONS = [
  { value: '1-3', label: '1-3个月' },
  { value: '3-6', label: '3-6个月' },
  { value: '6-12', label: '6-12个月' },
  { value: '12+', label: '1年以上' }
];

// 退款政策选项
const REFUND_POLICY_OPTIONS = [
  { value: 'no_refund', label: '无退款' },
  { value: 'partial_refund', label: '部分退款' },
  { value: 'full_refund', label: '全额退款' }
];

export default function DouyinAccountRentalPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DouyinAccountRentalForm>({
    // 基础信息
    accountTitle: '',
    accountType: 'personal',
    followersRange: '1k-5k',
    engagementRate: '',
    contentCategory: 'food',
    region: 'national',
    accountAge: '3-6',
    accountScore: 5,
    accountImage: null,
    accountVideo: null,
    
    // 商品信息
    price: 0,
    rentalDuration: 24,
    minimumRentalHours: 2,
    description: '',
    advantages: [],
    restrictions: [],
    includedFeatures: new Array(FEATURES_OPTIONS.length).fill(false),
    
    // 服务设置
    deliveryTime: 60,
    refundPolicy: 'no_refund',
    maxConcurrentUsers: 1,
    responseTime: 30,
    serviceHours: '9:00-22:00',
    isAgreedToTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: null as React.ReactNode | null
  });
  const [customAdvantage, setCustomAdvantage] = useState('');
  const [customRestriction, setCustomRestriction] = useState('');

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
    } else if (formData.accountTitle.length < 5 || formData.accountTitle.length > 30) {
      newErrors.accountTitle = '账号标题长度需在5-30个字符之间';
    }
    
    if (!formData.engagementRate.trim()) {
      newErrors.engagementRate = '请输入互动率';
    } else if (!/^\d+(\.\d+)?%$/.test(formData.engagementRate)) {
      newErrors.engagementRate = '互动率格式不正确，请输入数字+%';
    }
    
    if (!formData.accountImage) {
      newErrors.accountImage = '请上传账号截图';
    }
    
    // 商品信息验证
    if (formData.price <= 0) {
      newErrors.price = '价格必须大于0';
    }
    
    if (formData.rentalDuration <= 0) {
      newErrors.rentalDuration = '租赁时长必须大于0';
    }
    
    if (formData.minimumRentalHours <= 0) {
      newErrors.minimumRentalHours = '最小租赁时长必须大于0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '请输入账号描述';
    } else if (formData.description.length < 20 || formData.description.length > 500) {
      newErrors.description = '账号描述长度需在20-500个字符之间';
    }
    
    if (formData.advantages.length === 0) {
      newErrors.advantages = '请至少添加一个账号优势';
    }
    
    // 服务设置验证
    if (formData.deliveryTime <= 0) {
      newErrors.deliveryTime = '交付时间必须大于0';
    }
    
    if (formData.maxConcurrentUsers <= 0) {
      newErrors.maxConcurrentUsers = '最大并发用户数必须大于0';
    }
    
    if (formData.responseTime <= 0) {
      newErrors.responseTime = '响应时间必须大于0';
    }
    
    if (!formData.serviceHours.trim()) {
      newErrors.serviceHours = '请输入服务时间';
    }
    
    if (!formData.isAgreedToTerms) {
      newErrors.isAgreedToTerms = '请阅读并同意服务条款';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string | number | boolean | File | null) => {
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

  // 处理文件上传
  const handleFileUpload = (field: 'accountImage' | 'accountVideo', file: File | null) => {
    handleInputChange(field, file);
  };

  // 添加账号优势
  const handleAddAdvantage = () => {
    if (customAdvantage.trim() && !formData.advantages.includes(customAdvantage.trim())) {
      setFormData(prev => ({
        ...prev,
        advantages: [...prev.advantages, customAdvantage.trim()]
      }));
      setCustomAdvantage('');
    }
  };

  // 移除账号优势
  const handleRemoveAdvantage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index)
    }));
  };

  // 添加账号限制
  const handleAddRestriction = () => {
    if (customRestriction.trim() && !formData.restrictions.includes(customRestriction.trim())) {
      setFormData(prev => ({
        ...prev,
        restrictions: [...prev.restrictions, customRestriction.trim()]
      }));
      setCustomRestriction('');
    }
  };

  // 移除账号限制
  const handleRemoveRestriction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      restrictions: prev.restrictions.filter((_, i) => i !== index)
    }));
  };

  // 处理功能选择
  const handleFeatureToggle = (index: number) => {
    setFormData(prev => {
      const newFeatures = [...prev.includedFeatures];
      newFeatures[index] = !newFeatures[index];
      return {
        ...prev,
        includedFeatures: newFeatures
      };
    });
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

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
      {/* 页面提示信息 */}
      <div className="px-4 py-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <LockOutlined className="text-xl text-blue-600 mt-0.5" />
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
          <div className="space-y-6 mb-10">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-md mr-2">1</span>
              基础信息
            </h2>
            
            <div className="space-y-4">
              {/* 账号标题 */}
              <div className="space-y-2">
                <Label htmlFor="accountTitle" required>账号标题</Label>
                <Input
                  id="accountTitle"
                  value={formData.accountTitle}
                  onChange={(e) => handleInputChange('accountTitle', e.target.value)}
                  placeholder="请输入吸引人的账号标题"
                  className={errors.accountTitle ? 'border-red-500' : ''}
                />
                {errors.accountTitle && (
                  <p className="text-red-500 text-sm">{errors.accountTitle}</p>
                )}
              </div>
              
              {/* 账号类型 */}
              <div className="space-y-2">
                <Label required>账号类型</Label>
                <RadioGroup 
                  value={formData.accountType}
                  onValueChange={(value) => handleInputChange('accountType', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <Radio value="personal" id="personal" />
                    <Label htmlFor="personal">个人账号</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Radio value="business" id="business" />
                    <Label htmlFor="business">企业账号</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Radio value="celebrity" id="celebrity" />
                    <Label htmlFor="celebrity">达人账号</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* 粉丝数量 */}
              <div className="space-y-2">
                <Label required>粉丝数量</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FOLLOWERS_RANGE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('followersRange', option.value)}
                      className={`p-2 rounded-lg text-sm border transition-all ${formData.followersRange === option.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 互动率 */}
              <div className="space-y-2">
                <Label htmlFor="engagementRate" required>互动率</Label>
                <div className="relative">
                  <Input
                    id="engagementRate"
                    value={formData.engagementRate}
                    onChange={(e) => handleInputChange('engagementRate', e.target.value)}
                    placeholder="请输入互动率"
                    className={`${errors.engagementRate ? 'border-red-500' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
                {errors.engagementRate && (
                  <p className="text-red-500 text-sm">{errors.engagementRate}</p>
                )}
              </div>
              
              {/* 内容分类 */}
              <div className="space-y-2">
                <Label required>内容分类</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {CONTENT_CATEGORY_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('contentCategory', option.value)}
                      className={`py-2 px-3 rounded-lg text-sm border transition-all ${formData.contentCategory === option.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
          
              
              {/* 账号年龄 */}
              <div className="space-y-2">
                <Label required>账号年龄</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ACCOUNT_AGE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('accountAge', option.value)}
                      className={`py-2 px-3 rounded-lg text-sm border transition-all ${formData.accountAge === option.value ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 账号评分 */}
              <div className="space-y-2">
                <Label required>账号评分</Label>
                <NumberInput
                    value={formData.accountScore}
                    min={1}
                    max={10}
                    step={0.5}
                    onChange={(e) => handleInputChange('accountScore', parseFloat(e.target.value) || 5)}
                  />
              </div>
              
              {/* 账号截图 */}
              <div className="space-y-2">
                <Label required>账号截图</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer" onClick={() => document.getElementById('accountImageInput')?.click()}>
                  <input
                    id="accountImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload('accountImage', e.target.files?.[0] || null)}
                  />
                  {formData.accountImage ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-blue-600">{formData.accountImage.name}</span>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">点击上传账号截图（支持JPG、PNG格式）</p>
                    </div>
                  )}
                </div>
                {errors.accountImage && (
                  <p className="text-red-500 text-sm">{errors.accountImage}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* 商品信息 */}
          <div className="space-y-6 mb-10">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="bg-orange-100 text-orange-800 p-1 rounded-md mr-2">2</span>
              商品信息
            </h2>
            
            <div className="space-y-4">
              {/* 价格 */}
              <div className="space-y-2">
                <Label required>价格 (元/小时)</Label>
                <div className="relative">
                  <NumberInput
                    value={formData.price}
                    min={0}
                    step={5}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
              
              {/* 租赁时长 */}
              <div className="space-y-2">
                <Label required>默认租赁时长 (小时)</Label>
                <NumberInput
                  value={formData.rentalDuration}
                  min={1}
                  max={72}
                  step={1}
                  onChange={(e) => handleInputChange('rentalDuration', parseInt(e.target.value) || 24)}
                  className={errors.rentalDuration ? 'border-red-500' : ''}
                />
                {errors.rentalDuration && (
                  <p className="text-red-500 text-sm">{errors.rentalDuration}</p>
                )}
              </div>
              
              {/* 最小租赁时长 */}
              <div className="space-y-2">
                <Label required>最小租赁时长 (小时)</Label>
                <NumberInput
                    value={formData.minimumRentalHours}
                    min={1}
                    max={24}
                    step={1}
                    onChange={(e) => handleInputChange('minimumRentalHours', parseInt(e.target.value) || 2)}
                    className={errors.minimumRentalHours ? 'border-red-500' : ''}
                  />
                {errors.minimumRentalHours && (
                  <p className="text-red-500 text-sm">{errors.minimumRentalHours}</p>
                )}
              </div>
              
              {/* 账号描述 */}
              <div className="space-y-2">
                <Label htmlFor="description" required>账号描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="请详细描述账号特点、粉丝画像、内容风格等信息，帮助需求方更好地了解您的账号"
                  className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                />
                <p className="text-gray-500 text-sm">{formData.description.length}/500</p>
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
              
              {/* 账号优势 */}
              <div className="space-y-2">
                <Label required>账号优势</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={customAdvantage}
                    onChange={(e) => setCustomAdvantage(e.target.value)}
                    placeholder="输入账号优势"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddAdvantage}
                    disabled={!customAdvantage.trim()}
                  >
                    添加
                  </Button>
                </div>
                {formData.advantages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.advantages.map((advantage, index) => (
                      <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <span>{advantage}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveAdvantage(index)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.advantages && (
                  <p className="text-red-500 text-sm">{errors.advantages}</p>
                )}
              </div>
              
              {/* 账号限制 */}
              <div className="space-y-2">
                <Label>账号限制</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={customRestriction}
                    onChange={(e) => setCustomRestriction(e.target.value)}
                    placeholder="输入账号使用限制（选填）"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddRestriction}
                    disabled={!customRestriction.trim()}
                  >
                    添加
                  </Button>
                </div>
                {formData.restrictions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.restrictions.map((restriction, index) => (
                      <div key={index} className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm">
                        <span>{restriction}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveRestriction(index)}
                          className="ml-2 text-amber-500 hover:text-amber-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 包含功能 */}
              <div className="space-y-2">
                <Label required>包含功能</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FEATURES_OPTIONS.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox
                        id={`feature-${index}`}
                        checked={formData.includedFeatures[index]}
                        onCheckedChange={() => handleFeatureToggle(index)}
                      />
                      <Label htmlFor={`feature-${index}`} className="ml-2">{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 服务设置 */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-100 text-green-800 p-1 rounded-md mr-2">3</span>
              服务设置
            </h2>
            
            <div className="space-y-4">
              {/* 交付时间 */}
              <div className="space-y-2">
                <Label required>交付时间 (分钟)</Label>
                <NumberInput
                  value={formData.deliveryTime}
                  min={5}
                  max={360}
                  step={5}
                  onChange={(e) => handleInputChange('deliveryTime', parseInt(e.target.value) || 60)}
                  className={errors.deliveryTime ? 'border-red-500' : ''}
                />
                {errors.deliveryTime && (
                  <p className="text-red-500 text-sm">{errors.deliveryTime}</p>
                )}
              </div>
              
              {/* 退款政策 */}
              <div className="space-y-2">
                <Label required>退款政策</Label>
                <RadioGroup 
                  value={formData.refundPolicy}
                  onValueChange={(value) => handleInputChange('refundPolicy', value)}
                  className="flex flex-col space-y-2"
                >
                  {REFUND_POLICY_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Radio value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* 最大并发用户数 */}
              <div className="space-y-2">
                <Label required>最大并发用户数</Label>
                <NumberInput
                    value={formData.maxConcurrentUsers}
                    min={1}
                    max={10}
                    step={1}
                    onChange={(e) => handleInputChange('maxConcurrentUsers', parseInt(e.target.value) || 1)}
                    className={errors.maxConcurrentUsers ? 'border-red-500' : ''}
                  />
                {errors.maxConcurrentUsers && (
                  <p className="text-red-500 text-sm">{errors.maxConcurrentUsers}</p>
                )}
              </div>
              
              {/* 响应时间 */}
              <div className="space-y-2">
                <Label required>响应时间 (分钟)</Label>
                <NumberInput
                    value={formData.responseTime}
                    min={5}
                    max={120}
                    step={5}
                    onChange={(e) => handleInputChange('responseTime', parseInt(e.target.value) || 30)}
                    className={errors.responseTime ? 'border-red-500' : ''}
                  />
                {errors.responseTime && (
                  <p className="text-red-500 text-sm">{errors.responseTime}</p>
                )}
              </div>
              
              {/* 服务时间 */}
              <div className="space-y-2">
                <Label required>服务时间</Label>
                <Input
                  value={formData.serviceHours}
                  onChange={(e) => handleInputChange('serviceHours', e.target.value)}
                  placeholder="例如：9:00-22:00"
                  className={errors.serviceHours ? 'border-red-500' : ''}
                />
                {errors.serviceHours && (
                  <p className="text-red-500 text-sm">{errors.serviceHours}</p>
                )}
              </div>
              
              {/* 同意条款 */}
              <div className="flex items-start mt-4">
                <Checkbox
                  id="terms"
                  checked={formData.isAgreedToTerms}
                  onCheckedChange={(checked) => handleInputChange('isAgreedToTerms', checked || false)}
                  className={errors.isAgreedToTerms ? 'border-red-500' : ''}
                />
                <Label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  我已阅读并同意《服务条款》和《隐私政策》，承诺提供的信息真实有效
                </Label>
              </div>
              {errors.isAgreedToTerms && (
                <p className="text-red-500 text-sm ml-6">{errors.isAgreedToTerms}</p>
              )}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="mt-6 flex items-center justify-end">
            <Button 
              onClick={handleSubmit}
              variant="primary"
              className="bg-orange-500 hover:bg-orange-600"
            >
              确认无误，立即发布
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