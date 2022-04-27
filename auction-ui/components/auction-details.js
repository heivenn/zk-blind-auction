import { ethers } from 'ethers';
import cn from 'classnames';
import Spinner from './spinner';
import CopyBtn from './copy';
import { useRef } from 'react';

export default function AuctionDetails({
  auctionContract,
  beneficiary,
  auctioneer,
  bidEnd,
  revealEnd,
  paymentEnd,
  winner,
  winningBid,
  inputRef,
  bidLoading,
  handleBid,
  bidData,
  bids,
  getBids,
  bidsLoading,
  witnessRef,
  witnessPlaceholder,
  highestLoading,
  parseError,
  handleWitness,
  secret,
}) {
  const copyRef = useRef(null);
  return (
    <div className="w-10/12 bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Auction Details
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          An auction for something cool.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Contract Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {auctionContract}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Beneficiary</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {beneficiary}
            </dd>
          </div>
          {auctioneer && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Auctioneer</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {auctioneer}
              </dd>
            </div>
          )}
          {winner && winningBid && (
            <>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Winner</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {winner}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Winning Bid
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {ethers.utils.formatEther(winningBid)}
                </dd>
              </div>
            </>
          )}
          {/* <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Bid End</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {bidEnd}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Reveal End</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {revealEnd}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Payment End</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {paymentEnd}
            </dd>
          </div> */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Deposit Amount
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              1 ONE token
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Rules</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <ul
                role="list"
                className="border border-gray-200 rounded-md divide-y divide-gray-200"
              >
                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 truncate">
                      One bid per address.
                    </span>
                  </div>
                  {/* <div className="ml-4 flex-shrink-0">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Download
                    </a>
                  </div> */}
                </li>
                <li className="bg-gray-50 pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 ">
                      4 max bids at this moment.
                    </span>
                  </div>
                </li>
                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 ">
                      The deposit amount is held until reveal end.
                    </span>
                  </div>
                </li>
                <li className="bg-gray-50 pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 ">
                      Make sure you trust the auctioneer. You will be providing
                      your secret and amount to them before reveal end in order
                      to get your deposit back.
                    </span>
                  </div>
                </li>
                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 ">
                      If you win you will pay the remainder of your bid amount
                      minus the deposit amount.
                    </span>
                  </div>
                </li>
                <li className="bg-gray-50 pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 ">
                      If you win and do not pay within 3 days after reveal your
                      deposit is also forfeited.
                    </span>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
          {!winner && (
            <>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <label
                  className="text-sm font-medium text-gray-500"
                  htmlFor="grid-amount"
                >
                  Bid Amount
                </label>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div>
                    <input
                      ref={inputRef}
                      className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-amount"
                      type="text"
                      placeholder="1"
                      name="amount"
                    />
                    <p
                      className={cn('text-xs italic', {
                        'text-red-500': !bidData,
                        'text-green-500': bidData,
                      })}
                    >
                      {bidData
                        ? `🎉 Bid Transaction Hash: ${bidData?.hash}`
                        : 'Whole numbers only, or it will be rounded down for you.'}
                    </p>
                  </div>
                  <button
                    disabled={bidLoading}
                    className={cn(
                      ' text-white font-bold py-2 px-4 border-b-4 rounded',
                      {
                        'bg-blue-500 hover:bg-blue-400 hover:border-blue-500 border-blue-700':
                          !bidLoading,
                        'bg-gray-600 border-gray-700': bidLoading,
                      }
                    )}
                    onClick={handleBid}
                  >
                    {bidLoading ? <Spinner></Spinner> : 'Bid'}
                  </button>
                </dd>
              </div>
              {bidData && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Secret</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {secret}
                    <p className="text-red-500 text-xs italic">
                      Save this or you will lose it upon leaving or refreshing
                      the page and forfeit your deposit!
                    </p>
                  </dd>
                </div>
              )}
            </>
          )}
        </dl>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Auctioneer Utilities
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          With great power comes great responsibility.
        </p>
      </div>
      <div className="border-t border-gray-200 ">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Blinded Bids</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
              {bids && (
                <div className="border border-gray-200 rounded-md pl-3 pr-4 py-3 flex items-center justify-between text-sm mb-2">
                  <div className="w-0 flex-1 flex items-center">
                    <div className="ml-2 flex-1 break-all w-0" ref={copyRef}>
                      {JSON.stringify(bids)}
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={bidsLoading}
                className={cn(
                  ' text-white font-bold py-2 px-4 border-b-4 rounded mr-4',
                  {
                    'bg-blue-500 hover:bg-blue-400 hover:border-blue-500 border-blue-700':
                      !bidsLoading,
                    'bg-gray-600 border-gray-700': bidsLoading,
                  }
                )}
                onClick={getBids}
              >
                {bidsLoading ? <Spinner></Spinner> : 'Get Bids'}
              </button>
              {bids && <CopyBtn copyRef={copyRef}></CopyBtn>}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Winner Processing
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <label
                className="block uppercase tracking-wide text-rose-400 text-xs font-bold mb-2"
                htmlFor="witness"
              >
                Witness Inputs
              </label>
              <textarea
                ref={witnessRef}
                className={cn('border rounded-lg w-full h-48 p-4', {
                  'border-red-700 border-2': parseError,
                })}
                id="witness"
                name="witness"
                placeholder={witnessPlaceholder}
              ></textarea>
              <button
                disabled={highestLoading}
                className={cn(
                  ' text-white font-bold py-2 px-4 border-b-4 rounded',
                  {
                    'bg-blue-500 hover:bg-blue-400 hover:border-blue-500 border-blue-700':
                      !highestLoading,
                    'bg-gray-600 border-gray-700': highestLoading,
                  }
                )}
                onClick={handleWitness}
              >
                {highestLoading ? <Spinner></Spinner> : 'Get Winner'}
              </button>
              {parseError && (
                <p className="text-red-600 text-xs">{parseError}</p>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
