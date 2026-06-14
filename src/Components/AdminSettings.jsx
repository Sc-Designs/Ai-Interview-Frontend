import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineAddAPhoto } from "react-icons/md";
import Cropper from "react-easy-crop";
import getCroppedImg from "../Utils/cropImage";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";
import AdminAxios from "../Config/adminAxios";
import { toast } from "react-toastify";
import { updateProfile } from "../Store/Reducers/AdminReducer";

const PasswordField = ({ label, name, register, visible, setVisible }) => (
  <div>
    <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-1.5 font-Satoshi">
      {label}
    </label>
    <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden focus-within:border-zinc-500 transition-colors">
      <input
        type={visible ? "text" : "password"}
        placeholder="••••••••"
        {...register(name)}
        className="flex-1 px-4 py-2.5 bg-transparent text-sm text-white outline-none placeholder:text-zinc-700 font-Satoshi"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="px-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
        {visible ? <IoIosEye size={18} /> : <IoIosEyeOff size={18} />}
      </button>
    </div>
  </div>
);

const AdminSettings = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.AdminReducer);

  const [preview, setPreview] = useState(admin?.avatar || "");
  const [passModal, setPassModal] = useState(false);
  const file = useRef(null);
  const [currepassView, setcurrepassView] = useState(false);
  const [newpassView, setnewpassView] = useState(false);
  const [confirmpassView, setconfirmpassView] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: admin?.name || "",
      number: admin?.phoneNumber || "",
      avatar: null,
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
    },
  });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleImageChange = (e) => {
    const fileObj = e.target.files[0];
    if (fileObj) {
      setRawImage(URL.createObjectURL(fileObj));
      setShowCropper(true);
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCropAreaPixels(croppedAreaPixels);
  };

  const handleCropDone = async () => {
    const croppedBlob = await getCroppedImg(rawImage, cropAreaPixels);
    const croppedURL = URL.createObjectURL(croppedBlob);
    setPreview(croppedURL);
    URL.revokeObjectURL(rawImage);
    setRawImage(null);
    setValue(
      "avatar",
      new File([croppedBlob], "avatar.avif", { type: "image/avif" }),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
    setShowCropper(false);
  };

  const onSubmit = async (data) => {
    if (!isDirty) {
      toast.error("No changes detected");
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("number", data.number);
    if (data.avatar) formData.append("avatar", data.avatar);
    if (data.currentPassword)
      formData.append("currentPassword", data.currentPassword);
    if (data.newPassword) formData.append("newPassword", data.newPassword);
    if (data.confirmPassword)
      formData.append("confirmPassword", data.confirmPassword);
    try {
      toast.info("Updating your profile…");
      const res = await AdminAxios.patch("/admin/api/edit", formData);
      dispatch(updateProfile(res.data.admin));
      toast.success("Profile updated.");
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div className="w-full text-white font-Satoshi">
      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-700 cursor-pointer group"
              onClick={() => file.current?.click()}>
              <img
                src={preview || admin.profileImage || "/Default.jpg"}
                alt="Admin avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <MdOutlineAddAPhoto className="text-white text-xl" />
              </div>
            </div>
            <p className="text-xs text-zinc-600">Click to change photo</p>
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <input
                  ref={file}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    field.onChange(e.target.files[0]);
                    handleImageChange(e);
                  }}
                  className="hidden"
                />
              )}
            />
          </div>

          {/* Profile fields */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-xs text-zinc-600 uppercase tracking-widest">
              Profile info
            </p>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-1.5">
                Full name
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white outline-none focus:border-zinc-500 transition-colors font-Satoshi"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-1.5">
                Phone number
              </label>
              <input
                type="number"
                {...register("number")}
                placeholder="Optional"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white outline-none focus:border-zinc-500 transition-colors font-Satoshi placeholder:text-zinc-700"
              />
            </div>

            {admin?.createdAt && (
              <p className="text-xs text-zinc-600">
                Joined {formatDate(admin.createdAt)}
              </p>
            )}
          </div>

          {/* Password section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-600 uppercase tracking-widest">
                Password
              </p>
              <button
                type="button"
                onClick={() => setPassModal(!passModal)}
                className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer">
                {passModal ? "Cancel" : "Change password"}
              </button>
            </div>

            {passModal && (
              <div className="flex flex-col gap-4">
                <PasswordField
                  label="Current password"
                  name="currentPassword"
                  register={register}
                  visible={currepassView}
                  setVisible={setcurrepassView}
                />
                <PasswordField
                  label="New password"
                  name="newPassword"
                  register={register}
                  visible={newpassView}
                  setVisible={setnewpassView}
                />
                <PasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  register={register}
                  visible={confirmpassView}
                  setVisible={setconfirmpassView}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors cursor-pointer font-Satoshi">
            Save changes
          </button>
        </form>
      </div>

      {/* Crop modal */}
      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="w-[90vw] max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
            <p className="text-sm font-medium text-white mb-3 font-Satoshi">
              Crop photo
            </p>
            <div className="relative w-full h-60 rounded-xl overflow-hidden bg-zinc-950">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <p className="text-xs text-zinc-500 mb-1.5 font-Satoshi">
                  Zoom
                </p>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3.5
                    [&::-webkit-slider-thumb]:h-3.5
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
              <button
                type="button"
                onClick={handleCropDone}
                className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer font-Satoshi">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
