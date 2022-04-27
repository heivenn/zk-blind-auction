import dynamic from 'next/dynamic';
import Link from 'next/link';
const ProfileNoSSR = dynamic(() => import('./profile'), { ssr: false });

export default function Nav({ page }) {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-indigo-600 px-6 py-2">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M0 22h12v2h-12v-2zm11-1h-10c0-1.105.895-2 2-2h6c1.105 0 2 .895 2 2zm6.369-12.839l-2.246 2.197s6.291 5.541 8.172 7.144c.475.405.705.929.705 1.446 0 1.015-.888 1.886-1.95 1.819-.52-.032-.981-.303-1.321-.697-1.619-1.875-7.07-8.249-7.07-8.249l-2.245 2.196-5.857-5.856 5.957-5.857 5.855 5.857zm-12.299.926c-.195-.193-.458-.302-.733-.302-.274 0-.537.109-.732.302-.193.195-.303.458-.303.733 0 .274.11.537.303.732l5.513 5.511c.194.195.457.304.732.304.275 0 .538-.109.732-.304.194-.193.303-.457.303-.732 0-.274-.109-.537-.303-.731l-5.512-5.513zm8.784-8.784c-.195-.194-.458-.303-.732-.303-.576 0-1.035.467-1.035 1.035 0 .275.108.539.303.732l5.513 5.513c.194.193.456.303.731.303.572 0 1.036-.464 1.036-1.035 0-.275-.109-.539-.304-.732l-5.512-5.513z" />
        </svg>
        <Link href="/">
          <span className="cursor-pointer ml-2 font-semibold text-xl tracking-tight">
            <a>ZK Blind Auction</a>
          </span>
        </Link>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-md lg:flex-grow font-bold">
          {page !== 'home' && (
            <Link href="/">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                Home
              </a>
            </Link>
          )}
          {page !== 'create' && (
            <Link href="/auctions/create">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                Create Auction
              </a>
            </Link>
          )}
        </div>
        <div className="inline-block text-sm py-2 leading-none text-white mt-4 lg:mt-0">
          <ProfileNoSSR />
        </div>
      </div>
    </nav>
  );
}
