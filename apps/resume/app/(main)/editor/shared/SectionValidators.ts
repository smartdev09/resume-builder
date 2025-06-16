import { ResumeValues } from "utils/validations";
import { SectionAnalysis, ValidationIssue, ValidationRule, ValidationResult } from "./types";

// Contact Information Validator
export const validateContact = (resumeData: ResumeValues): SectionAnalysis => {
  const issues: ValidationIssue[] = [];
  let score = 100;
  const compliantAspects: string[] = [];

  // Required fields check
  const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
  const missingFields = requiredFields.filter(field => !resumeData[field as keyof ResumeValues]);
  
  if (missingFields.length > 0) {
    issues.push({
      type: 'missing_keywords',
      section: 'contact',
      severity: 'critical',
      message: `Missing required contact fields: ${missingFields.join(', ')}`,
      suggestion: 'Fill in all required contact information',
      autoFixAvailable: false
    });
    score -= missingFields.length * 25;
  } else {
    compliantAspects.push('All required contact fields present');
  }

  // Email validation
  if (resumeData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resumeData.email)) {
      issues.push({
        type: 'format_issues',
        section: 'contact',
        severity: 'high',
        message: 'Invalid email format',
        suggestion: 'Use a valid email format (e.g., name@domain.com)',
        autoFixAvailable: false
      });
      score -= 15;
    } else {
      compliantAspects.push('Valid email format');
    }
  }

  // Phone validation
  if (resumeData.phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(resumeData.phone)) {
      issues.push({
        type: 'format_issues',
        section: 'contact',
        severity: 'medium',
        message: 'Phone number format could be improved',
        suggestion: 'Use standard phone format (e.g., +1 (555) 123-4567)',
        autoFixAvailable: true
      });
      score -= 10;
    } else {
      compliantAspects.push('Valid phone format');
    }
  }

  // LinkedIn validation
  if (resumeData.linkedin) {
    if (!resumeData.linkedin.includes('linkedin.com')) {
      issues.push({
        type: 'format_issues',
        section: 'contact',
        severity: 'medium',
        message: 'LinkedIn URL format incorrect',
        suggestion: 'Use full LinkedIn URL (e.g., linkedin.com/in/yourname)',
        autoFixAvailable: true
      });
      score -= 10;
    } else {
      compliantAspects.push('LinkedIn profile included');
    }
  }

  const suggestions = [
    'Ensure all contact information is up-to-date',
    'Use professional email address',
    'Include LinkedIn profile for better visibility'
  ];

  return {
    section: 'contact',
    score: Math.max(0, score),
    issues,
    suggestions,
    compliantAspects
  };
};

// Work Experience Validator
export const validateExperience = (resumeData: ResumeValues): SectionAnalysis => {
  const issues: ValidationIssue[] = [];
  let score = 100;
  const compliantAspects: string[] = [];
  const workExperiences = resumeData.workExperiences || [];

  if (workExperiences.length === 0) {
    issues.push({
      type: 'insufficient_detail',
      section: 'experience',
      severity: 'critical',
      message: 'No work experience listed',
      suggestion: 'Add at least one work experience entry',
      autoFixAvailable: false
    });
    score = 0;
  } else {
    compliantAspects.push(`${workExperiences.length} work experience(s) listed`);

    workExperiences.forEach((exp, index) => {
      // Check for required fields
      if (!exp.position || !exp.company) {
        issues.push({
          type: 'insufficient_detail',
          section: 'experience',
          severity: 'high',
          message: `Work experience ${index + 1} missing position or company`,
          suggestion: 'Fill in position title and company name',
          autoFixAvailable: false,
          sectionIndex: index
        });
        score -= 15;
      }

      // Check description length and quality
      if (!exp.description || exp.description.length < 50) {
        issues.push({
          type: 'insufficient_detail',
          section: 'experience',
          severity: 'high',
          message: `Work experience ${index + 1} needs more detailed description`,
          suggestion: 'Add 3-6 bullet points describing your achievements and responsibilities',
          autoFixAvailable: false,
          sectionIndex: index
        });
        score -= 15;
      } else {
        // Check for quantified achievements
        const hasNumbers = /\d/.test(exp.description);
        if (!hasNumbers) {
          issues.push({
            type: 'missing_quantification',
            section: 'experience',
            severity: 'high',
            message: `Work experience ${index + 1} lacks quantified achievements`,
            suggestion: 'Add numbers to show impact (e.g., "increased sales by 25%", "managed team of 8")',
            autoFixAvailable: true,
            sectionIndex: index
          });
          score -= 20;
        } else {
          compliantAspects.push(`Experience ${index + 1} has quantified achievements`);
        }

        // Check for personal pronouns
        const hasPronouns = /\b(I|my|mine|we|our)\b/i.test(exp.description || '');
        if (hasPronouns) {
          issues.push({
            type: 'personal_pronouns',
            section: 'experience',
            severity: 'medium',
            message: `Work experience ${index + 1} contains personal pronouns`,
            suggestion: 'Remove personal pronouns (I, my, we, our) and use action verbs',
            autoFixAvailable: true,
            sectionIndex: index
          });
          score -= 10;
        }

        // Check for weak verbs
        const weakVerbs = ['responsible for', 'worked on', 'helped with', 'assisted'];
        const hasWeakVerbs = weakVerbs.some(verb => 
          (exp.description || '').toLowerCase().includes(verb)
        );
        if (hasWeakVerbs) {
          issues.push({
            type: 'weak_verbs',
            section: 'experience',
            severity: 'medium',
            message: `Work experience ${index + 1} uses weak action verbs`,
            suggestion: 'Use stronger action verbs (led, developed, implemented, achieved)',
            autoFixAvailable: true,
            sectionIndex: index
          });
          score -= 10;
        }
      }
    });
  }

  const suggestions = [
    'Use action verbs to start each bullet point',
    'Include quantified achievements with numbers',
    'Focus on results and impact, not just duties',
    'Remove personal pronouns'
  ];

  return {
    section: 'experience',
    score: Math.max(0, score),
    issues,
    suggestions,
    compliantAspects
  };
};

