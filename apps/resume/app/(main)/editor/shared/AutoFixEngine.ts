import { ResumeValues } from 'utils/validations';
import { AutoFix, ValidationIssue } from './types';

export class AutoFixEngine {
  /**
   * Generates auto-fix actions for given validation issues
   */
  public static generateAutoFixes(resumeData: ResumeValues, issues: ValidationIssue[]): AutoFix[] {
    const autoFixes: AutoFix[] = [];

    issues.forEach(issue => {
      if (!issue.autoFixAvailable) return;

      switch (issue.type) {
        case 'personal_pronouns':
          if (issue.section === 'experience' && issue.sectionIndex !== undefined) {
            autoFixes.push({
              type: 'remove_pronouns',
              sectionIndex: issue.sectionIndex,
              description: 'Remove personal pronouns from work experience',
              apply: (data: ResumeValues) => this.removePersonalPronouns(data, issue.sectionIndex!)
            });
          }
          break;

        case 'weak_verbs':
          if (issue.section === 'experience' && issue.sectionIndex !== undefined) {
            autoFixes.push({
              type: 'improve_verbs',
              sectionIndex: issue.sectionIndex,
              description: 'Replace weak verbs with action verbs',
              apply: (data: ResumeValues) => this.improveActionVerbs(data, issue.sectionIndex!)
            });
          }
          break;

        case 'format_issues':
          if (issue.section === 'contact') {
            if (issue.message.includes('phone')) {
              autoFixes.push({
                type: 'format_phone',
                description: 'Format phone number properly',
                apply: (data: ResumeValues) => this.formatPhoneNumber(data)
              });
            }
            if (issue.message.includes('LinkedIn')) {
              autoFixes.push({
                type: 'format_linkedin',
                description: 'Format LinkedIn URL properly',
                apply: (data: ResumeValues) => this.formatLinkedInURL(data)
              });
            }
          }
          break;
      }
    });

    return autoFixes;
  }

  /**
   * Applies multiple auto-fixes to resume data
   */
  public static applyAutoFixes(resumeData: ResumeValues, autoFixes: AutoFix[]): ResumeValues {
    let updatedData = { ...resumeData };

    autoFixes.forEach(fix => {
      try {
        updatedData = fix.apply(updatedData);
      } catch (error) {
        console.error(`Failed to apply auto-fix ${fix.type}:`, error);
      }
    });

    return updatedData;
  }

  /**
   * Removes personal pronouns from work experience descriptions
   */
  private static removePersonalPronouns(data: ResumeValues, experienceIndex: number): ResumeValues {
    const updated = { ...data };
    if (!updated.workExperiences || !updated.workExperiences[experienceIndex]) {
      return updated;
    }

    const experience = { ...updated.workExperiences[experienceIndex] };
    if (experience.description) {
      // Remove common personal pronouns
      experience.description = experience.description
        .replace(/\bI\s+/gi, '')
        .replace(/\bmy\s+/gi, '')
        .replace(/\bmine\b/gi, '')
        .replace(/\bwe\s+/gi, '')
        .replace(/\bour\s+/gi, '')
        // Clean up extra spaces
        .replace(/\s+/g, ' ')
        .trim()
        // Capitalize first letter of sentences
        .replace(/^(\w)/g, (match) => match.toUpperCase())
        .replace(/\.\s+(\w)/g, (match, letter) => '. ' + letter.toUpperCase());
    }

    updated.workExperiences = [...updated.workExperiences];
    updated.workExperiences[experienceIndex] = experience;
    return updated;
  }

