"use client";

import { useEffect, useState } from "react";
import Modal from "@/src/components/shared/Modal";
import WLoader from "@/src/components/shared/WLoader";
import { getFileNameFromUrl } from "@/src/lib/fileName";

interface CertificatePreviewModalProps {
  url: string | null;
  onClose: () => void;
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

export default function CertificatePreviewModal({ url, onClose }: CertificatePreviewModalProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
  }, [url]);

  return (
    <Modal
      isOpen={Boolean(url)}
      onClose={onClose}
      title={url ? getFileNameFromUrl(url) : undefined}
    >
      {url &&
        (isImageUrl(url) ? (
          <div className="relative flex min-h-60 items-center justify-center">
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <WLoader />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element -- external/unknown host */}
            <img
              src={url}
              alt="Certificate preview"
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              className={`mx-auto max-h-[70vh] w-auto rounded-md transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        ) : (
          <iframe
            src={url}
            className="h-[70vh] w-full rounded-md border border-w-black/10"
            title="Certificate preview"
          />
        ))}
    </Modal>
  );
}
