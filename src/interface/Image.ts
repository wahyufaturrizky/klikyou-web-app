export interface ImageInterface {
  src: string;
  alt: string;
  width?: number;
  priority?: boolean;
  onClick?: () => void;
  height?: number;
  className?: string;
}
