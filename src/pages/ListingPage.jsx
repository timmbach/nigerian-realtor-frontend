import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function ListingPage() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingError, setListingError] = useState(false);
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
        <>
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
        </>
      )}
    </main>
  );
}
