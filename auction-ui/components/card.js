import Image from 'next/image';
import sushi from '../public/sushi.gif';

export default function Card({
  address,
  imgSrc,
  imgAlt,
  auctionTitle,
  timeLeft,
  tags,
  newCard,
}) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-gradient-to-br from-purple-800 via-violet-900 to-purple-800 h-full">
      <Image
        className="w-full"
        src={imgSrc || sushi}
        alt={imgAlt || 'sushi'}
        height={imgSrc ? undefined : 360}
        width={imgSrc ? undefined : 480}
      />
      <div className="px-6 py-4">
        {newCard ? (
          <div className="text-white font-bold text-xl text-center mt-24">
            Create a New Auction
          </div>
        ) : (
          <>
            <div className="font-bold text-xl mb-2 text-white">
              {auctionTitle}
            </div>
            {address && (
              <p className="text-yellow-500 text-base break-all">
                Auction at {address}
              </p>
            )}
          </>
        )}

        {/* <button
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          onClick={handleClick}
        >
          Bid
        </button> */}
      </div>
      {/* <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #sushi
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #food
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #gif
        </span>
      </div> */}
    </div>
  );
}
