import { UserPreferences } from "../types/job-types";

export class UserPreferencesService {
  private static baseUrl = '/api/user-preferences';

  static async savePreferences(preferences: UserPreferences) {
    console.log("💾 UserPreferencesService.savePreferences called with:", preferences);
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      console.log("💾 Save preferences response status:", response.status);
      const data = await response.json();
      console.log("💾 Save preferences response data:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save preferences');
      }

      return data;
    } catch (error) {
      console.error('❌ Error saving user preferences:', error);
      throw error;
    }
  }

  static async getPreferences() {
    console.log("📋 UserPreferencesService.getPreferences called");
    
    try {
      const response = await fetch(this.baseUrl);
      console.log("📋 Get preferences response status:", response.status);
      
      const data = await response.json();
      console.log("📋 Get preferences response data:", data);

      if (!response.ok) {
        console.log("❌ Get preferences failed with error:", data.error);
        throw new Error(data.error || 'Failed to fetch preferences');
      }

      console.log("✅ Get preferences successful, returning:", data.preferences);
      return data.preferences;
    } catch (error) {
      console.error('❌ Error fetching user preferences:', error);
      return null;
    }
  }

  static async hasExistingPreferences(): Promise<boolean> {
    console.log("🔍 UserPreferencesService.hasExistingPreferences called");
    
    try {
      const preferences = await this.getPreferences();
      const hasPreferences = preferences !== null;
      console.log("🔍 Has existing preferences result:", hasPreferences);
      return hasPreferences;
    } catch (error) {
      console.error('❌ Error checking existing preferences:', error);
      return false;
    }
  }
} 