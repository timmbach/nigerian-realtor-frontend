import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    purchaseType: "rent",
    bedrooms: 1,
    bathrooms: 1,
    price: 0,
    underOffer: false,
    parking: false,
    furnished: true,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageSubmit = () => {
    setImageUploadError("");
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setLoadingImages(false);
        })
        .catch((error) => {
          setLoadingImages(false);
          setImageUploadError("Image upload failed (2mb max per image)");
          console.log(error);
        });
    } else {
      setLoadingImages(false);
      setImageUploadError(
        "You can only upload a maximum of 6 images per listing"
      );
    }
    setLoadingImages(false);
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "status_changed",
        (snapshot) => {
          setLoadingImages(true);
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress} done`);
        },
        (error) => {
          setLoadingImages(false);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
            setLoadingImages(false);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index),
    });
  };
  const handleListingInputChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        purchaseType: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "underOffer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageURLs.length < 1)
        return setFormError("You must upload at least one image");
      setFormLoading(true);
      setFormError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      setFormLoading(false);
      if (data.success === false) {
        setFormError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setFormError(error.message);
      setFormLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 ">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleListingInputChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleListingInputChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleListingInputChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleListingInputChange}
                checked={formData.purchaseType === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleListingInputChange}
                checked={formData.purchaseType === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleListingInputChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleListingInputChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="underOffer"
                className="w-5"
                onChange={handleListingInputChange}
                checked={formData.underOffer}
              />
              <span>Under Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-1 border border-gray-300 rounded-lg"
                onChange={handleListingInputChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-1 border border-gray-300 rounded-lg"
                onChange={handleListingInputChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="price"
                required
                className="p-1 border border-gray-300 rounded-lg w-28"
                onChange={handleListingInputChange}
                value={formData.price.toLocaleString("en-US")}
              />
              <div className="flex gap-1 items-center">
                <p>Price</p>
                <span className="text-sm">(&#x20A6; / year)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-2 border"
              type="file"
              name="images"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={loadingImages}
              onClick={handleImageSubmit}
              className="p-2 px-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg hover:bg-green-200/20 disabled:bg-gray-300/20 disabled:border-gray-300"
            >
              Upload
            </button>
          </div>
          {loadingImages ? (
            <strong className="text-center">loading ...</strong>
          ) : (
            <p className="text-red-700">
              {imageUploadError && imageUploadError}
            </p>
          )}
          {formData.imageURLs.map((url, index) => (
            <div className="flex justify-between border items-center" key={url}>
              <img
                src={url}
                alt={`listing image ${index}`}
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-3 text-red-700 lowercase hover:opacity-75"
              >
                remove
              </button>
            </div>
          ))}
          <button
            disabled={formLoading || loadingImages}
            className="p-2 px-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {formLoading ? "Updating..." : "Update Listing"}
          </button>
          {formError && <p className="text-red-700 text-sm">{formError}</p>}
        </div>
      </form>
    </main>
  );
}
