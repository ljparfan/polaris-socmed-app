/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/solid";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Button from "./Button";
import {
  selectDarkThemeEnabled,
  selectDialog,
} from "../redux/general/general.selectors";
import { closeDialog } from "../redux/general/general.actions";

const ACTION_BUTTON_CLASSES_MAP = {
  error: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  success: "",
  info: "",
  warn: "",
};

const ConfirmationDialog = () => {
  const config = useAppSelector(selectDialog);
  const darkModeEnabled = useAppSelector(selectDarkThemeEnabled);
  const dispatch = useAppDispatch();

  return (
    <Transition.Root show={config.visible} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed z-10 inset-0 overflow-y-auto ${
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
              <div className="dark:bg-neutral-800 bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                    >
                      {/* Delete post */}
                      {config.title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-neutral-200">
                        {/* Are you sure you want to delete your post? This post
                        will be permanently removed. This action cannot be
                        undone. */}
                        {config.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dark:bg-neutral-800 bg-gray-50 px-4 py-3 sm:px-6 flex flex-col md:flex-row-reverse">
                {config.actionButton && (
                  <Button
                    type="button"
                    onClick={() =>
                      dispatch(closeDialog(config.actionToBeFired!))
                    }
                    className={`md:w-3/12 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                      ACTION_BUTTON_CLASSES_MAP[config.actionButton.type]
                    }`}
                  >
                    {config.actionButton.text}
                  </Button>
                )}
                <Button
                  type="button"
                  className="dark:bg-neutral-700 dark:text-neutral-200 mt-3 md:w-3/12 border-gray-300 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:ring-0 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => dispatch(closeDialog())}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmationDialog;
