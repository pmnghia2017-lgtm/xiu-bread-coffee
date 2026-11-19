import React from 'react';
import { MenuItem } from '../data/storeData';

interface ProductArtworkProps {
  artworkKey: MenuItem['artworkKey'];
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  artworkKey,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#F5EFE5] ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 360 240"
        className="w-full h-full object-contain select-none transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`studio-${artworkKey}`} cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="65%" stopColor="#F4ECE0" />
            <stop offset="100%" stopColor="#E9DEC9" />
          </radialGradient>

          <linearGradient id={`breadTop-${artworkKey}`} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#F2B24C" />
            <stop offset="48%" stopColor="#D37B16" />
            <stop offset="100%" stopColor="#8E4706" />
          </linearGradient>

          <linearGradient id={`breadBottom-${artworkKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C87216" />
            <stop offset="100%" stopColor="#7C3C05" />
          </linearGradient>

          <linearGradient id={`crumb-${artworkKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF5DF" />
            <stop offset="100%" stopColor="#EDD6A7" />
          </linearGradient>

          <linearGradient id={`espresso-${artworkKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5D331B" />
            <stop offset="55%" stopColor="#381D0F" />
            <stop offset="100%" stopColor="#1E0E06" />
          </linearGradient>

          <linearGradient id={`crema-${artworkKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B87A42" />
            <stop offset="50%" stopColor="#D89D64" />
            <stop offset="100%" stopColor="#A66A36" />
          </linearGradient>

          <linearGradient id={`pastry-${artworkKey}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#F7C25E" />
            <stop offset="55%" stopColor="#D47D19" />
            <stop offset="100%" stopColor="#8C4507" />
          </linearGradient>

          <filter id={`softShadow-${artworkKey}`} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#2A1810" floodOpacity="0.14" />
          </filter>
        </defs>

        {/* Studio backdrop */}
        <rect width="360" height="240" fill={`url(#studio-${artworkKey})`} />

        {/* Subtle warm tabletop horizon band */}
        <rect x="0" y="176" width="360" height="64" fill="#E6DAC6" fillOpacity="0.55" />
        <line x1="0" y1="176" x2="360" y2="176" stroke="#DDD0BA" strokeWidth="1" />

        {/* BANH MI FAMILY */}
        {(artworkKey === 'banh-mi-dac-biet' ||
          artworkKey === 'banh-mi-thit-nuong' ||
          artworkKey === 'banh-mi-ga-xe' ||
          artworkKey === 'banh-mi-op-la') && (
          <g filter={`url(#softShadow-${artworkKey})`}>
            {/* Artisan stoneware plate */}
            <ellipse cx="180" cy="172" rx="132" ry="32" fill="#FDFBF7" stroke="#DFD4C2" strokeWidth="1.5" />
            <ellipse cx="180" cy="170" rx="104" ry="21" fill="#F8F4EC" stroke="#EAE0CF" strokeWidth="1" />

            {/* Ambient wheat sprig accent */}
            <path d="M44 176 Q58 156 76 148" stroke="#C98A2C" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
            <ellipse cx="66" cy="151" rx="5" ry="2.2" transform="rotate(-28 66 151)" fill="#C98A2C" opacity="0.4" />
            <ellipse cx="75" cy="147" rx="5" ry="2.2" transform="rotate(-15 75 147)" fill="#C98A2C" opacity="0.4" />

            {/* Bottom crust */}
            <path
              d="M68 142 C82 169, 278 169, 292 142 C264 150, 96 150, 68 142 Z"
              fill={`url(#breadBottom-${artworkKey})`}
            />
            {/* Soft inner crumb lip */}
            <path
              d="M78 138 C98 148, 262 148, 282 138 C258 130, 102 130, 78 138 Z"
              fill={`url(#crumb-${artworkKey})`}
            />

            {/* Pickled carrot/daikon & fresh cucumber layer */}
            <ellipse cx="122" cy="134" rx="22" ry="6" fill="#70A85B" />
            <ellipse cx="180" cy="134" rx="24" ry="6" fill="#5D9949" />
            <ellipse cx="238" cy="134" rx="22" ry="6" fill="#70A85B" />
            <path d="M106 131 Q132 124 154 132 M170 130 Q198 123 224 131 M228 132 Q250 126 266 132" stroke="#F08A24" strokeWidth="3.2" strokeLinecap="round" />

            {/* Signature fillings per recipe */}
            {artworkKey === 'banh-mi-dac-biet' && (
              <g>
                {/* Pate, cold cuts, cha lua */}
                <path d="M96 128 Q180 116 264 128" stroke="#9B6347" strokeWidth="7" strokeLinecap="round" />
                <ellipse cx="130" cy="124" rx="22" ry="8" fill="#DF7864" />
                <ellipse cx="176" cy="122" rx="24" ry="8.5" fill="#CF5C4A" />
                <ellipse cx="224" cy="124" rx="22" ry="8" fill="#E89D84" />
                <path d="M110 120 Q180 112 250 120" stroke="#F8DD87" strokeWidth="4.5" strokeLinecap="round" />
              </g>
            )}
            {artworkKey === 'banh-mi-thit-nuong' && (
              <g>
                <rect x="104" y="118" width="38" height="14" rx="6" fill="#9E3B14" />
                <rect x="148" y="116" width="44" height="15" rx="6" fill="#822E0D" />
                <rect x="198" y="118" width="40" height="14" rx="6" fill="#A9461C" />
                <path d="M114 122 L134 127 M160 120 L182 126 M208 122 L228 127" stroke="#521905" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
            {artworkKey === 'banh-mi-ga-xe' && (
              <g>
                <path d="M100 126 Q135 112 170 124 Q205 112 246 126" stroke="#F9EAC2" strokeWidth="10" strokeLinecap="round" />
                <path d="M112 122 Q180 114 242 122" stroke="#E5B75B" strokeWidth="4" strokeLinecap="round" />
              </g>
            )}
            {artworkKey === 'banh-mi-op-la' && (
              <g>
                <ellipse cx="146" cy="122" rx="28" ry="11" fill="#FFFDF8" stroke="#EFE4CE" strokeWidth="1" />
                <circle cx="146" cy="120" r="9" fill="#F59E0B" />
                <circle cx="143" cy="117" r="2.5" fill="#FDE68A" />
                <ellipse cx="212" cy="122" rx="28" ry="11" fill="#FFFDF8" stroke="#EFE4CE" strokeWidth="1" />
                <circle cx="212" cy="120" r="9" fill="#F59E0B" />
                <circle cx="209" cy="117" r="2.5" fill="#FDE68A" />
              </g>
            )}

            {/* Fresh cilantro & red chili accents */}
            <path d="M98 124 C104 112, 118 112, 122 122" fill="#2A7B41" />
            <path d="M188 120 C194 108, 210 108, 214 120" fill="#2A7B41" />
            <path d="M244 124 C250 114, 262 114, 266 124" fill="#358C4D" />
            <ellipse cx="164" cy="119" rx="5" ry="2.2" fill="#DC2626" transform="rotate(-12 164 119)" />

            {/* Top Crispy Golden Crust */}
            <path
              d="M62 126 C78 66, 282 66, 298 126 C266 116, 94 116, 62 126 Z"
              fill={`url(#breadTop-${artworkKey})`}
            />
            {/* Highlight sheen along top ridge */}
            <path
              d="M98 86 Q180 72 262 86"
              stroke="#FADCA2"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Signature crisp ear / score marks */}
            <path d="M110 88 L138 109" stroke="#FCE3AC" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
            <path d="M111 91 L139 111" stroke="#A6550A" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
            <path d="M162 83 L190 106" stroke="#FCE3AC" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
            <path d="M163 86 L191 108" stroke="#A6550A" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
            <path d="M214 88 L242 109" stroke="#FCE3AC" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
            <path d="M215 91 L243 111" stroke="#A6550A" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
            {/* Toasted sesame seeds */}
            <circle cx="146" cy="95" r="1.7" fill="#FFF4D9" />
            <circle cx="196" cy="91" r="1.7" fill="#FFF4D9" />
            <circle cx="246" cy="99" r="1.7" fill="#FFF4D9" />
            <circle cx="122" cy="105" r="1.5" fill="#FFF4D9" />
          </g>
        )}

        {/* COFFEE FAMILY */}
        {(artworkKey === 'ca-phe-sua-da' ||
          artworkKey === 'ca-phe-den-da' ||
          artworkKey === 'bac-xiu' ||
          artworkKey === 'cold-brew-cam-sa') && (
          <g filter={`url(#softShadow-${artworkKey})`}>
            {/* Walnut coaster */}
            <ellipse cx="180" cy="184" rx="64" ry="12" fill="#3B2316" opacity="0.9" />
            <ellipse cx="180" cy="182" rx="56" ry="9" fill="#523221" />

            {/* Coffee beans resting beside glass */}
            <g transform="translate(100, 178) rotate(-18)">
              <ellipse cx="0" cy="0" rx="8" ry="5.5" fill="#3D2012" />
              <path d="M-5 0 Q0 2 5 0" stroke="#1E0E07" strokeWidth="1.3" />
            </g>
            <g transform="translate(254, 180) rotate(22)">
              <ellipse cx="0" cy="0" rx="8" ry="5.5" fill="#4A2716" />
              <path d="M-5 0 Q0 2 5 0" stroke="#1E0E07" strokeWidth="1.3" />
            </g>

            {/* Glass body */}
            <path
              d="M134 56 L226 56 L214 176 C213 182, 147 182, 146 176 Z"
              fill="#FFFFFF"
              fillOpacity="0.65"
              stroke="#C9B7A0"
              strokeWidth="2"
            />

            {artworkKey === 'ca-phe-sua-da' && (
              <g>
                {/* Condensed milk base */}
                <path d="M148 148 L212 148 L210 173 C209 178, 151 178, 150 173 Z" fill="#F8EBD7" />
                {/* Swirl marbling */}
                <path d="M147 146 Q180 156 213 144 L212 152 Q180 162 148 152 Z" fill="#D5A678" opacity="0.65" />
                {/* Rich Phin Coffee */}
                <path d="M139 76 L221 76 L213 148 L147 148 Z" fill={`url(#espresso-${artworkKey})`} />
                {/* Crema */}
                <path d="M138 69 L222 69 L221 78 L139 78 Z" fill={`url(#crema-${artworkKey})`} />
              </g>
            )}

            {artworkKey === 'ca-phe-den-da' && (
              <g>
                <path d="M139 74 L221 74 L211 173 C210 178, 150 178, 149 173 Z" fill={`url(#espresso-${artworkKey})`} />
                <path d="M138 68 L222 68 L221 76 L139 76 Z" fill={`url(#crema-${artworkKey})`} />
              </g>
            )}

            {artworkKey === 'bac-xiu' && (
              <g>
                <path d="M144 118 L216 118 L211 173 C210 178, 150 178, 149 173 Z" fill="#FAF1E2" />
                <path d="M140 82 L220 82 L216 120 L144 120 Z" fill="#9E6238" />
                <path d="M138 68 L222 68 L220 84 L140 84 Z" fill="#FFFDF9" />
              </g>
            )}

            {artworkKey === 'cold-brew-cam-sa' && (
              <g>
                <path d="M139 74 L221 74 L211 173 C210 178, 150 178, 149 173 Z" fill="#592611" />
                {/* Citrus slice inside */}
                <circle cx="198" cy="108" r="20" fill="#EA8A11" />
                <circle cx="198" cy="108" r="16" fill="#FBBF24" />
                <path d="M198 94 L198 122 M184 108 L212 108 M188 98 L208 118 M208 98 L188 118" stroke="#EA8A11" strokeWidth="1.5" />
                {/* Lemongrass stalk */}
                <path d="M156 34 L172 150" stroke="#4D8A47" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M158 34 L170 120" stroke="#74B06C" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            )}

            {/* Crystal ice cubes */}
            <rect x="148" y="84" width="22" height="22" rx="4.5" transform="rotate(-14 148 84)" fill="#FFFFFF" fillOpacity="0.28" stroke="#FFFFFF" strokeOpacity="0.55" />
            <rect x="180" y="80" width="21" height="21" rx="4.5" transform="rotate(15 180 80)" fill="#FFFFFF" fillOpacity="0.24" stroke="#FFFFFF" strokeOpacity="0.5" />
            <rect x="160" y="114" width="20" height="20" rx="4.5" transform="rotate(8 160 114)" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeOpacity="0.4" />

            {/* Glass rim & reflection */}
            <ellipse cx="180" cy="56" rx="46" ry="5" fill="#FFFFFF" fillOpacity="0.35" stroke="#D1C1AB" strokeWidth="1.5" />
            <path d="M144 66 L152 164" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            <path d="M214 66 L208 164" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.28" />

            {/* Condensation droplets */}
            <circle cx="152" cy="96" r="1.5" fill="#FFFFFF" opacity="0.7" />
            <circle cx="156" cy="128" r="1.8" fill="#FFFFFF" opacity="0.65" />
            <circle cx="204" cy="136" r="1.5" fill="#FFFFFF" opacity="0.65" />

            {/* Straw */}
            <path d="M204 28 L184 144" stroke="#24140D" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {/* PASTRY FAMILY */}
        {(artworkKey === 'croissant-bo-phap' ||
          artworkKey === 'pain-au-chocolat' ||
          artworkKey === 'banh-bong-lan-trung-muoi') && (
          <g filter={`url(#softShadow-${artworkKey})`}>
            <ellipse cx="180" cy="172" rx="116" ry="29" fill="#FDFBF7" stroke="#DFD4C2" strokeWidth="1.5" />
            <ellipse cx="180" cy="170" rx="90" ry="20" fill="#F8F4EC" stroke="#EAE0CF" strokeWidth="1" />

            {artworkKey === 'croissant-bo-phap' && (
              <g>
                <path
                  d="M78 152 C82 104, 130 78, 180 78 C230 78, 278 104, 282 152 C260 160, 240 144, 224 136 C202 144, 158 144, 136 136 C120 144, 100 160, 78 152 Z"
                  fill={`url(#pastry-${artworkKey})`}
                />
                {/* Laminated folds */}
                <path d="M138 86 Q130 116 138 138" stroke="#8C4507" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M222 86 Q230 116 222 138" stroke="#8C4507" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M160 79 Q180 70 200 79" stroke="#FBE1A6" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M148 96 Q180 86 212 96" stroke="#F7CC78" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                {/* Flaky crumbs */}
                <circle cx="116" cy="164" r="2.2" fill="#C97314" />
                <circle cx="128" cy="168" r="1.5" fill="#B5620E" />
                <circle cx="242" cy="166" r="2" fill="#C97314" />
              </g>
            )}

            {artworkKey === 'pain-au-chocolat' && (
              <g>
                <rect x="104" y="88" width="152" height="72" rx="18" fill={`url(#pastry-${artworkKey})`} />
                <path d="M104 128 L256 128" stroke="#9B4D09" strokeWidth="2" opacity="0.45" />
                <path d="M136 88 L136 160" stroke="#9B4D09" strokeWidth="2.2" opacity="0.55" />
                <path d="M224 88 L224 160" stroke="#9B4D09" strokeWidth="2.2" opacity="0.55" />
                {/* Dark 70% chocolate batons peeking */}
                <ellipse cx="120" cy="144" rx="11" ry="7" fill="#3B1B0E" />
                <ellipse cx="240" cy="144" rx="11" ry="7" fill="#3B1B0E" />
                <path d="M146 106 L214 106" stroke="#FCE0A1" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
              </g>
            )}

            {artworkKey === 'banh-bong-lan-trung-muoi' && (
              <g>
                {/* Sponge cake base */}
                <rect x="108" y="102" width="144" height="58" rx="14" fill="#F4C763" />
                {/* Cheese & salted egg cream drizzle */}
                <path
                  d="M108 118 C132 130, 152 108, 180 122 C208 108, 228 130, 252 118 L252 102 C252 94, 244 88, 234 88 L126 88 C116 88, 108 94, 108 102 Z"
                  fill="#FFF2CC"
                />
                {/* Salted egg yolks */}
                <circle cx="140" cy="100" r="10" fill="#E36414" />
                <circle cx="137" cy="97" r="3" fill="#FDBA74" />
                <circle cx="180" cy="98" r="10.5" fill="#E36414" />
                <circle cx="177" cy="95" r="3" fill="#FDBA74" />
                <circle cx="220" cy="100" r="10" fill="#E36414" />
                <circle cx="217" cy="97" r="3" fill="#FDBA74" />
                {/* Pork floss strands */}
                <path d="M126 90 Q144 82 160 90 M168 88 Q186 80 202 88 M206 90 Q222 83 236 90" stroke="#B86B1D" strokeWidth="2.8" strokeLinecap="round" />
              </g>
            )}
          </g>
        )}

        {/* COMBO FAMILY */}
        {artworkKey === 'combo-sang-nang-luong' && (
          <g filter={`url(#softShadow-${artworkKey})`}>
            {/* Plate + Banh mi left */}
            <ellipse cx="130" cy="172" rx="88" ry="23" fill="#FDFBF7" stroke="#DFD4C2" strokeWidth="1.5" />
            <path d="M62 142 C76 164, 184 164, 198 142 Z" fill={`url(#breadBottom-${artworkKey})`} />
            <path d="M68 138 Q130 122 192 138" stroke="#358C4D" strokeWidth="8" strokeLinecap="round" />
            <path d="M84 134 Q130 126 176 134" stroke="#D9614E" strokeWidth="6" strokeLinecap="round" />
            <path
              d="M58 134 C72 86, 188 86, 202 134 C178 128, 82 128, 58 134 Z"
              fill={`url(#breadTop-${artworkKey})`}
            />
            <path d="M100 105 L120 120 M142 102 L162 118" stroke="#FCE3AC" strokeWidth="3.5" strokeLinecap="round" />

            {/* Iced Milk Coffee right */}
            <ellipse cx="264" cy="178" rx="40" ry="8" fill="#3B2316" opacity="0.85" />
            <path
              d="M230 72 L298 72 L288 172 C287 177, 241 177, 240 172 Z"
              fill="#FFFFFF"
              fillOpacity="0.65"
              stroke="#C9B7A0"
              strokeWidth="1.8"
            />
            <path d="M242 148 L286 148 L285 169 C284 173, 244 173, 243 169 Z" fill="#F8EBD7" />
            <path d="M234 90 L294 90 L286 148 L242 148 Z" fill={`url(#espresso-${artworkKey})`} />
            <path d="M233 84 L295 84 L294 92 L234 92 Z" fill={`url(#crema-${artworkKey})`} />
            <rect x="242" y="96" width="16" height="16" rx="3.5" transform="rotate(-12 242 96)" fill="#FFFFFF" fillOpacity="0.28" />
            <rect x="266" y="94" width="15" height="15" rx="3.5" transform="rotate(14 266 94)" fill="#FFFFFF" fillOpacity="0.24" />
            <path d="M282 48 L266 138" stroke="#24140D" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
