export const uploadFile = async (files, type) => {
  const images = [];

  for (const file of files) {
    const formData = new FormData();

    formData.append('file', file);

    type === 'campaign'
      ? formData.append('upload_preset', 'learnify')
      : formData.append('upload_preset', 'chat_avatar');
    // formData.append('options', { overwrite: false });

    formData.append('cloud_name', `${process.env.REACT_APP_CLOUD_NAME}`);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
          overwrite: false,
        }
      );

      const data = await res.json();

      images.push(data.secure_url);
    } catch (err) {
      console.log(err);
    }
  }

  return images;
};
