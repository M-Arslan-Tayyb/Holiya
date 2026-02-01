export default function TextLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 220 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* 
        Using Bodoni font family from your global.css
        Color: #936C3D from your Illustrator properties
        Italic style to match the cursive/script look
      */}
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#936C3D"
        fontFamily="'Bodoni 72', 'Bodoni MT', 'Didot', 'Times New Roman', serif"
        fontSize="48"
        fontStyle="italic"
        fontWeight="400"
        letterSpacing="-0.02em"
      >
        Holiya
      </text>
      
      {/* Optional: subtle decorative underline to match luxury feel */}
      <path
        d="M 70 50 Q 110 55 150 50"
        stroke="#936C3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}