import { UserPreferences } from "../types/job-types";

export class UserPreferencesService {
  private static baseUrl = '/api/user-preferences';

  static async savePreferences(preferences: UserPreferences & { userEmail: string }) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save preferences');
      }

      return data;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  static async getPreferences(userEmail: string) {
    try {
      const response = await fetch(`${this.baseUrl}?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch preferences');
      }

      return data.preferences;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  static async hasExistingPreferences(userEmail: string): Promise<boolean> {
    try {
      const preferences = await this.getPreferences(userEmail);
      return preferences !== null;
    } catch (error) {
      console.error('Error checking existing preferences:', error);
      return false;
    }
  }
} 