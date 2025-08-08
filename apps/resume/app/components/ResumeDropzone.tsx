import { useState } from "react";
import { Lock, X } from "lucide-react";
import { parseResumeFromPdf } from "utils/lib/parse-resume-from-pdf";
import {
  getHasUsedAppBefore,
  saveStateToLocalStorage,
} from "utils/lib/redux/local-storage";
import { type ShowForm, initialSettings } from "utils/lib/redux/settingsSlice";
import { useRouter } from "next/navigation";
// import addPdfSrc from "../../../public/assets/add-pdf.svg";
import Image from "next/image";
import { cx } from "utils/lib/cx";
import { deepClone } from "utils/lib/deep-clone";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@resume/ui/card";
import { Badge } from "@resume/ui/badge";
import { Button } from "@resume/ui/button";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
  playgroundView = false,
}: {
  onFileUrlChange: (fileUrl: string, file: File) => void;
  className?: string;
  playgroundView?: boolean;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasNonPdfFile, setHasNonPdfFile] = useState(false);
  const router = useRouter();

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl });
    onFileUrlChange(fileUrl, newFile);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile?.name.endsWith(".pdf")) {
      setHasNonPdfFile(false);
      setNewFile(newFile);
    } else {
      setHasNonPdfFile(true);
    }
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFile = files[0];
    if (newFile) {
      setNewFile(newFile);
    }
  };

  const onRemove = () => {
    setFile(defaultFileState);
    //@ts-ignore
    onFileUrlChange("", null);
  };

  const onImportClick = async () => {
    const resume = await parseResumeFromPdf(file.fileUrl);
    const settings = deepClone(initialSettings);

    // Set formToShow settings based on uploaded resume if users have used the app before
    if (getHasUsedAppBefore()) {
      const sections = Object.keys(settings.formToShow) as ShowForm[];
      const sectionToFormToShow: Record<ShowForm, boolean> = {
        workExperiences: resume.workExperiences.length > 0,
        educations: resume.educations.length > 0,
        projects: resume.projects.length > 0,
        skills: resume.skills.descriptions.length > 0,
        custom: resume.custom.descriptions.length > 0,
      };
      for (const section of sections) {
        settings.formToShow[section] = sectionToFormToShow[section];
      }
    }

    saveStateToLocalStorage({ resume, settings });
    router.push("/resume-builder");
  };

  return (
    <div className="relative z-10 max-w-3xl mx-auto py-12 md:py-24">
      <Card className={className}>
        <CardContent>
          <div
            className={cx(
              "flex justify-center rounded-md border-gray-300 px-6",
              isHoveredOnDropzone && "border-sky-400",
              playgroundView ? "pb-6 pt-4" : "py-12"
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setIsHoveredOnDropzone(true);
            }}
            onDragLeave={() => setIsHoveredOnDropzone(false)}
            onDrop={onDrop}
          >
            <div
              className={cx(
                "text-center",
                playgroundView ? "space-y-2" : "space-y-3"
              )}
            >
              {!hasFile && (
                <>
                  <p
                    className={cx(
                      "pt-3 text-black dark:text-white",
                      !playgroundView && "text-lg font-semibold"
                    )}
                  >
                    Browse a pdf file or drop it here
                  </p>
                  <p className="flex text-sm text-gray-500">
                    <Lock className="mr-1 mt-1 h-3 w-3 text-gray-400" />
                    File data is used locally and never leaves your browser
                  </p>
                </>
              ) }
              <div className="pt-4">
                {!hasFile ? (
                  <>
                    <label
                      className={cx(
                        "within-outline-theme-purple cursor-pointer bg-primary px-6 pb-2.5 pt-2 font-semibold shadow-sm hover:opacity-80 text-white dark:text-black",
                        playgroundView ? "border" : "bg-primary"
                      )}
                    >
                      Browse file
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={onInputChange}
                      />
                    </label>
                    {hasNonPdfFile && (
                      <p className="mt-6 text-red-400">Only pdf file is supported</p>
                    )}
                  </>
                ) : (
                  <>
                    {hasFile && playgroundView && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Badge variant="secondary">
                          {file.name} ({getFileSizeString(file.size)})
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={onRemove}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toPrecision(3) + " KB";
  } else {
    return fileSizeMB.toPrecision(3) + " MB";
  }
};
