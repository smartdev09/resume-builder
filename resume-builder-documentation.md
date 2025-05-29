# Resume Builder Documentation

This document provides a comprehensive overview of the Resume Builder project, its structure, applications, and components. 

## Project Structure

The project is a monorepo managed by Turbo. It consists of the following main directories:

- **`apps/`**: Contains the main applications of the project.
  - `resume/`: The main resume builder application.
- **`packages/`**: Contains shared libraries and configurations used across different applications.
  - `ui/`: Shared UI components.
  - `database/`: Database schema, migrations, and query utilities.
  - `utils/`: Shared utility functions.
  - `eslint-config/`: Shared ESLint configurations.
  - `typescript-config/`: Shared TypeScript configurations.

## `apps/resume` Detailed Documentation

### `apps/resume` Overview

The `resume` application is the core of the Resume Builder project. It is a Next.js application responsible for the user interface and user experience of creating and managing resumes.

**Key Features and Technologies:**

- **Framework:** Next.js 15 (with React 19)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, and a shared `ui` package.
- **State Management:** Likely a combination of React context and local component state, potentially with React Hook Form for form state.
- **Drag and Drop:** Implemented using `@dnd-kit` for an interactive resume building experience.
- **Rich Text Editing:** Uses `react-quill` for editing resume sections with formatting options.
- **Authentication:** `next-auth` is used for user authentication.
- **Form Handling:** `react-hook-form` for efficient and validated form submissions.
- **File Uploads:** Uses `@vercel/blob` for handling file uploads, likely for profile pictures or resume templates.
- **Date Handling:** `date-fns` for date formatting and manipulation.
- **Printing:** `react-to-print` enables users to print their resumes.

**Scripts:**

- `dev`: Starts the Next.js development server with Turbo (`next dev --turbo`).
- `build`: Builds the application for production (`next build`).
- `start`: Starts the production server (`next start`).
- `lint`: Lints the codebase (`next lint`).

**Directory Structure (`apps/resume`):**

- **`app/`**: Contains the core application logic, including pages, layouts, and API routes (using the Next.js App Router).
- **`components/`**: Contains React components specific to the `resume` application (e.g., `Navbar`, `SignInForm`).
- **`public/`**: Static assets like images and fonts.
- **`types/`**: TypeScript type definitions specific to the `resume` application.
- **`middleware.ts`**: Next.js middleware for handling requests, potentially for authentication or routing.
- **Configuration Files:**
    - `next.config.ts`: Next.js configuration.
    - `tailwind.config.ts`: Tailwind CSS configuration.
    - `postcss.config.mjs`: PostCSS configuration.
    - `tsconfig.json`: TypeScript configuration.
    - `eslint.config.mjs`: ESLint configuration.
    - `.env`: Environment variables (should not be committed to version control).

### Pages and Layouts (`apps/resume/app/`)

- **`layout.tsx` (Root Layout):**
    - **Purpose:** Sets up the global structure for all pages in the `resume` application.
    - **Key Features:**
        - Wraps the application in `SessionProvider` (from `next-auth/react`).
        - Implements `ThemeProvider` (from `next-themes`) for light/dark mode.
        - Includes a global `Toaster` and renders a `Navbar` component.
        - Imports global CSS from `@resume/ui/globals.css`.

- **`page.tsx` (Root Page - Landing Page):**
    - **Purpose:** Serves as the main landing page.
    - **Route:** `/`
    - **Content:** Hero section with CTAs ("Build your resume", "Star us"). Links to `/editor` or sign-in.

- **`(auth)/sign-in/page.tsx`:**
    - **Purpose:** Displays the sign-in page.
    - **Route:** `/sign-in`
    - **Content:** Renders the `SignInForm` component (from `apps/resume/components/`).

- **`(main)/layout.tsx` (Main Group Layout):**
    - **Purpose:** Basic layout for authenticated user experience pages.
    - **Content:** Simple flex container.

- **`(main)/editor/page.tsx` (Resume Editor Page):**
    - **Purpose:** Main page for creating/editing resumes.
    - **Route:** `/editor`
    - **Functionality:** Server component that fetches resume data (if `resumeId` in params) and passes it to `ResumeEditor.tsx`.
        - **Note:** Uses a hardcoded `userid` for fetching and creating resumes in `actions.ts`. This needs to be replaced with the logged-in user's ID.
    - Renders `ResumeEditor.tsx`.

