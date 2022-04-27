import cn from 'classnames';
import Spinner from './spinner';

export default function Form({ type, createAuction, auctioneer, loading }) {
  return (
    <form onSubmit={createAuction} className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-rose-400 text-xs font-bold mb-2"
            htmlFor="grid-bid-time"
          >
            Bid Time (in seconds)
          </label>
          <input
            className={cn(
              'appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white',
              {
                'border-red-500': type === 'error',
                'border-green-500': type === 'success',
              }
            )}
            id="grid-bid-time"
            name="bid-time"
            type="text"
            placeholder="60"
          />
          {/* <p className="text-red-500 text-xs italic">This must be a number.</p> */}
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-rose-400 text-xs font-bold mb-2"
            htmlFor="grid-reveal-time"
          >
            Reveal Time (in seconds)
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-reveal-time"
            type="text"
            placeholder="60"
            name="reveal-time"
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-rose-400 text-xs font-bold mb-2"
            htmlFor="grid-beneficiary"
          >
            Beneficiary Address
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-beneficiary"
            type="text"
            placeholder="0x..."
            name="beneficiary"
          />
          <p className="text-white text-xs italic">
            This is the address of the seller, who will receive the proceeds of
            the auction.
          </p>
        </div>
      </div>
      <button
        disabled={loading}
        className={cn(' text-white font-bold py-2 px-4 border-b-4   rounded', {
          'bg-blue-500 hover:bg-blue-400 hover:border-blue-500 border-blue-700':
            !loading,
          'bg-gray-600 border-gray-700': loading,
        })}
      >
        {loading ? <Spinner></Spinner> : 'Create Auction'}
      </button>
      <p className="text-red-600 text-sm italic mt-4">
        Warning: The connected wallet {auctioneer?._address} will become the
        auctioneer.
      </p>
      {/* <div className="flex flex-wrap -mx-3 mb-2">
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        City
      </label>
      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque" />
    </div>
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
        State
      </label>
      <div className="relative">
        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
          <option>New Mexico</option>
          <option>Missouri</option>
          <option>Texas</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
        Zip
      </label>
      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210">
    </div>
  </div> */}
    </form>
  );
}
