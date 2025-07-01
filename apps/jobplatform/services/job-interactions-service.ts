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

  static async getInteractions(type?: JobInteractionType) {
    try {
      const params = new URLSearchParams();
      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch interactions');
      }

      return data.interactions || [];
    } catch (error) {
      console.error('Error fetching job interactions:', error);
      return [];
    }
  }

  static async removeInteraction(params: {
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
  static async likeJob(jobId: number) {
    return this.saveInteraction({
      jobId,
      interactionType: 'LIKED'
    });
  }

  static async unlikeJob(jobId: number) {
    return this.removeInteraction({
      jobId,
      interactionType: 'LIKED'
    });
  }

  static async markJobAsApplied(jobId: number, notes?: string) {
    return this.saveInteraction({
      jobId,
      interactionType: 'APPLIED',
      notes
    });
  }

  static async saveJobExternal(jobId: number, notes?: string) {
    return this.saveInteraction({
      jobId,
      interactionType: 'SAVED_EXTERNAL',
      notes
    });
  }

  static async getLikedJobs() {
    return this.getInteractions('LIKED');
  }

  static async getAppliedJobs() {
    return this.getInteractions('APPLIED');
  }

  static async getSavedExternalJobs() {
    return this.getInteractions('SAVED_EXTERNAL');
  }

  // Get interaction status for multiple jobs
  static async getJobInteractionStatus(jobIds: number[]) {
    try {
      const interactions = await this.getInteractions();
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