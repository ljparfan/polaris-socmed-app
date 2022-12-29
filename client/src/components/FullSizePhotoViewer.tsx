/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectDarkThemeEnabled,
  selectFullSizedPhotoViewerImageUrl,
  selectIsFullSizedPhotoViewerOpen,
} from "../redux/general/general.selectors";
import { XIcon } from "@heroicons/react/solid";
import { closeFullSizePhotoViewer } from "../redux/general/general.actions";

const FullSizePhotoViewer = () => {
  const visible = useAppSelector(selectIsFullSizedPhotoViewerOpen);
  const dispatch = useAppDispatch();
  const imageUrl = useAppSelector(selectFullSizedPhotoViewerImageUrl);
  const darkModeEnabled = useAppSelector(selectDarkThemeEnabled);

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed z-50 inset-0 overflow-y-auto ${
          darkModeEnabled ? "dark" : ""
        }`}
        onClose={() => {}}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="dark:bg-neutral-800 bg-white">
                <img
                  src={imageUrl}
                  alt="viewer"
                  className="w-full object-cover"
                />
                <button
                  onClick={() => dispatch(closeFullSizePhotoViewer())}
                  type="button"
                  className="absolute top-0 text-white m-2 rounded-full bg-gray-900 hover:bg-gray-800 p-1"
                >
                  <XIcon className="h-5" />
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default FullSizePhotoViewer;