#### Editor Components and Functionality (`apps/resume/app/(main)/editor/`)

This section details the components that make up the resume editor interface.

- **`ResumeEditor.tsx` (Main Editor Component):**
    - **Purpose:** Orchestrates the resume editing experience.
    - **Layout:** Three-panel resizable layout (Forms, Preview, Template Selector).
    - **State:** Manages `resumeData`, `selectedTemplate`, etc.
    - **Features:** Step navigation via URL search params, `DOMPurify` for summary sanitization, `useAutoSaveReume` hook, `useUnloadWarning` hook. Renders `Breadcrumbs`, dynamic form components, `ResumePreviewSection`, `TemplateSelector`, and `Footer`.

- **`actions.ts` (Server Actions):**
    - **`saveResume(values: ResumeValues)`:** Server action to create/update resume. Handles authentication, validation, photo uploads to Vercel Blob, and Prisma DB operations.
        - **Note:** Hardcoded `userid` in create operation.

- **`steps.ts` (Form Step Definitions):**
    - Defines an array of objects for each editor step (title, component, key). Imports form components from `./forms/`.
    - **Steps:** General Info, Personal Info, Work Experience, Education, Skill, Summary, Projects, Languages, Certifications.

- **`useAutoSaveResume.tsx` (Custom Hook):**
    - **Purpose:** Handles automatic saving of resume data.
    - **Functionality:** Debounces `resumeData`, compares with last saved state, calls `saveResume` server action if changes are detected. Manages `isSaving` and `hasUnsavedData` states. Shows error toasts with retry. Updates URL with new `resumeId`.

- **`Breadcrumbs.tsx`:**
    - **Purpose:** Renders navigation breadcrumbs for the editor steps.
    - **Functionality:** Maps over `steps.ts` to display clickable step titles. Uses UI components from `@resume/ui/breadcrumb`, `LottieAnimation`, and custom icons.

- **`Footer.tsx` (Editor Footer):**
    - **Purpose:** Provides navigation and resume styling controls at the bottom of the editor.
    - **Controls:**
        - "Previous step" / "Next step" buttons.
        - Toggle preview visibility button (mobile).
        - `ColorPicker` for primary/secondary resume colors.
        - `BorderStyleButton` for profile picture/element border style.
        - Two `FontSizeSelector` instances (for headings and body text).
        - `FontStyleSelector` for resume font family.
        - "Close" button (links to `/resumes`).
        - "Saving..." indicator.

- **Styling Control Components:**
    - **`BorderStyleButton.tsx`:** Cycles through "square", "circle", "squircle" border styles using Lucide icons.
    - **`ColorPicker.tsx`:** Uses a Popover with two `<input type="color">` for primary and secondary colors.
    - **`FontSizeSelector.tsx`:** Popover with a Slider to adjust font size. Max value differs based on `label` prop.
    - **`FontStyleSelector.tsx`:** Select dropdown for choosing font families (e.g., "Calibri", "Arial").

- **Preview and Template Components:**
    - **`ResumePreviewSection.tsx`:**
        - **Purpose:** Renders the selected resume template with current `resumeData`.
        - **Functionality:** Dynamically selects a template component from an array (e.g., `Template1`, `Template2` from `./Templates/`) based on `selectedTemplate` prop and passes data to it.
    - **`TemplateSelector.tsx`:**
        - **Purpose:** Allows users to choose a resume template.
        - **Functionality:** Displays a grid of clickable template preview images (`/assets/images/template*.jpg/png`). Calls `onSelectTemplate` prop on click.
    - **`Templates/` (Directory):**
        - Contains individual template components (`Template1.tsx` - `Template14.tsx`). These are responsible for the visual layout and rendering of the resume data in different styles.

##### Editor Form Components (`apps/resume/app/(main)/editor/forms/`)

