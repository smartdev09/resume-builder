import { useState,useEffect } from 'react';
import { ResumeValues } from 'utils/validations';
import { parseResumeFromPdf } from 'utils/lib/parse-resume-from-pdf';
import { mapReduxResumeToFormValues } from 'utils/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@resume/ui/card';
import { Button } from '@resume/ui/button';
import { Textarea } from '@resume/ui/textarea';
import { Badge } from '@resume/ui/badge';
import { Upload, FileText, Bot, Sparkles, CheckCircle, ArrowRight, AlertCircle, X } from 'lucide-react';
import cn from '@resume/ui/cn';
//import { toast } from "@resume/ui/sonner";
import toast from 'react-hot-toast';

interface AIGeneratorTabProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  onSwitchToEdit?: () => void;
}

type GenerationStep = 'input' | 'analysis' | 'selection' | 'generation' | 'complete' | 'error';

interface SkillMatch {
  skill: string;
  required: boolean;
  present: boolean;
  importance: 'high' | 'medium' | 'low';
  category?: string;
}

interface JobAnalysisResult {
  extractedSkills: Array<{
    skill: string;
    required: boolean;
    importance: 'high' | 'medium' | 'low';
    category: string;
  }>;
  experienceLevel: string;
  keyRequirements: string[];
  matchAnalysis: {
    totalSkills: number;
    matchingSkills: number;
    missingCritical: string[];
    strengths: string[];
  };
}

