// import { useState, forwardRef} from 'react';
// import { FilePond, registerPlugin, FilePondProps } from 'react-filepond';
// import 'filepond/dist/filepond.min.css';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
// import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// // Register any additional plugins
// registerPlugin(
//   FilePondPluginImagePreview,
//   FilePondPluginFileValidateType
//   );

// interface MyFilePondProps extends FilePondProps {
//   onFilesChange: (files: File[]) => void;
// }

// const MyFilePond = forwardRef<FilePond, MyFilePondProps>((props, ref) => {
//   const [files, setFiles] = useState<File[]>([]);

//   const handleFileChange = (fileItems: unknown[]) => {
//     if (Array.isArray(fileItems)) {
//       const newFiles = fileItems.map((fileItem) => {
//         if (typeof fileItem === "object" && fileItem !== null && "file" in fileItem) {
//           return (fileItem as { file: File }).file;
//         }
//         throw new Error("Invalid file item structure");
//       });
//       setFiles(newFiles);
//       props.onFilesChange(newFiles);
//     } else {
//       throw new Error("fileItems must be an array");
//     }
//   };

//   return (
//     <div className="style-filepond">
//       <FilePond
//         ref={ref}
//         {...props}
//         files={files}
//         onupdatefiles={handleFileChange}
//         maxFiles={6}
//         acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']}
//         labelFileTypeNotAllowed="Only PNG, JPG, SVG, or WebP files are allowed."
//         fileValidateTypeLabelExpectedTypes="Expects {allButLastType} or {lastType}"
//       />
//     </div>
//   );
// });
// MyFilePond.displayName = 'MyFilePond';
// export default MyFilePond;

import { useState, forwardRef } from "react";
import { FilePond, registerPlugin, FilePondProps } from "react-filepond";
import type { FilePondFile } from "filepond"; 
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

// Register plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

interface MyFilePondProps extends FilePondProps {
  onFilesChange: (files: File[]) => void;
}

const MyFilePond = forwardRef<FilePond, MyFilePondProps>(
  ({ onFilesChange, maxFiles = 1, ...props }, ref) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (fileItems: FilePondFile[]) => {
      const newFiles = fileItems
        .map((item) => item.file)
        .filter((f): f is File => f !== null); // ensure non-null
      setFiles(newFiles);
      onFilesChange(newFiles);
    };

    const safeMaxFiles = maxFiles ?? 1;

    return (
      <div className="style-filepond">
        <FilePond
          ref={ref}
          {...props}
          files={files}
          allowMultiple={safeMaxFiles > 1}
          maxFiles={safeMaxFiles}
          onupdatefiles={handleFileChange}
          acceptedFileTypes={["image/png", "image/jpeg", "image/svg+xml", "image/webp"]}
          labelFileTypeNotAllowed="Only PNG, JPG, SVG, or WebP files are allowed."
          fileValidateTypeLabelExpectedTypes="Expects {allButLastType} or {lastType}"
        />
      </div>
    );
  }
);

MyFilePond.displayName = "MyFilePond";
export default MyFilePond;









