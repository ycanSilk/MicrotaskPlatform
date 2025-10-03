// 客户端token存储服务
// 定义Token数据接口
export interface TokenData {
  token: string;
  tokenType: string;
  expiresIn: number;
  timestamp: number;
  expiresAt: number;
  username?: string;
  password?: string;
}

// 保存token到localStorage
export const saveAuthToken = async (tokenData: TokenData): Promise<boolean> => {
  try {
    console.log('Attempting to save token to localStorage');
    console.log('Token data structure:', Object.keys(tokenData));
    if (tokenData.token) {
      console.log('Token length:', tokenData.token.length);
      console.log('Token starts with:', tokenData.token.substring(0, 20) + '...');
    }
    const tokenString = JSON.stringify(tokenData);
    localStorage.setItem('auth-token', tokenString);
    console.log('Token saved to localStorage successfully');
    return true;
  } catch (error) {
    console.error('Failed to save token to localStorage:', error);
    return false;
  }
};

// 从localStorage获取token
export const getAuthToken = async (): Promise<TokenData | null> => {
  try {
    console.log('Attempting to get token from localStorage');
    const tokenString = localStorage.getItem('auth-token');
    if (!tokenString) {
      console.log('No token found in localStorage');
      return null;
    }
    console.log('Found token in localStorage, length:', tokenString.length);
    const tokenData: TokenData = JSON.parse(tokenString);
    
    console.log('Token data retrieved:', {
      tokenType: tokenData.tokenType,
      tokenExists: !!tokenData.token,
      hasUsername: !!tokenData.username,
      hasPassword: !!tokenData.password,
      timestamp: tokenData.timestamp,
      expiresAt: tokenData.expiresAt
    });
    
    // 检查token是否过期
    const now = Date.now();
    if (tokenData.expiresAt) {
      const timeUntilExpiry = tokenData.expiresAt - now;
      console.log('Time until token expiry:', Math.round(timeUntilExpiry / 1000 / 60), 'minutes');
      
      if (now > tokenData.expiresAt) {
        console.log('Token has expired');
        localStorage.removeItem('auth-token');
        return null;
      }
    }
    
    return tokenData;
  } catch (error) {
    console.error('Failed to get token from localStorage:', error);
    return null;
  }
};

// 清除localStorage中的token
export const clearAuthToken = async (): Promise<boolean> => {
  try {
    console.log('Attempting to clear token from localStorage');
    localStorage.removeItem('auth-token');
    console.log('Token cleared from localStorage successfully');
    return true;
  } catch (error) {
    console.error('Failed to clear token from localStorage:', error);
    return false;
  }
};

// 检查localStorage中是否有token
export const hasAuthToken = (): boolean => {
  try {
    const hasToken = !!localStorage.getItem('auth-token');
    console.log('Check for existing token in localStorage:', hasToken);
    return hasToken;
  } catch (error) {
    console.error('Error checking for token:', error);
    return false;
  }
};