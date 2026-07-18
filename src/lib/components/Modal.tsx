import { RiCloseFill } from "react-icons/ri";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal(props: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={props.onClose}
    >
      <div
        className={`bg-(--bg) shadow-2xl w-full max-w-xl mx-4 p-6 flex flex-col gap-5`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="font-semibold text-(--text-h)">{props.title}</h2>
          <button
            onClick={props.onClose}
            className="text-(--text-low-visibility) hover:text-(--text) cursor-pointer"
          >
            <RiCloseFill className="w-5 h-5" />
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
}