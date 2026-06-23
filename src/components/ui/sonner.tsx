import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      expand
      toastOptions={{
        classNames: {
          error:
            "!bg-red-600 !text-white !border-red-700 [&_[data-icon]]:!text-white",
          success:
            "!bg-[#f48b94] !text-white !border-[#ee7b86] [&_[data-icon]]:!text-white",
          info:
            "!bg-[#f48b94] !text-white !border-[#ee7b86] [&_[data-icon]]:!text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
