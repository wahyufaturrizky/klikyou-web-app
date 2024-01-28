import { ImageInterface } from "../interface/Image";
import Image from "next/image";

const ImageNext = ({ onClick, className, src, alt, width, height }: ImageInterface) => {
  return (
    <div className={className} onClick={onClick}>
      <Image width={width} height={height} src={src} alt={alt} />
    </div>
  );
};

export default ImageNext;
