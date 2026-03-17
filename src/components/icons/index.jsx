// SVG icon library — all icons are inline SVG, no emoji
const props = (extra = '') => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: `inline-block ${extra}`,
})

export const HomeIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

export const FoodIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

export const HabitIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

export const MoodIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={3} />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={3} />
  </svg>
)

export const ProfileIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const DropletIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
)

export const ActivityIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

export const MoonIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export const LeafIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75" />
    <path d="M22 2S11 2 6 7c-5 5-4 12-4 12s7 1 12-4c5-5 8-13 8-13z" />
  </svg>
)

export const SunIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

export const SunriseIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M17 18a5 5 0 0 0-10 0" />
    <line x1="12" y1="2" x2="12" y2="9" />
    <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
    <line x1="1" y1="18" x2="3" y2="18" />
    <line x1="21" y1="18" x2="23" y2="18" />
    <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
    <line x1="23" y1="22" x2="1" y2="22" />
    <polyline points="8 6 12 2 16 6" />
  </svg>
)

export const CookieIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
    <path d="M8.5 8.5v.01" strokeWidth={3} />
    <path d="M16 15.5v.01" strokeWidth={3} />
    <path d="M12 12v.01" strokeWidth={3} />
  </svg>
)

export const PlusIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const TrashIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

export const CheckIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const StarIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export const FireIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

export const TrophyIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
)

export const DownloadIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export const LockIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

export const EditIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

export const CloseIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const SearchIcon = ({ size = 24, className = '' }) => (
  <svg {...props(className)} width={size} height={size}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export const iconMap = {
  droplet: DropletIcon,
  activity: ActivityIcon,
  moon: MoonIcon,
  leaf: LeafIcon,
  sun: SunIcon,
  sunrise: SunriseIcon,
  cookie: CookieIcon,
  fire: FireIcon,
  trophy: TrophyIcon,
}
