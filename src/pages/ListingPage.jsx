import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import { TiWarningOutline } from "react-icons/ti";
import { AiOutlineMail } from "react-icons/ai";
import { useSelector } from "react-redux";
import RealtorContact from "../components/RealtorContact";

export default function ListingPage() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [realtorContact, setRealtorContact] = useState(false);
  // const listingId = params.listingId;
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setListingError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setListingError(false);
      } catch (error) {
        setListingError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  // console.log(listing);
  return (
    <main>
      {loading && (
        <ScaleLoader className="text-center my-7 text-2xl" color="#808080" />
      )}
      {!loading && listingError && (
        <div className="text-center my-7 text-2xl">
          <p>Oops! Something went wrong</p>
          <p>
            Back to{" "}
            <Link
              // className="bg-slate-200 font-semibold border rounded-lg"
              to="/"
            >
              <button type="button" className="underline font-semibold">
                home
              </button>
            </Link>
          </p>
        </div>
      )}
      {listing && !loading && !listingError && (
        <div>
          <Swiper navigation>
            {listing.imageURLs.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - &#x20A6;{listing.price.toLocaleString("en-US")}
              {listing.purchaseType === "rent" && " / year"}
            </p>
            <p className="flex items-center mt-4 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-6">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.purchaseType === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.underOffer && (
                <div className="flex items-center gap-1">
                  <TiWarningOutline className="text-yellow-400 text-xl" />
                  <p className="font-semibold bg-slate-200 rounded-md px-1 text-sm">
                    Under Offer
                  </p>
                </div>
              )}
            </div>
            <p className="text-slate-500">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              {listing.parking && (
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaParking className="text-lg" />
                  {listing.parking ? "Parking spot" : "No Parking Spot"}
                </li>
              )}
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser &&
              listing.userRef !== currentUser._id &&
              !realtorContact && (
                <button
                  onClick={() => setRealtorContact(true)}
                  className="bg-slate-700 flex items-center justify-center gap-2 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  <AiOutlineMail className="font-semibold text-lg" />
                  <span>Contact Realtor</span>
                </button>
              )}
            {realtorContact && <RealtorContact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
