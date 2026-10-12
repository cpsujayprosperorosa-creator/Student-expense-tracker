const base = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
};

const make = (path) =>
    function Icon(props) {
        return (
            <svg {...base} {...props}>
                {path}
            </svg>
        );
    };

export const HomeIcon = make(<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />);
export const ReceiptIcon = make(
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6" />,
);
export const WalletIcon = make(
    <path d="M3 7a2 2 0 012-2h13v4M3 7v10a2 2 0 002 2h15V9H5a2 2 0 01-2-2zM16 14h2" />,
);
export const ChartIcon = make(<path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />);
export const CogIcon = make(
    <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </>,
);
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);
export const MenuIcon = make(<path d="M4 6h16M4 12h16M4 18h16" />);
export const CloseIcon = make(<path d="M6 6l12 12M18 6L6 18" />);
export const LogoutIcon = make(
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />,
);
export const SearchIcon = make(
    <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
    </>,
);
export const CheckIcon = make(<path d="M5 13l4 4L19 7" />);
export const AlertIcon = make(
    <path d="M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />,
);