// Skills Validator
export const validateSkills = (resumeData: ResumeValues): SectionAnalysis => {
  const issues: ValidationIssue[] = [];
  let score = 100;
  const compliantAspects: string[] = [];
  const skillSections = resumeData.skillSections || [];

  if (skillSections.length === 0) {
    issues.push({
      type: 'insufficient_detail',
      section: 'skills',
      severity: 'high',
      message: 'No skills section found',
      suggestion: 'Add a skills section with relevant technical and soft skills',
      autoFixAvailable: false
    });
    score = 20;
  } else {
    const totalSkills = skillSections.reduce((total, section) => 
      total + (section.skills?.length || 0), 0
    );

    if (totalSkills < 5) {
      issues.push({
        type: 'insufficient_detail',
        section: 'skills',
        severity: 'medium',
        message: 'Too few skills listed',
        suggestion: 'Add more relevant skills (aim for 8-15 skills)',
        autoFixAvailable: false
      });
      score -= 20;
    } else {
      compliantAspects.push(`${totalSkills} skills listed`);
    }

    // Check for proper categorization
    if (skillSections.length === 1 && totalSkills > 10) {
      issues.push({
        type: 'format_issues',
        section: 'skills',
        severity: 'low',
        message: 'Consider organizing skills into categories',
        suggestion: 'Group skills by type (e.g., Programming Languages, Frameworks, Tools)',
        autoFixAvailable: false
      });
      score -= 5;
    } else if (skillSections.length > 1) {
      compliantAspects.push('Skills properly categorized');
    }
  }

  const suggestions = [
    'Include both technical and soft skills',
    'Organize skills into relevant categories',
    'Focus on skills mentioned in job descriptions',
    'Keep skills current and relevant'
  ];

  return {
    section: 'skills',
    score: Math.max(0, score),
    issues,
    suggestions,
    compliantAspects
  };
};

// Education Validator
export const validateEducation = (resumeData: ResumeValues): SectionAnalysis => {
  const issues: ValidationIssue[] = [];
  let score = 100;
  const compliantAspects: string[] = [];
  const educations = resumeData.educations || [];

  if (educations.length === 0) {
    issues.push({
      type: 'insufficient_detail',
      section: 'education',
      severity: 'medium',
      message: 'No education information provided',
      suggestion: 'Add education details including degree and institution',
      autoFixAvailable: false
    });
    score = 50;
  } else {
    compliantAspects.push(`${educations.length} education entry(ies) listed`);

    educations.forEach((edu, index) => {
      if (!edu.degree || !edu.school) {
        issues.push({
          type: 'insufficient_detail',
          section: 'education',
          severity: 'medium',
          message: `Education ${index + 1} missing degree or school name`,
          suggestion: 'Include both degree type and institution name',
          autoFixAvailable: false,
          sectionIndex: index
        });
        score -= 20;
      }

      if (!edu.startDate && !edu.endDate) {
        issues.push({
          type: 'insufficient_detail',
          section: 'education',
          severity: 'low',
          message: `Education ${index + 1} missing dates`,
          suggestion: 'Include graduation date or expected graduation date',
          autoFixAvailable: false,
          sectionIndex: index
        });
        score -= 10;
      }
    });
  }

  const suggestions = [
    'Include degree type and major',
    'Add graduation dates',
    'Include GPA if above 3.0',
    'Add relevant coursework if applicable'
  ];

  return {
    section: 'education',
    score: Math.max(0, score),
    issues,
    suggestions,
    compliantAspects
  };
};

// Projects Validator
export const validateProjects = (resumeData: ResumeValues): SectionAnalysis => {
  const issues: ValidationIssue[] = [];
  let score = 100;
  const compliantAspects: string[] = [];
  const projects = resumeData.projects || [];

  if (projects.length === 0) {
    // Projects are optional, so this is just a suggestion
    score = 80;
    compliantAspects.push('Projects section is optional but recommended');
  } else {
    compliantAspects.push(`${projects.length} project(s) listed`);

    projects.forEach((project, index) => {
      if (!project.name || !project.description) {
        issues.push({
          type: 'insufficient_detail',
          section: 'projects',
          severity: 'medium',
          message: `Project ${index + 1} missing name or description`,
          suggestion: 'Include project name and detailed description',
          autoFixAvailable: false,
          sectionIndex: index
        });
        score -= 15;
      }

      if (project.description && project.description.length < 30) {
        issues.push({
          type: 'insufficient_detail',
          section: 'projects',
          severity: 'low',
          message: `Project ${index + 1} description is too brief`,
          suggestion: 'Provide more details about technologies used and your role',
          autoFixAvailable: false,
          sectionIndex: index
        });
        score -= 10;
      }
    });
  }

  const suggestions = [
    'Include relevant side projects',
    'Describe technologies and tools used',
    'Explain your specific contributions',
    'Add links to live demos or repositories'
  ];

  return {
    section: 'projects',
    score: Math.max(0, score),
    issues,
    suggestions,
    compliantAspects
  };
}; 