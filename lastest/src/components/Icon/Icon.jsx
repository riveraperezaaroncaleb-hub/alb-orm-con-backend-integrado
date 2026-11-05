const ICONS = {
  panel: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  box: ['M21 8l-9-5-9 5v8l9 5 9-5z', 'M3.3 8.3 12 13l8.7-4.7', 'M12 13v8'],
  tag: [
    'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z',
    'M7.5 7.5h.01',
  ],
  truck: [
    'M3 6h11v9H3z',
    'M14 9h4l3 3v3h-7z',
    'M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    'M18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  ],
  users: [
    'M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20',
    'M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    'M17 11a3 3 0 1 0 0-6',
    'M21 20v-1.5a3.5 3.5 0 0 0-2.6-3.4',
  ],
  user: [
    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
    'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  ],
  plus: ['M12 5v14', 'M5 12h14'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.3-4.3'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  edit: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6', 'M10 11v5', 'M14 11v5'],
  refresh: ['M20 11a8 8 0 1 0-2.3 6.7', 'M20 4v7h-7'],
  alert: ['M12 3 2.5 20h19z', 'M12 9v5', 'M12 17h.01'],
  check: ['M20 6 9 17l-5-5'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 11v5', 'M12 8h.01'],
  chevron: ['M6 9l6 6 6-6'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  money: ['M12 1v22', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  layers: ['M12 3 2 8l10 5 10-5z', 'M2 12l10 5 10-5', 'M2 16l10 5 10-5'],
  arrowUp: ['M12 19V5', 'M5 12l7-7 7 7'],
  arrowDown: ['M12 5v14', 'M19 12l-7 7-7-7'],
  mail: ['M3 5h18v14H3z', 'M3 6l9 7 9-7'],
  phone: [
    'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z',
  ],
  pin: ['M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11z', 'M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  calendar: ['M3 5h18v16H3z', 'M8 3v4', 'M16 3v4', 'M3 10h18'],
  sparkles: [
    'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z',
    'M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z',
  ],
  filter: ['M3 5h18l-7 8v6l-4 2v-8z'],
}

export default function Icon({ name, size = 20, className, ...rest }) {
  const paths = ICONS[name] ?? ICONS.info

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}
