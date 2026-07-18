import { useRef, useState } from "react";
import { BlogImage } from "./blog/BlogImage";
import { ProfileIcon } from "./profile/ProfileIcon";
import { Button } from "./Button";

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

interface ImagePickerProps {
  imgPreview: string | null;
  setImage: (file: File) => void;
  imageRemovable?: () => void;
  type: 'blogImage' | 'avatar';
  error?: string;
}

export function ImagePicker(props: ImagePickerProps) {
  const file = useRef<HTMLInputElement>(null);
  const [mimeError, setMimeError] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) {
      return;
    }
    if (!ACCEPTED_TYPES.includes(uploadedFile.type)) {
      setMimeError(true);
      e.target.value = '';
      return;
    }
    setMimeError(false);
    props.setImage(uploadedFile);
    e.target.value = '';
  }

  return (
    <div className={`flex flex-col gap-2 items-center`}>
      {(!!props.imgPreview) && (
        (props.type === 'avatar') ? (
          <ProfileIcon img={props.imgPreview!} type="picker" />
        ) : (
          <BlogImage img={props.imgPreview!} className={`border ${props.error ? 'border-red-500' : 'border-(--border)'}`} />
        )
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => {
            setMimeError(false);
            file.current?.click();
          }}
          className="px-3"
        >
          Choose image
        </Button>
        {props.imageRemovable && (!!props.imgPreview) && (
          <Button
            type="button"
            buttonStyleType="remove"
            onClick={props.imageRemovable}
          >
            Remove
          </Button>
        )}
      </div>

      {mimeError && <p className="text-xs text-red-500">Must be a JPEG, PNG, or GIF.</p>}
      {props.error && <p className="text-xs text-red-500">{props.error}</p>}

      <input
        ref={file}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}