export default function AIGeneratorTab({ resumeData, setResumeData, onSwitchToEdit }: AIGeneratorTabProps) {
  const [currentStep, setCurrentStep] = useState<GenerationStep>('input');
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [parsedResumeData, setParsedResumeData] = useState<ResumeValues | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [skillMatches, setSkillMatches] = useState<SkillMatch[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<JobAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');


const resumeSuccessToast = () =>
  toast.success('Your resume has been successfully generated!', {
    icon: '🎉', // The party popper emoji is a good choice for celebration
    duration: 5000,
    style: {
      backgroundColor: '#f0f9ff',
      color: '#0c4a6e',
      border: '1px solid #cce5ff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  });

  // Extract current skills from resume data (including uploaded resume)
  const getCurrentSkills = (): string[] => {
    const skills: string[] = [];
    const sourceData = parsedResumeData || resumeData;
    
    if (sourceData.skillSections) {
      sourceData.skillSections.forEach(section => {
        skills.push(...section.skills);
      });
    }
    return skills;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file');
      return;
    }

    setIsUploadingResume(true);
    setErrorMessage('');

    try {
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Parse the resume using the existing parser
      const parsedResume = await parseResumeFromPdf(fileUrl);
      if(parsedResume){
      // Convert Redux resume format to form values format
      const resumeFormData = mapReduxResumeToFormValues(parsedResume);
      
      // Set the parsed data
      setParsedResumeData({
        ...resumeFormData,
        selectedTemplate: resumeData.selectedTemplate || 'simple'
      } as ResumeValues);
      
      setUploadedResume(file);
      
      // Clean up the object URL
      URL.revokeObjectURL(fileUrl);
    }
    } catch (error) {
      console.error('Failed to parse resume:', error);
      setErrorMessage('Failed to parse the uploaded resume. Please try a different file.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const removeUploadedResume = () => {
    setUploadedResume(null);
    setParsedResumeData(null);
    setErrorMessage('');
  };
const handleJobAnalysis = async () => {
  if (!jobDescription.trim()) return;
  
  setIsProcessing(true);
  setCurrentStep('analysis');
  setErrorMessage('');
  
  try {
    const currentSkills = getCurrentSkills();
    
    const response = await fetch('/api/ai/analyze-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription,
        currentSkills
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze job description');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    let result = '';      

    while (true && reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
    }

    let analysisData: JobAnalysisResult;

    try {
      // Use the same parsing logic as handleGenerateResume
      const reconstructedText = parseStreamingResponse(result);
      console.log('Reconstructed text:', reconstructedText);

      // Extract and parse the JSON from the reconstructed text
      analysisData = extractAndParseJSON(reconstructedText);
      console.log('✅ Parsed Analysis:', analysisData);

      setAnalysisResult(analysisData);
    } catch (e) {
      console.error('Error parsing JSON:', e, '\nRaw:', result);
      throw new Error(`Analysis parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    // Convert to SkillMatch format
    const skills: SkillMatch[] = analysisData.extractedSkills.map(skill => ({
      skill: skill.skill,
      required: skill.required,
      present: currentSkills.some(current => 
        current.toLowerCase().includes(skill.skill.toLowerCase()) ||
        skill.skill.toLowerCase().includes(current.toLowerCase())
      ),
      importance: skill.importance,
      category: skill.category
    }));

    setSkillMatches(skills);

    // Pre-select missing required skills
    const missingRequired = skills
      .filter(skill => skill.required && !skill.present)
      .map(skill => skill.skill);
    setSelectedSkills(new Set(missingRequired));

    setCurrentStep('selection');
  } catch (error) {
    console.error('Analysis failed:', error);
    setErrorMessage(error instanceof Error ? error.message : 'Analysis failed');
    setCurrentStep('error');
  } finally {
    setIsProcessing(false);
  }
};
  const handleSkillToggle = (skill: string) => {
    const newSelected = new Set(selectedSkills);
    if (newSelected.has(skill)) {
      newSelected.delete(skill);
    } else {
      newSelected.add(skill);
    }
    setSelectedSkills(newSelected);
  };
function flattenChunks(flatResponse: any): string {
  if (Array.isArray(flatResponse)) {
    return flatResponse.join('');
  }

  // Handles the broken object where every key is "0"
  if (typeof flatResponse === 'object') {
    const entries = Object.entries(flatResponse);
    const flatStrings = entries
      .map(([_, value]) => (typeof value === 'string' ? value : ''))
      .join('');
    return flatStrings;
  }

  return String(flatResponse);
}

 const handleGenerateResume = async () => {
    setIsProcessing(true);
    setCurrentStep('generation');
    setErrorMessage('');
    
    try {
      // Use parsed resume data if available, otherwise use current resume data
      const baseResumeData = parsedResumeData || resumeData;
      
      const response = await fetch('/api/ai/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          selectedSkills: Array.from(selectedSkills),
          currentResume: baseResumeData,
          experienceLevel: analysisResult?.experienceLevel || 'mid'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          fullResponse += chunk;
        }
      }

      let generatedResume: any;
      console.log(`fullResponse:${fullResponse}`);

      try {
        // Parse the streaming response to extract the actual content
        const reconstructedText = parseStreamingResponse(fullResponse);
        console.log('Reconstructed text:', reconstructedText);

        // Extract and parse the JSON from the reconstructed text
        generatedResume = extractAndParseJSON(reconstructedText);
        console.log('✅ Parsed Resume:', generatedResume);
 resumeSuccessToast()

      } catch (e) {
        console.error('❌ Failed to parse generated resume:', e);
        throw new Error(`Resume parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }

      // Merge generated content with base resume data (uploaded or current)
      const enhancedResume: ResumeValues = {
        ...baseResumeData,
        summary: generatedResume.summary || baseResumeData.summary,
        skillSections: generatedResume.skillSections || baseResumeData.skillSections || [],
        workExperiences: generatedResume.workExperiences?.length > 0 
          ? generatedResume.workExperiences 
          : baseResumeData.workExperiences || [],
        projects: generatedResume.projects?.length > 0 
          ? generatedResume.projects 
          : baseResumeData.projects || []
      };

      setResumeData(enhancedResume);
      setCurrentStep('complete');
    } catch (error) {
      console.error('Generation failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Resume generation failed');
      setCurrentStep('error');
    } finally {
      setIsProcessing(false);
    }
};

/**
 * Parse streaming response and reconstruct the original text
 */
function parseStreamingResponse(fullResponse: string): string {
  try {
    let reconstructedText = '';
    
    // Split the response into lines and process each line
    const lines = fullResponse.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Look for lines that contain token data (format: 0:"text")
      const tokenMatch = trimmedLine.match(/^0:"(.*)"/);
      if (tokenMatch) {
        // Unescape the content and add to reconstructed text
        let content = tokenMatch[1];
        
        // Handle escaped characters
        if(content)
        content = content
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\');
        
        reconstructedText += content;
      }
    }
    
    return reconstructedText;
  } catch (error) {
    console.error('Error parsing streaming response:', error);
    throw new Error('Failed to parse streaming response');
  }
}

/**
 * Extract and parse JSON from the reconstructed text
 */
function extractAndParseJSON(text: string): any {
  try {
    // Remove any leading/trailing whitespace
    text = text.trim();
    
    // Find the JSON block
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error('No valid JSON block found in the response');
    }
    
    let jsonString = text.slice(startIndex, endIndex + 1);
    
    // Clean up common formatting issues from AI responses
    jsonString = jsonString
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();
    
    // Apply generic tokenization fixes
    jsonString = fixTokenizationArtifacts(jsonString);
    
    // Try to parse the JSON
    const parsed = JSON.parse(jsonString);
    
    // Validate the structure
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Parsed result is not a valid object');
    }
    
    return parsed;
    
  } catch (error) {
    console.error('Error extracting/parsing JSON:', error);
    console.error('Problematic text:', text.substring(0, 500) + '...');
    
    // Try a more aggressive approach for malformed JSON
    try {
      return attemptJSONRepair(text);
    } catch (repairError) {
      throw new Error(`JSON parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Generic function to fix tokenization artifacts
 */
function fixTokenizationArtifacts(jsonString: string): string {
  // Pattern 1: Fix broken words that are split with spaces (common in tokenization)
  // This looks for patterns where individual characters or short segments are separated by spaces
  // within what should be a single word/identifier
  
  // Find all quoted strings (values) and fix tokenization within them
  jsonString = jsonString.replace(/"([^"]*?)"/g, (match, content) => {
    // Only fix if it looks like a tokenized technical term or identifier
    if (shouldFixTokenization(content)) {
      const fixed = fixTokenizedString(content);
      return `"${fixed}"`;
    }
    return match;
  });
  
  return jsonString;
}

/**
 * Determine if a string looks like it has tokenization artifacts
 */
function shouldFixTokenization(str: string): boolean {
  // Check for patterns that suggest tokenization:
  // 1. Single letters followed by spaces (e.g., "G r a p h Q L")
  // 2. Common technical abbreviations split up
  // 3. CamelCase or compound words split
  
  const tokenizationPatterns = [
    /\b[A-Z]\s+[A-Z]\s+[A-Z]/i, // Multiple single letters with spaces
    /\b\w\s+\w\s+\w/,           // Single chars with spaces (broader)
    /[a-z]\s+[A-Z]/,            // Likely camelCase split
    /\.\s*[a-z]/i,              // Extension split (like .js, .NET)
    /-\s*[a-z]/i,               // Hyphenated words split
  ];
  
  return tokenizationPatterns.some(pattern => pattern.test(str));
}

/**
 * Fix tokenized strings using intelligent reconstruction
 */
function fixTokenizedString(str: string): string {
  let fixed = str;
  
  // Remove spaces between single characters that form technical terms
  // This is more generic than hardcoded replacements
  
  // Pattern 1: Join single letters that likely form acronyms
  fixed = fixed.replace(/\b([A-Z])\s+([A-Z])\s+([A-Z])/g, '$1$2$3');
  fixed = fixed.replace(/\b([A-Z])\s+([A-Z])/g, '$1$2');
  
  // Pattern 2: Fix common file extensions
  fixed = fixed.replace(/\.\s*([a-z]{2,4})\b/gi, '.$1');
  
  // Pattern 3: Fix hyphenated compound words
  fixed = fixed.replace(/(\w+)\s*-\s*(\w+)/g, '$1-$2');
  
  // Pattern 4: Fix camelCase words (letter followed by capital letter)
  fixed = fixed.replace(/([a-z])\s+([A-Z])/g, '$1$2');
  
  // Pattern 5: Fix common technical term patterns
  // This catches things like "Tensor Flow" -> "TensorFlow"
  fixed = fixed.replace(/(\w+)\s+([A-Z]\w*)/g, (match, first, second) => {
    // Only join if it looks like a compound technical term
    if (first.length <= 8 && second.length <= 8) {
      return first + second;
    }
    return match;
  });
  
  // Pattern 6: Fix version numbers or technical identifiers
  fixed = fixed.replace(/([a-zA-Z]+)\s+(\d+)/g, '$1$2');
  
  // Pattern 7: Clean up any remaining multiple spaces
  fixed = fixed.replace(/\s+/g, ' ').trim();
  
  return fixed;
}

/**
 * Attempt to repair malformed JSON
 */
function attemptJSONRepair(text: string): any {
  // Remove everything before the first { and after the last }
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');
  
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('No JSON structure found');
  }
  
  let jsonString = text.slice(startIndex, endIndex + 1);
  
  // More aggressive cleaning
  jsonString = jsonString
    .replace(/,(\s*[\]}])/g, '$1') // Remove trailing commas
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Quote unquoted keys
    .replace(/:\s*([a-zA-Z_]\w*)\s*([,\]}])/g, ':"$1"$2') // Quote unquoted string values
    .replace(/\n\s*/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return JSON.parse(jsonString);
}

  const renderErrorStep = () => (
    <div className="text-center space-y-4">
      <AlertCircle className="w-16 h-16 mx-auto text-red-600" />
      <h3 className="text-xl font-semibold text-red-600">Something went wrong</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        {errorMessage}
      </p>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => setCurrentStep('input')}>
          Start Over
        </Button>
        <Button onClick={() => {
          setErrorMessage('');
          if (currentStep === 'error' && skillMatches.length > 0) {
            setCurrentStep('selection');
          } else {
            setCurrentStep('input');
          }
        }}>
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderInputStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Bot className="w-12 h-12 mx-auto text-blue-600" />
        <h2 className="text-2xl font-semibold">AI Resume Generator</h2>
        <p className="text-muted-foreground">
          Generate an ATS-optimized resume tailored to your target job
        </p>
      </div>

      {/* Upload existing resume */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Step 1: Upload Existing Resume (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedResume ? (
            <div className="border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {uploadedResume.name}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Resume uploaded and parsed successfully
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeUploadedResume}
                  className="text-green-600 hover:text-green-800 hover:bg-green-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload your current resume to enhance it, or skip to create from scratch
              </p>
              <div className="flex flex-col items-center gap-2">
                <Button 
                  variant="outline" 
                  disabled={isUploadingResume}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  {isUploadingResume ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume
                    </>
                  )}
                </Button>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  PDF files only
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Description Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Step 2: Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the complete job description here...

Example:
We are looking for a Senior Frontend Developer with 5+ years of experience in React, TypeScript, and modern web technologies. The ideal candidate will have experience with Node.js, GraphQL, and cloud platforms like AWS..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleJobAnalysis}
              disabled={!jobDescription.trim() || isProcessing}
              className="px-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Job Requirements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalysisStep = () => (
    <div className="text-center space-y-4">
      <Bot className="w-16 h-16 mx-auto text-blue-600 animate-pulse" />
      <h3 className="text-xl font-semibold">Analyzing Job Description...</h3>
      <p className="text-muted-foreground">
        Our AI is extracting key requirements and matching them with your profile
      </p>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          ✓ Extracting required skills and technologies
        </div>
        <div className="text-sm text-muted-foreground">
          ✓ Identifying experience requirements
        </div>
        <div className="text-sm text-muted-foreground">
          ✓ Analyzing keyword patterns
        </div>
      </div>
    </div>
  );

  const renderSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
        <h3 className="text-xl font-semibold">Skills Analysis Complete</h3>
        <p className="text-muted-foreground">
          Select skills to emphasize in your generated resume
        </p>
      </div>

      {uploadedResume && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Using uploaded resume: {uploadedResume.name}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  AI will enhance your existing content with job-specific optimizations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{analysisResult.matchAnalysis.totalSkills}</div>
                <div className="text-sm text-muted-foreground">Total Skills Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{analysisResult.matchAnalysis.matchingSkills}</div>
                <div className="text-sm text-muted-foreground">Skills You Have</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{analysisResult.matchAnalysis.missingCritical.length}</div>
                <div className="text-sm text-muted-foreground">Missing Critical Skills</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Skills Found in Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillMatches.map((skillMatch) => (
              <div
                key={skillMatch.skill}
                className={cn(
                  "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all",
                  selectedSkills.has(skillMatch.skill)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                )}
                onClick={() => handleSkillToggle(skillMatch.skill)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedSkills.has(skillMatch.skill)}
                    onChange={() => handleSkillToggle(skillMatch.skill)}
                    className="rounded"
                  />
                  <span className="font-medium">{skillMatch.skill}</span>
                  {skillMatch.present && (
                    <Badge variant="secondary" className="text-xs">
                      Present
                    </Badge>
                  )}
                  {skillMatch.category && (
                    <Badge variant="outline" className="text-xs">
                      {skillMatch.category}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  {skillMatch.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      skillMatch.importance === 'high' ? 'border-red-500 text-red-600' :
                      skillMatch.importance === 'medium' ? 'border-yellow-500 text-yellow-600' :
                      'border-gray-500 text-gray-600'
                    )}
                  >
                    {skillMatch.importance}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedSkills.size} skills selected for emphasis
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep('input')}>
                Back
              </Button>
              <Button onClick={handleGenerateResume} disabled={selectedSkills.size === 0}>
                <Bot className="w-4 h-4 mr-2" />
                Generate Resume
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGenerationStep = () => (
    <div className="text-center space-y-4">
      <Bot className="w-16 h-16 mx-auto text-blue-600 animate-pulse" />
      <h3 className="text-xl font-semibold">Generating Your Resume...</h3>
      <p className="text-muted-foreground">
        Creating ATS-optimized content with your selected skills
      </p>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          ✓ Optimizing professional summary
        </div>
        <div className="text-sm text-muted-foreground">
          ✓ Organizing skills by category
        </div>
        <div className="text-sm text-muted-foreground">
          ✓ Ensuring ATS compatibility
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
      <h3 className="text-xl font-semibold">Resume Generated Successfully!</h3>
      <p className="text-muted-foreground">
        Your ATS-optimized resume has been generated and applied to the canvas
      </p>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {uploadedResume && (
              <div className="flex items-center justify-between">
                <span>Source Resume:</span>
                <Badge variant="secondary">{uploadedResume.name}</Badge>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>Skills Added:</span>
              <Badge>{selectedSkills.size} skills</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>ATS Score:</span>
              <Badge variant="secondary">Analyzing...</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Professional Summary:</span>
              <Badge variant="secondary">Enhanced</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => setCurrentStep('input')}>
          Generate Another
        </Button>
        <Button onClick={() => onSwitchToEdit?.()}>
          Continue Editing
        </Button>
      </div>
    </div>
  );

  const stepContent = {
    input: renderInputStep,
    analysis: renderAnalysisStep,
    selection: renderSelectionStep,
    generation: renderGenerationStep,
    complete: renderCompleteStep,
    error: renderErrorStep
  };

  return (
    <div className="p-6">
      {stepContent[currentStep]()}
    </div>
  );
} 