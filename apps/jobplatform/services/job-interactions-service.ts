export type JobInteractionType = 'LIKED' | 'APPLIED' | 'SAVED_EXTERNAL' | 'VIEWED';

export interface JobInteraction {
  id: string;
  userId: string;
  jobId: number;
  interactionType: JobInteractionType;
  notes?: string;
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class JobInteractionsService {
  private static baseUrl = '/api/job-interactions';

  static async saveInteraction(params: {
    userEmail: string;
    jobId: number;
    interactionType: JobInteractionType;
    notes?: string;
  }) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save job interaction');
      }

      return data;
    } catch (error) {
      console.error('Error saving job interaction:', error);
      throw error;
    }
  }

  static async getInteractions(userEmail: string, type?: JobInteractionType) {
    try {
      const params = new URLSearchParams({ userEmail });
      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch job interactions');
      }

      return data.interactions || [];
    } catch (error) {
      console.error('Error fetching job interactions:', error);
      return [];
    }
  }

  static async removeInteraction(params: {
    userEmail: string;
    jobId: number;
    interactionType: JobInteractionType;
  }) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove job interaction');
      }

      return data;
    } catch (error) {
      console.error('Error removing job interaction:', error);
      throw error;
    }
  }

  // Helper methods for specific interaction types
  static async likeJob(userEmail: string, jobId: number) {
    return this.saveInteraction({
      userEmail,
      jobId,
      interactionType: 'LIKED'
    });
  }

  static async unlikeJob(userEmail: string, jobId: number) {
    return this.removeInteraction({
      userEmail,
      jobId,
      interactionType: 'LIKED'
    });
  }

  static async markJobAsApplied(userEmail: string, jobId: number, notes?: string) {
    return this.saveInteraction({
      userEmail,
      jobId,
      interactionType: 'APPLIED',
      notes
    });
  }

  static async saveJobExternal(userEmail: string, jobId: number, notes?: string) {
    return this.saveInteraction({
      userEmail,
      jobId,
      interactionType: 'SAVED_EXTERNAL',
      notes
    });
  }

  static async getLikedJobs(userEmail: string) {
    return this.getInteractions(userEmail, 'LIKED');
  }

  static async getAppliedJobs(userEmail: string) {
    return this.getInteractions(userEmail, 'APPLIED');
  }

  static async getSavedExternalJobs(userEmail: string) {
    return this.getInteractions(userEmail, 'SAVED_EXTERNAL');
  }

  // Get interaction status for multiple jobs
  static async getJobInteractionStatus(userEmail: string, jobIds: number[]) {
    try {
      const interactions = await this.getInteractions(userEmail);
      const statusMap: Record<number, JobInteractionType[]> = {};

      interactions.forEach((interaction: any) => {
        const jobId = interaction.jobId;
        if (jobIds.includes(jobId)) {
          if (!statusMap[jobId]) {
            statusMap[jobId] = [];
          }
          statusMap[jobId].push(interaction.interactionType);
        }
      });

      return statusMap;
    } catch (error) {
      console.error('Error getting job interaction status:', error);
      return {};
    }
  }
} 