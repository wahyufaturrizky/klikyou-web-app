import { ImageInterface } from "../interface/Image";
import Image from "next/image";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

const ImageNext = ({ onClick, className, src, alt, width, height, priority }: ImageInterface) => {
  return (
    <Image
      onClick={onClick}
      className={className}
      priority={priority}
      width={width}
      height={height}
      src={src}
      alt={alt}
    />
  );
};

export default ImageNext;
