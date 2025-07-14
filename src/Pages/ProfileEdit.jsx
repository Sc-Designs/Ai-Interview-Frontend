import React, { useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdOutlineAddAPhoto } from "react-icons/md";
import Cropper from "react-easy-crop";
import getCroppedImg from "../Utils/cropImage";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.UersReducer);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [preview, setPreview] = useState(user?.avatar || "");
  const [avatar, setAvatar] = useState(null);
  const [passModal, setpassModal] = useState(false);
  const file = useRef(null);
  const [currepassView, setcurrepassView] = useState(false)
  const [newpassView, setnewpassView] = useState(false)
  const [confirmpassView, setconfirmpassView] = useState(false)

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
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setRawImage(imageURL);
      setAvatar(file);
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
    setAvatar(new File([croppedBlob], "avatar.avif", { type: "image/avif" }));
    setShowCropper(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    try {
      // await Axios.post("/api/edit-profile", formData);
      alert("✅ Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      alert("❌ Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-white font-Okomito">
      <Navbar />
      <div className="max-w-2xl px-6 py-20 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-sky-400">
          Edit Your Profile
        </h1>

        <form
          onSubmit={handleSave}
          className="space-y-6 bg-[#1E293B] p-6 rounded-xl shadow-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="relative overflow-hidden border-2 rounded-full cursor-pointer group w-28 h-28 border-sky-400">
              <div className="absolute top-[100%] left-0 z-20 group-hover:top-0 duration-300 flex items-center justify-center w-full h-full pointer-events-none bg-black/70">
                <MdOutlineAddAPhoto className="text-3xl text-zinc-500" />
              </div>
              <img
                onClick={() => {
                  if (file.current) {
                    file.current.click();
                  }
                }}
                src={preview || "/default-avatar.png"}
                alt="avatar"
                className="object-cover object-center w-full h-full"
              />
            </div>
            <input
              ref={file}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Bio</label>
            <textarea
              value={bio}
              placeholder="Write Something..."
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded resize-none h-50 md:h-30 placeholder:text-zinc-400"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-2 border border-gray-600 rounded">
            <h1>Password Changing</h1>
            <button
            type="button"
              onClick={() => setpassModal(!passModal)}
              className="bg-[#FFF] px-5 py-2 rounded">
              {passModal ? "Cancel" : "Click here"}
            </button>
          </div>
          {passModal && (
            <div className="flex flex-col gap-y-5">
              <div className="flex items-center justify-between border border-gray-600 rounded">
                <input
                  type={currepassView ? "text" : "password"}
                  placeholder="Current password . . ."
                  className="w-full px-4 py-2 rounded outline-none bg-grey-800 placeholder:text-zinc-500 "
                />
                {!currepassView ? (
                  <IoIosEyeOff
                    onClick={() => setcurrepassView(true)}
                    className="mx-4 text-xl cursor-pointer text-rose-400"
                  />
                ) : (
                  <IoIosEye
                    onClick={() => setcurrepassView(false)}
                    className="mx-4 text-xl text-green-400 cursor-pointer"
                  />
                )}
              </div>
              <div className="flex items-center justify-between border border-gray-600 rounded">
                <input
                  type={newpassView ? "text" : "password"}
                  placeholder="New Password . . ."
                  className="w-full px-4 py-2 bg-gray-800 rounded outline-none placeholder:text-zinc-500 "
                />
                {!newpassView ? (
                  <IoIosEyeOff
                    onClick={() => setnewpassView(true)}
                    className="mx-4 text-xl cursor-pointer text-rose-400"
                  />
                ) : (
                  <IoIosEye
                    onClick={() => setnewpassView(false)}
                    className="mx-4 text-xl text-green-400 cursor-pointer"
                  />
                )}
              </div>
              <div className="flex items-center justify-between border border-gray-600 rounded">
                <input
                  type={confirmpassView ? "text" : "password"}
                  placeholder="Confirm password . . ."
                  className="w-full px-4 py-2 bg-gray-800 rounded outline-none placeholder:text-zinc-500 "
                />
                {!confirmpassView ? (
                  <IoIosEyeOff
                    onClick={() => setconfirmpassView(true)}
                    className="mx-4 text-xl cursor-pointer text-rose-400"
                  />
                ) : (
                  <IoIosEye
                    onClick={() => setconfirmpassView(false)}
                    className="mx-4 text-xl text-green-400 cursor-pointer"
                  />
                )}
              </div>
            </div>
          )}
          <p className="text-sm text-gray-400">
            🗓️ Joined on: {formatDate(user?.createdAt)}
          </p>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-gray-600 rounded cursor-pointer hover:bg-gray-700">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-[90vw] max-w-md bg-zinc-900 rounded-lg p-4">
            <h2 className="mb-2 text-lg font-semibold text-[#FFF]">
              Crop your image
            </h2>
            <div className="relative w-full h-64">
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
            <div className="flex items-center justify-between mt-4">
              <div className="w-full pr-10">
                <p>Zoom Level</p>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:bg-zinc-500 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:border-2 
                    [&::-webkit-slider-thumb]:border-white
                    [&::-moz-range-thumb]:bg-zinc-500
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full"
                />
              </div>
              <button
                className="px-4 py-1 text-white bg-[#FFF] rounded cursor-pointer hover:bg-blue-600"
                onClick={handleCropDone}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;