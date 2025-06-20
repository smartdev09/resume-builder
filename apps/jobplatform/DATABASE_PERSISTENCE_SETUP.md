# Database Persistence Implementation

This document outlines the database persistence features implemented for the Job Platform.

## Overview

The job platform now supports persistent storage for:
1. **User Job Preferences** - Onboarding data (job function, type, location, remote preferences, sponsorship needs)
2. **Job Interactions** - User actions on jobs (liked, applied, saved externally, viewed)

## Database Schema

### New Tables Added

#### 1. `user_job_preferences`
Stores user preferences from the onboarding process:
- `id` - Unique identifier
- `userId` - Reference to user
- `jobFunction` - Desired job function/role
- `jobType` - Employment type (Full-time, Part-time, Contract, etc.)
- `location` - Preferred location
- `openToRemote` - Whether user is open to remote work
- `needsSponsorship` - Whether user needs visa sponsorship
- `isActive` - Whether this preference set is currently active
- `createdAt`, `updatedAt` - Timestamps

#### 2. `job_interactions`
Stores user interactions with specific jobs:
- `id` - Unique identifier
- `userId` - Reference to user
- `jobId` - Reference to scraped job
- `interactionType` - Type of interaction (LIKED, APPLIED, SAVED_EXTERNAL, VIEWED)
- `notes` - Optional notes from user
- `appliedAt` - Timestamp for applications
- `createdAt`, `updatedAt` - Timestamps
- **Unique constraint** on `(userId, jobId, interactionType)` to prevent duplicates

## API Endpoints

### User Preferences
- `POST /api/user-preferences` - Save user job preferences
- `GET /api/user-preferences?userEmail=<email>` - Get user preferences

### Job Interactions
- `POST /api/job-interactions` - Save job interaction
- `GET /api/job-interactions?userEmail=<email>&type=<LIKED|APPLIED|SAVED_EXTERNAL>` - Get interactions
- `DELETE /api/job-interactions` - Remove specific interaction

## Service Classes

### UserPreferencesService
Located: `apps/jobplatform/services/user-preferences-service.ts`

Methods:
- `savePreferences(preferences)` - Save user job preferences
- `getPreferences(userEmail)` - Get user preferences
- `hasExistingPreferences(userEmail)` - Check if user has preferences

### JobInteractionsService
Located: `apps/jobplatform/services/job-interactions-service.ts`

Methods:
- `saveInteraction(params)` - Save generic interaction
- `likeJob(userEmail, jobId)` - Like a job
- `unlikeJob(userEmail, jobId)` - Unlike a job
- `markJobAsApplied(userEmail, jobId, notes?)` - Mark job as applied
- `saveJobExternal(userEmail, jobId, notes?)` - Save job for external application
- `getInteractions(userEmail, type?)` - Get user interactions
- `getJobInteractionStatus(userEmail, jobIds[])` - Get interaction status for multiple jobs

## Component Updates

### OnboardingSteps Component
- Now saves user preferences to database after completing onboarding
- Preferences are saved before job matching begins
- Falls back gracefully if database save fails

### JobrightListing Component
- Loads existing job interactions on component mount
- All job actions (like, apply, save external) now persist to database
- Real-time updates with optimistic UI updates
- Error handling with user feedback via toasts

## Features

### Data Persistence
- **User preferences** survive browser refreshes and sessions
- **Job interactions** are maintained across sessions
- **Automatic loading** of existing data when components mount

### Error Handling
- Graceful fallbacks when database operations fail
- User feedback via toast notifications
- Console logging for debugging

### Performance
- **Optimistic updates** - UI updates immediately, database sync in background
- **Batch loading** - Load interaction status for multiple jobs efficiently
- **Unique constraints** prevent duplicate interactions

## Authentication Note

Currently using placeholder user email (`user@example.com`) for development.
TODO: Integrate with NextAuth or similar authentication system to get real user data.

## Usage Examples

### Save User Preferences (After Onboarding)
```typescript
await UserPreferencesService.savePreferences({
  jobFunction: "Software Engineer",
  jobType: "Full-time",
  location: "San Francisco, CA",
  openToRemote: true,
  needsSponsorship: false,
  userEmail: "user@example.com"
});
```

### Like a Job
```typescript
await JobInteractionsService.likeJob("user@example.com", 12345);
```

### Get User's Liked Jobs
```typescript
const likedJobs = await JobInteractionsService.getLikedJobs("user@example.com");
```

## Database Migration

The database migration `20250618083706_add_user_preferences_and_job_interactions` has been applied to create the new tables.

To regenerate Prisma client after schema changes:
```bash
cd packages/database
npx prisma generate
```

## Testing

The implementation includes comprehensive error handling and fallbacks:
- Database connection failures won't break the UI
- Failed saves show error messages to users
- Components work with or without database connectivity 