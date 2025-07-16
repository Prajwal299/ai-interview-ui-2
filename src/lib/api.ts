// API client for Flask backend integration
import { getAuthHeaders, removeAuthToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token expired or invalid
        removeAuthToken();
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(email: string, password: string, name?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Campaign endpoints
  async getCampaigns() {
    return this.request('/campaigns');
  }

  async createCampaign(data: any) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCampaign(campaignId: number) {
    return this.request(`/campaigns/${campaignId}`);
  }

  async updateCampaign(campaignId: number, data: any) {
    return this.request(`/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(campaignId: number) {
    return this.request(`/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
  }

  async uploadCandidates(campaignId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request(`/campaigns/${campaignId}/candidates`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        // Remove Content-Type to let browser set it with boundary for FormData
        'Content-Type': undefined as any,
      },
      body: formData,
    });
  }

  async startCampaign(campaignId: number) {
    return this.request(`/campaigns/${campaignId}/start`, {
      method: 'POST',
    });
  }

  async getCampaignResults(campaignId: number) {
    return this.request(`/campaigns/${campaignId}/results`);
  }

  // Voice/Interview endpoints
  async handleCall(data: any) {
    return this.request('/voice/call_handler', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async handleRecording(data: any) {
    return this.request('/voice/recording_handler', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);