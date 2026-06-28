type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
};

export function ProductImage({
  src,
  alt,
  className = "h-full w-full object-cover",
  placeholderClassName = "product-placeholder",
}: ProductImageProps) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className={placeholderClassName} aria-hidden="true">
      🌸
    </div>
  );
}
