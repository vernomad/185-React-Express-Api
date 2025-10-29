import sharp from "sharp";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";

// const dirPath =
//   process.env.NODE_ENV === "production"
//     ? path.join(process.cwd(), "clients/dist/assets")
//     : path.join(process.cwd(), "clients/public/assets");

// const baseDir = dirPath;
// const eventDir = path.join(baseDir, "event");
// in your image util
const baseDir = path.join(process.cwd(), "data/assets");
const eventDir = path.join(baseDir, "event");
const carsDir = path.join(baseDir, "car")


export async function deleteImg(slug: string, dir: string) {
  const targetPath = path.join(baseDir, slug);
  console.log("TargetDir:", targetPath);

  if (!targetPath.startsWith(baseDir)) {
    throw new Error("Unsafe path detected");
  }

  const imageName = dir.split("/").pop();
  console.log("Name of image:", imageName);

  if (!imageName) {
    throw new Error("Invalid image path");
  }

  try {
    const files = await fsPromises.readdir(targetPath);
    console.log("files:", files);

    let deleted = false;

    for (const f of files) {
      if (f === imageName || f === `thumbnail-${imageName}`) {
        await fsPromises.unlink(path.join(targetPath, f));
        console.log(`Deleted: ${f}`);
        deleted = true;
      }
    }

    if (deleted) {
      return { message: `Deleted ${imageName} (and thumbnail if present)` };
    } else {
      return { message: `No matching file found for ${imageName}` };
    }

  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.warn(`Directory not found for slug: ${slug}`);
      return null;
    } else {
      throw err;
    }
  }
}

export async function deleteImages(slug: string, dir: string) {
  const targetDir = path.join(baseDir, dir);
  const targetDirectory = path.join(targetDir, slug);

  // Ensure the path is inside the baseDir to prevent path traversal
  if (!targetDirectory.startsWith(baseDir)) {
    throw new Error("Unsafe path detected");
  }

  // Check if the directory exists
  if (fs.existsSync(targetDirectory)) {
    await fsPromises.rm(targetDirectory, { recursive: true, force: true });
    console.log(`Deleted images for slug: ${slug}`);
    return {
      message: `Deleted images for slug: ${slug}`
    }
  } else {
    console.warn(`Directory not found for slug: ${slug}`);
  }
}

export async function saveEventImage(file: Express.Multer.File, slug: string) {
  const targetDirectory = path.join(eventDir, slug); 
  await fsPromises.mkdir(targetDirectory, { recursive: true });

  const buffer = file.buffer;
  const originalExt = path.extname(file.originalname);
  const ext = [".jpg", ".jpeg", ".png"].includes(originalExt.toLowerCase())
    ? originalExt.toLowerCase()
    : ".png";

  const imageName =   `${slug}${ext}`
  const filePath = path.join(targetDirectory, imageName);
  const thumbnailPath = path.join(targetDirectory, `thumbnail-${slug}${ext}`);

  // --- Cleanup old files if they exist ---
  try {
    const files = await fsPromises.readdir(targetDirectory);
    for (const f of files) {
      // remove any old slug.* or thumbnail-slug.*
      if (f.startsWith(slug)) {
        await fsPromises.unlink(path.join(targetDirectory, f));
      }
    }
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err; // ignore folder-not-found
  }

  // --- Write new files ---
  await fsPromises.writeFile(filePath, buffer);

  const thumbnailBuffer = await sharp(buffer).resize(10).toBuffer();
  await fsPromises.writeFile(thumbnailPath, thumbnailBuffer);

  return {
    image: `/assets/event/${slug}/${slug}${ext}`,
    imageThumbnail: `/assets/event/${slug}/thumbnail-${slug}${ext}`
  };
}

export async function saveImage(file: Express.Multer.File, slug: string) {
  const targetDirectory = path.join(carsDir, slug);

  // Ensure directory exists
  await fsPromises.mkdir(targetDirectory, { recursive: true });

  const buffer = file.buffer;
  const originalExt = path.extname(file.originalname);
  const ext = [".jpg", ".jpeg", ".png"].includes(originalExt.toLowerCase())
    ? originalExt.toLowerCase()
    : ".png";

  const imageName = `${slug}${ext}`
  const filePath = path.join(targetDirectory, imageName);
  const thumbnailPath = path.join(targetDirectory, `thumbnail-${slug}${ext}`);

    // --- Cleanup old files if they exist ---
 try {
  const files = await fsPromises.readdir(targetDirectory);
  for (const f of files) {
    // remove only exact matches (e.g. slug.ext and thumbnail-slug.ext)
    if (f === imageName || f === `thumbnail-${slug}${ext}`) {
      await fsPromises.unlink(path.join(targetDirectory, f));
    }
  }
} catch (err: any) {
  if (err.code !== "ENOENT") throw err; // ignore folder-not-found errors
}

  // Save main image
  await fsPromises.writeFile(filePath, buffer);

  // Save thumbnail
  const thumbnailBuffer = await sharp(buffer).resize(10).toBuffer();
  await fsPromises.writeFile(thumbnailPath, thumbnailBuffer);

  return {
    mainImage: `/assets/car/${slug}/${slug}${ext}`,
    mainImageThumbnail: `/assets/car/${slug}/thumbnail-${slug}${ext}`
  };
}

export async function saveImages(files: Express.Multer.File[], slug: string) {
  const targetDirectory = path.join(carsDir, slug);
 await fsPromises.mkdir(targetDirectory, { recursive: true });

  // Read existing files
  const existingFiles = await fsPromises.readdir(targetDirectory);

  // Find the highest existing image index
  const existingIndices = existingFiles
    .map((file) => {
      const match = file.match(new RegExp(`^${slug}-(\\d+)\\.`));
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null);

  const startIndex = existingIndices.length > 0 ? Math.max(...existingIndices) + 1 : 1;
  // Process each file
  const results = await Promise.all(
    files.map(async (file, i) => {
      // Multer already gives you the file buffer
      const buffer = file.buffer;

      const originalExt = path.extname(file.originalname);
      const ext = [".jpg", ".jpeg", ".png"].includes(originalExt.toLowerCase())
        ? originalExt.toLowerCase()
        : ".png"; // fallback

      // Add (1), (2), etc.
      const fileIndex = startIndex + i;
      const baseName = `${slug}-${fileIndex}`;
      const filePath = path.join(targetDirectory, `${baseName}${ext}`);
      const thumbnailPath = path.join(
        targetDirectory,
        `thumbnail-${baseName}${ext}`
      );

      // Save original
      await fsPromises.writeFile(filePath, buffer);

      // Save thumbnail (resize width=10)
      const thumbnailBuffer = await sharp(buffer).resize(10).toBuffer();
      await fsPromises.writeFile(thumbnailPath, thumbnailBuffer);

      return {
        image: `/assets/car/${slug}/${baseName}${ext}`,
        thumbnail: `/assets/car/${slug}/thumbnail-${baseName}${ext}`
      };
    })
  );

  // Flatten into a single object
  return {
    images: results.map(r => r.image),
    imagesThumbnail: results.map(r => r.thumbnail)
  };
}


