import { useState } from 'react';
import cn from 'classnames';

export default function CopyBtn({ copyRef }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const textToCopy = copyRef?.current?.innerHTML;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          setCopied(true);
          // changing back to default state after 2 seconds.
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        },
        (err) => {
          console.log('failed to copy', err.mesage);
        }
      );
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={cn(
        'text-white font-bold py-1 px-4 border-b-4 rounded bg-purple-400 hover:bg-purple-300 hover:border-purple-500 border-purple-700',
        {
          'bg-gray-500': copied,
        }
      )}
    >
      <svg
        aria-hidden="true"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="inline-block stroke-current transform group-hover:rotate-[-4deg] transition"
      >
        <path
          d="M12.9975 10.7499L11.7475 10.7499C10.6429 10.7499 9.74747 11.6453 9.74747 12.7499L9.74747 21.2499C9.74747 22.3544 10.6429 23.2499 11.7475 23.2499L20.2475 23.2499C21.352 23.2499 22.2475 22.3544 22.2475 21.2499L22.2475 12.7499C22.2475 11.6453 21.352 10.7499 20.2475 10.7499L18.9975 10.7499"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M17.9975 12.2499L13.9975 12.2499C13.4452 12.2499 12.9975 11.8022 12.9975 11.2499L12.9975 9.74988C12.9975 9.19759 13.4452 8.74988 13.9975 8.74988L17.9975 8.74988C18.5498 8.74988 18.9975 9.19759 18.9975 9.74988L18.9975 11.2499C18.9975 11.8022 18.5498 12.2499 17.9975 12.2499Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M13.7475 16.2499L18.2475 16.2499"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M13.7475 19.2499L18.2475 19.2499"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <g className="opacity-0 transition-opacity">
          <path
            d="M15.9975 5.99988L15.9975 3.99988"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M19.9975 5.99988L20.9975 4.99988"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M11.9975 5.99988L10.9975 4.99988"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
