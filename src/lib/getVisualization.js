import { Image } from "antd"
import mime from "mime";

const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/webp",
  "image/svg+xml",
  "image/vnd.microsoft.icon",
  "image/jp2",
];

export function getVisualize(mimetype, url) {
  const content = () => {
    if (imageMimeTypes.includes(mimetype)) {
      return visualizeImage(url);
    } else {
      return null;
    }
  };

  return content;
}

export function visualizeImage(url) {
  return (
    <Image
      src={"asd"}
      fallback={process.env.PUBLIC_URL + "/images/placeholder/image.jpg"}
    />
  );
}