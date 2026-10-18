const uploadFlyer = async (axiosPrivate, file) => {
  const formData = new FormData();

  formData.append("flyerUrl", file);

  const response = await axiosPrivate.post(
    "/upload/flyer",
    formData,
  );

  return response.data;
};

const uploadGalleryPhoto = async (
  axiosPrivate,
  file,
) => {
  const formData = new FormData();

  formData.append(
    "galleryPhotoUrl",
    file,
  );

  const response =
    await axiosPrivate.post(
      "/upload/gallery-photo",
      formData,
    );

  return response.data;
};


const uploadLandingImage = async (
  axiosPrivate,
  file,
) => {
  const formData = new FormData();

  formData.append(
    "landingPhotoUrl",
    file,
  );

  const response =
    await axiosPrivate.post(
      "/upload/landing-image",
      formData,
    );

  return response.data;
};


const uploadAboutImage = async (
  axiosPrivate,
  file,
) => {
  const formData = new FormData();

  formData.append(
    "aboutPhotoUrl",
    file,
  );

  const response =
    await axiosPrivate.post(
      "/upload/about-image",
      formData,
    );

  return response.data;
};


export {
  uploadFlyer,
  uploadGalleryPhoto,
  uploadLandingImage,
  uploadAboutImage,
};