  /**
   * Improves weak action verbs in work experience descriptions
   */
  private static improveActionVerbs(data: ResumeValues, experienceIndex: number): ResumeValues {
    const updated = { ...data };
    if (!updated.workExperiences || !updated.workExperiences[experienceIndex]) {
      return updated;
    }

    const experience = { ...updated.workExperiences[experienceIndex] };
    if (experience.description) {
      const verbReplacements: Record<string, string> = {
        'responsible for': 'managed',
        'worked on': 'developed',
        'helped with': 'assisted in',
        'assisted': 'supported',
        'was involved in': 'contributed to',
        'participated in': 'engaged in',
        'dealt with': 'handled',
        'worked with': 'collaborated with'
      };

      let description = experience.description;
      Object.entries(verbReplacements).forEach(([weak, strong]) => {
        // Case-insensitive replacement, preserving original case
        const regex = new RegExp(`\\b${weak}\\b`, 'gi');
        description = description.replace(regex, (match) => {
          // Preserve original case pattern
          if (match === match.toLowerCase()) return strong;
          if (match === match.toUpperCase()) return strong.toUpperCase();
          return strong.charAt(0).toUpperCase() + strong.slice(1);
        });
      });

      experience.description = description;
    }

    updated.workExperiences = [...updated.workExperiences];
    updated.workExperiences[experienceIndex] = experience;
    return updated;
  }

  /**
   * Formats phone number to standard format
   */
  private static formatPhoneNumber(data: ResumeValues): ResumeValues {
    const updated = { ...data };
    if (!updated.phone) return updated;

    // Extract digits only
    const digits = updated.phone.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length === 10) {
      // US format: (555) 123-4567
      updated.phone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      // US format with country code: +1 (555) 123-4567
      updated.phone = `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 7) {
      // Generic international format: +XX XXX-XXX-XXXX
      const countryCode = digits.slice(0, -10);
      const areaCode = digits.slice(-10, -7);
      const firstPart = digits.slice(-7, -4);
      const lastPart = digits.slice(-4);
      updated.phone = `+${countryCode} ${areaCode}-${firstPart}-${lastPart}`;
    }

    return updated;
  }

  /**
   * Formats LinkedIn URL to standard format
   */
  private static formatLinkedInURL(data: ResumeValues): ResumeValues {
    const updated = { ...data };
    if (!updated.linkedin) return updated;

    let url = updated.linkedin.trim();
    
    // Remove protocol if present
    url = url.replace(/^https?:\/\//, '');
    url = url.replace(/^www\./, '');
    
    // Extract username if it's a full URL
    const usernameMatch = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
    if (usernameMatch) {
      updated.linkedin = `linkedin.com/in/${usernameMatch[1]}`;
    } else if (!url.includes('linkedin.com')) {
      // If it's just a username, prepend the LinkedIn URL
      updated.linkedin = `linkedin.com/in/${url}`;
    } else if (!url.startsWith('linkedin.com/in/')) {
      // If it contains linkedin.com but not in the right format
      updated.linkedin = `linkedin.com/in/${url.replace(/.*linkedin\.com\/?/, '')}`;
    }

    return updated;
  }

  /**
   * Gets user-friendly description for auto-fix type
   */
  public static getAutoFixDescription(fixType: string): string {
    const descriptions: Record<string, string> = {
      'remove_pronouns': '🔧 Remove personal pronouns (I, my, we, our)',
      'improve_verbs': '💪 Replace weak verbs with action verbs',
      'format_phone': '📞 Format phone number professionally',
      'format_linkedin': '🔗 Format LinkedIn URL correctly',
      'add_quantification': '📊 Add suggested quantified achievements',
      'fix_formatting': '✨ Fix text formatting issues'
    };

    return descriptions[fixType] || `🔧 ${fixType.replace(/_/g, ' ')}`;
  }

  /**
   * Validates if auto-fix can be safely applied
   */
  public static canApplyAutoFix(resumeData: ResumeValues, autoFix: AutoFix): boolean {
    try {
      // Basic validation - ensure the section exists if referenced
      if (autoFix.sectionIndex !== undefined) {
        if (autoFix.type.includes('experience')) {
          return !!(resumeData.workExperiences && resumeData.workExperiences[autoFix.sectionIndex]);
        }
      }

      // For contact fixes, ensure field exists
      if (autoFix.type === 'format_phone') {
        return !!resumeData.phone;
      }
      
      if (autoFix.type === 'format_linkedin') {
        return !!resumeData.linkedin;
      }

      return true;
    } catch {
      return false;
    }
  }
} 