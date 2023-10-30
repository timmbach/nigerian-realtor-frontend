/* eslint-disable react/prop-types */

import { FaBath, FaBed, FaMapMarkerAlt } from "react-icons/fa";
import { TiWarningOutline } from "react-icons/ti";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[320px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageURLs[0]  }
          alt="listing img"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full ">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-green-700 h-4 w-4" />
            <p className="truncate text-sm text-gray-600 w-full">
              {listing.address}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-600 w-full line-clamp-2">
              {listing.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-500 mt-2">
              &#x20A6;{listing.price.toLocaleString("en-US")}{" "}
              {listing.purchaseType === "rent" && <span>/ year</span>}
            </p>
            <div>
              {listing.underOffer && (
                <div className="flex items-center gap-1">
                  <TiWarningOutline className="text-yellow-400 text-xl" />
                  <p className="font-semibold bg-slate-200 rounded-md px-1 text-sm">
                    Under Offer
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center font-bold gap-7 text-slate-500">
            <div className="flex items-center gap-1">
              <p>{listing.bedrooms}</p>
              <FaBed className="text-md text-green-800" />
            </div>
            <div className="flex items-center gap-1">
              <p>{listing.bathrooms}</p>
              <FaBath className="text-sm text-green-800" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