- **Purpose:** Individual form components for each step in `steps.ts`.
- **Common Pattern:** Use `react-hook-form`, Zod validation, `useEffect` with `form.watch()` for auto-update of `resumeData` passed from `ResumeEditor.tsx`.
- **Forms:**
    - **`GeneralInfoForm.tsx`:** Fields for resume `title` and `description` (not shown on resume).
    - **`PersonalInfoForm.tsx`:** Fields for `photo` (file input), name, email, contact details, job title, location.
    - **`WorkExperienceForm.tsx`:** Manages a sortable list of work experiences using `useFieldArray` and `@dnd-kit`. Uses `WorkExperienceItem.tsx`.
    - **`EducationForm.tsx`:** Manages a list of education entries using `useFieldArray`. Uses `EducationItem.tsx`. (No DND).
    - **`SkillForm.tsx`:** Textarea for comma-separated skills, processed into an array.
    - **`SummaryForm.tsx`:** Uses `ReactQuill` (rich text editor) with a custom `QuillToolbar.tsx` for professional summary.
    - **`QuillToolbar.tsx`:** Toolbar for `ReactQuill` with Bold, Italic, Underline, List buttons.
    - **`ProjectForm.tsx`:** Sortable list of projects using `useFieldArray` and `@dnd-kit`. Uses `ProjectItem.tsx`.
    - **`LanguageForm.tsx`:** Sortable list of languages using `useFieldArray` and `@dnd-kit`. Uses `LanguageItem.tsx`.
        - **Note:** `append` function in `LanguageForm.tsx` has irrelevant placeholder fields.
    - **`CertificationForm.tsx`:** Sortable list of certifications using `useFieldArray` and `@dnd-kit`. Uses `CertificationItem.tsx`.

##### Editor Item Components (`apps/resume/app/(main)/editor/*Item.tsx`)

- **Purpose:** Render individual entries within the list forms (e.g., one work experience).
- **Common Pattern:** Receive `form`, `index`, `remove` props. Use `FormField`. If sortable, use `useSortable` and a drag handle.
- **Item Components:**
    - **`WorkExperienceItem.tsx`:** Sortable. Fields: position, company, dates, description.
    - **`EducationItem.tsx`:** Not sortable. Fields: degree, school, dates. (Has non-functional drag handle icon).
    - **`ProjectItem.tsx`:** Sortable. Fields: name, role, dates, description.
    - **`LanguageItem.tsx`:** Sortable. Fields: name (input), proficiency (select).
    - **`CertificationItem.tsx`:** Sortable. Fields: name, source, completion date, link.

### Other Main Pages (`apps/resume/app/(main)/`)

- **`resumes/page.tsx` & `resumes/ResumesList.tsx` & `resumes/actions.ts`:**
    - **Purpose:** Likely for listing, managing, and deleting existing user resumes. (Content not fully read, details based on typical functionality).
    - `page.tsx` would fetch and display `ResumesList.tsx`.
    - `ResumesList.tsx` would render the list and offer actions like edit, delete, preview.
    - `actions.ts` would contain server actions for deleting resumes.

- **`settings/page.tsx` & `settings/UpdateNameForm.tsx` & `settings/actions.ts`:**
    - **Purpose:** User account settings, e.g., updating profile name. (Content not fully read).
    - `page.tsx` would fetch user data and render forms like `UpdateNameForm.tsx`.
    - `UpdateNameForm.tsx` for changing user name.
    - `actions.ts` for server actions like `updateUsername`.

- **`api/` & `[...nextauth]/`:**
    - **`api/auth/[...nextauth]/route.ts` (standard NextAuth.js route handler):** Handles authentication requests (sign-in, sign-out, session management) using the NextAuth.js configuration from `packages/utils/src/auth.ts`.
    - Other API routes (e.g., `api/star/route.ts` - purpose not fully clear, potentially for starring/favoriting resumes or the app itself).


## `packages/` Detailed Documentation

### `packages/ui`

The `@resume/ui` package provides a set of shared React components and hooks used throughout the applications. It helps maintain a consistent look and feel and promotes code reusability.

**Key Features and Technologies:**

