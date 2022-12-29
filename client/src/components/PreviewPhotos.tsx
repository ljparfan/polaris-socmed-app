import { XIcon } from "@heroicons/react/outline";

type Props = {
  photos: File[];
  onRemove: (fileName: string) => void;
};

const PreviewPhotos = ({ photos, onRemove }: Props) => {
  return (
    <div className="flex flex-row space-x-2">
      {Array.from(photos).map((file) => (
        <div key={file.name} className="relative">
          <img
            className="w-48 h-48 rounded-lg object-cover"
            src={URL.createObjectURL(file)}
            alt="post"
          />
          <button
            onClick={() => onRemove(file.name)}
            type="button"
            className="absolute top-0 text-white m-2 rounded-full bg-gray-900 hover:bg-gray-800 p-1"
          >
            <XIcon className="h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default PreviewPhotos;
