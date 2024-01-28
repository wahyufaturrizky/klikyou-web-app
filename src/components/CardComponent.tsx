import { CardComponentInterface } from "@/app/dashboard/page";
import ImageNext from "@/components/Image";
import Text from "@/components/Text";
import { FieldsAbout } from "./FieldsAbout";

export const CardComponent = (props: CardComponentInterface): any => {
  const {
    title,
    desc,
    onClick,
    isEditAbout,
    handleChangeImageBase64,
    control,
    fieldsAbout,
    onSubmitAbout,
    handleSubmit,
    watch,
  } = props;

  return (
    <div className="rounded-md h-auto w-full p-2 bg-[#0E191F] mt-6">
      {isEditAbout ? (
        <div>
          <div className="flex justify-between items-center">
            <Text
              label={title}
              className="shadow-2xl drop-shadow-xl font-bold not-italic text-sm text-white"
            />

            <Text
              onClick={handleSubmit && handleSubmit(onSubmitAbout)}
              label="Save & Update"
              className="shadow-2xl drop-shadow-xl font-medium not-italic text-xs text-[#94783E] cursor-pointer"
            />
          </div>

          <label className="cursor-pointer flex gap-2 mt-4 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={localStorage.getItem("avatar") || "/avatar-placeholder.svg"}
              alt="avatar-placeholder"
              className="h-[57px] w-[57px] rounded-lg bg-center bg-no-repeat object-cover object-center"
            />

            <Text
              label="Add image"
              className="shadow-2xl drop-shadow-xl font-medium not-italic text-xs text-white"
            />

            <input
              onChange={(e: any) => handleChangeImageBase64(e, "avatar")}
              id="file-upload-avatar"
              name="file-upload-avatar"
              type="file"
              className="sr-only"
            />
          </label>

          <FieldsAbout control={control} fieldsAbout={fieldsAbout} />
        </div>
      ) : watch && watch("interests")?.length && title === "Interest" ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <Text
              label={title}
              className="shadow-2xl drop-shadow-xl font-bold not-italic text-sm text-white"
            />

            <ImageNext
              onClick={onClick}
              src="/pencil.svg"
              className="shadow-2xl drop-shadow-xl cursor-pointer"
              alt="pencil"
              width={20}
              height={20}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {watch("interests").map((data: string, index: number) => {
              return (
                <div key={index} className="rounded-full p-4 bg-white/10 w-fit">
                  <p className="text-center text-white text-sm">{data}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : watch && watch() && title === "About" ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <Text
              label={title}
              className="shadow-2xl drop-shadow-xl font-bold not-italic text-sm text-white"
            />

            <ImageNext
              onClick={onClick}
              src="/pencil.svg"
              className="shadow-2xl drop-shadow-xl cursor-pointer"
              alt="pencil"
              width={20}
              height={20}
            />
          </div>

          <div className="mb-6">
            {Object.keys(watch()).map((data: any, index: number) => {
              const labelName = watch() as any;

              if (data !== "interests") {
                return (
                  <div key={index} className="flex gap-2 items-center mt-2">
                    <Text
                      label={data + " : "}
                      className="shadow-2xl drop-shadow-xl font-medium not-italic text-xs text-white/30"
                    />

                    <Text
                      label={labelName[data]}
                      className="shadow-2xl drop-shadow-xl font-medium not-italic text-xs text-white"
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <Text
              label={title}
              className="shadow-2xl drop-shadow-xl font-bold not-italic text-sm text-white"
            />

            <ImageNext
              onClick={onClick}
              src="/pencil.svg"
              className="shadow-2xl drop-shadow-xl cursor-pointer"
              alt="pencil"
              width={20}
              height={20}
            />
          </div>

          <Text
            label={desc}
            className="shadow-2xl drop-shadow-xl font-medium not-italic text-sm text-white/50 mt-8"
          />
        </div>
      )}
    </div>
  );
};
