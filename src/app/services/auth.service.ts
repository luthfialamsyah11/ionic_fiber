import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { LocationService } from './location.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);
  private api = inject(ApiService);
  private router = inject(Router);
  private locationService = inject(LocationService);

  async login(email: string, password: string): Promise<any> {
    console.log('[AuthService] Attempting login...');
    
    try {
      console.log('[AuthService] Calling api.login with email:', email);
      const res: any = await this.api.login(email, password);
      console.log('[AuthService] Login response:', res);
      
      if (res.user && res.user.role !== 'technician') {
        console.warn('[AuthService] User is not technician, role:', res.user.role);
        throw { error: { message: 'Aplikasi ini khusus untuk teknisi. Admin harap login melalui Web.' } };
      }

      console.log('[AuthService] Saving token and user to storage...');
      await this.storage.set('token', res.token);
      await this.storage.set('user', res.user);
      console.log('[AuthService] Login successful!');
      return res;
    } catch (error: any) {
      console.error('[AuthService] Login error:', error);
      
      // Re-throw dengan message yang user-friendly
      if (error?.error?.message) {
        console.log('[AuthService] Error has message:', error.error.message);
        throw error;
      }
      if (error?.status === 401 || error?.statusText === 'Unauthorized') {
        console.log('[AuthService] 401 Unauthorized error');
        throw { error: { message: 'Email atau password salah' } };
      }
      if (error?.status === 0 || error?.statusText === 'Unknown Error') {
        console.log('[AuthService] Network/Unknown error, status:', error?.status);
        throw { error: { message: 'Gagal terhubung ke server. Periksa koneksi internet dan URL API.' } };
      }
      throw { error: { message: error?.message || 'Terjadi kesalahan saat login' } };
    }
  }

  async logout() {
    try {
      this.locationService.stopTracking();
      await this.api.logout();
    } catch (e) {
      console.warn('[AuthService] Logout API failed, continuing local logout:', e);
    }
    await this.storage.remove('token');
    await this.storage.remove('user');
    this.router.navigate(['/login']);
  }

  async getUser() {
    return await this.storage.get('user');
  }

  async getToken() {
    return await this.storage.get('token');
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.storage.get('token');
    return !!token;
  }
}