- **Component Library:** Exports various UI components such as `Button`, `Badge`, `Card`, `Dialog`, `DropdownMenu`, `Input`, `Label`, `Popover`, `Textarea`, `Tooltip`, `Toast`, `Toaster`, `Sidebar`, `Separator`, `Resizable`, `Select`, `Slider`, `Sheet`, and `Skeleton`. These are likely wrappers around or re-exports of Radix UI primitives, styled with Tailwind CSS.
- **Custom Components:** Includes more complex, application-specific shared components like `Navbar`, `Shell` (application shell/layout), `ResumePreview` (a base resume preview component), `ThemeToggle`, and `UserButton`.
- **Styling:** Uses Tailwind CSS for styling, with a local `tailwind.config.ts` and `globals.css`.
- **Utility Functions:** Provides `cn` (a utility for conditional class names, using `clsx` and `tailwind-merge`).
- **Custom Hooks:** Exports several custom React hooks:
    - `use-app-shell`: For managing application shell state.
    - `use-dimensions`: For getting element dimensions.
    - `use-unload-warning`: For warning users about unsaved changes.
    - `use-debounce`: For debouncing function calls.
    - `use-toast`: For displaying toast notifications (likely using the `Toaster` component).
    - `useResumeColors`: For managing resume color schemes.
- **State Management:** Uses Zustand for some local state management within UI components.

**Structure:**

- **`src/components/ui/`**: Contains the individual, generic UI components.
- **`src/components/`**: Contains more complex or application-specific shared components.
- **`hooks/`**: Contains custom React hooks.
- **`lib/`**: Contains utility functions like `cn`.
- **`styles/`**: Contains global styles.

**Scripts:**

- `lint`: Lints the package.
- `generate:component`: A script using `turbo gen react-component` to scaffold new React components.
- `check-types`: Performs TypeScript type checking.

### `packages/database`

The `@resume/db` package is responsible for all database interactions. It uses Prisma as its ORM.

**Key Features and Technologies:**

- **ORM:** Prisma
- **Database:** PostgreSQL (as defined in `schema.prisma`)
- **Schema:** The `prisma/schema.prisma` file defines the following models:
    - `User`, `Account`, `Session`, `VerificationToken`: Standard NextAuth.js models.
    - `Resume`: Main model for resume data (title, description, photoUrl, styling, personal details, skills, and relations to `WorkExperience` and `Education`).
    - `WorkExperience`: Stores work experience details.
    - `Education`: Stores education details.
- **Prisma Client:** The package exports the Prisma client from `src/index.ts`.

**Structure:**

- **`prisma/`**: Contains `schema.prisma` and migration files.
- **`src/`**: Contains Prisma client initialization (`src/index.ts`).
- **`.env`**: Contains `DATABASE_URL`.

**Scripts:**

- `db:generate`: Generates Prisma client.
- `db:push`: Pushes schema changes to the database (development).

### `packages/utils`

The `utils` package provides shared utility functions, types, validation schemas, and authentication configurations.

**Key Exports and Functionality:**

- **`getSession.ts`**: Cached `auth` function (NextAuth.js) for session retrieval.
- **`prisma.ts`**: Singleton Prisma client instance.
- **`types.ts`**: Shared TypeScript types (`EditorFormProps`, `ResumeServerData`).
- **`utils.ts`**: General utilities (`cn`, `fileReplacer` for `JSON.stringify`, `mapToResumeValues` for data transformation).
- **`validations.ts`**: Zod schemas for all resume sections and combined `resumeSchema`.
- **`auth.ts`**: NextAuth.js configuration (Prisma adapter, GitHub provider, JWT strategy, callbacks, redirects).

**Dependencies:** `next-auth`, `@auth/prisma-adapter`, `prisma`, `zod`, `clsx`, `tailwind-merge`.

### `packages/eslint-config`

The `@repo/eslint-config` package provides shared ESLint configurations.

**Key Features:**

- **Shared Configurations:** `base.js`, `next.js`, `react-internal.js`.
- **Dependencies:** Various ESLint plugins and parsers for TypeScript, React, Next.js, Prettier, Turbo.

### `packages/typescript-config`

The `@repo/typescript-config` package provides shared TypeScript `tsconfig.json` configurations.

**Key Features:**

- **Shared `tsconfig.json` Files:** `base.json`, `nextjs.json`, `react-library.json`.
- **Purpose:** Ensure consistent TypeScript settings and reduce boilerplate.

---
*This documentation provides a high-level overview. For component-specific props and detailed implementation, refer to the source code.* 