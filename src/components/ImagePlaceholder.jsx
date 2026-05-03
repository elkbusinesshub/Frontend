

import logoImg from '../assets/logonew.jpg';

export default function ImagePlaceholder({title}) {
  return (
    <div
      style={{
        width: '100%',
        height: '150px',
        borderRadius: '10px 10px 0 0',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5fafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Faded logo background */}
      <img
        src={logoImg}
        alt="logo background"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: 0.15,
          padding: '16px',
          filter: 'grayscale(20%)',
        }}
      />

      {/* Centered title on top */}
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '13px',
          fontWeight: '700',
          color: '#2d4a3e',
          textAlign: 'center',
          lineHeight: '1.4',
          padding: '0 14px',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {title}
      </span>
    </div>
  )
}
