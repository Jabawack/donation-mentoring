'use client';

import { Mentor } from '@/types/mentor';
import { MapPin, Building2, Clock, DollarSign, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Language, translations } from '@/utils/i18n';
import { ensureProtocol } from '@/utils/helpers';
import { useState, useRef, useEffect, useCallback } from 'react';

interface ThemeConfig {
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  primaryLight: string;
  accentBg: string;
  accentHover: string;
  accentText: string;
  accentLight: string;
}

interface DarkModeConfig {
  bg: string;
  bgCard: string;
  text: string;
  textMuted: string;
  border: string;
}

interface MentorCardProps {
  mentor: Mentor;
  lang: Language;
  onClick: (mentor: Mentor) => void;
  theme?: ThemeConfig;
  darkMode?: DarkModeConfig;
}

// All tags shown via horizontal scroll

// Default theme
const defaultTheme: ThemeConfig = {
  primaryBg: 'bg-slate-800',
  primaryHover: 'hover:bg-slate-900',
  primaryText: 'text-slate-800',
  primaryLight: 'bg-slate-100',
  accentBg: 'bg-amber-500',
  accentHover: 'hover:bg-amber-600',
  accentText: 'text-amber-500',
  accentLight: 'bg-amber-50',
};

// Default dark mode (light mode)
const defaultDarkMode: DarkModeConfig = {
  bg: 'bg-gray-50',
  bgCard: 'bg-white',
  text: 'text-gray-900',
  textMuted: 'text-gray-600',
  border: 'border-gray-100',
};

export default function MentorCard({ mentor, lang, onClick, theme = defaultTheme, darkMode = defaultDarkMode }: MentorCardProps) {
  const t = translations[lang];
  const [imageError, setImageError] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = tagsRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const el = tagsRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll, mentor.tags]);

  const scrollTags = (direction: 'left' | 'right') => {
    const el = tagsRef.current;
    if (el) {
      const scrollAmount = 100;
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const name = lang === 'en' ? mentor.name_en : mentor.name_ko;
  const position = lang === 'en' ? mentor.position_en : mentor.position_ko;
  const location = lang === 'en' ? mentor.location_en : mentor.location_ko;
  const company = lang === 'en' ? mentor.company_en : mentor.company_ko;
  const description = lang === 'en' ? mentor.description_en : mentor.description_ko;

  // Fallback if current language is empty
  const displayName = name || mentor.name_en || mentor.name_ko || 'No Name';
  const displayPosition = position || mentor.position_en || mentor.position_ko || '';
  const displayLocation = location || mentor.location_en || mentor.location_ko || '';
  const displayCompany = company || mentor.company_en || mentor.company_ko || '';
  const displayDescription = description || mentor.description_en || mentor.description_ko || '';

  const tags = mentor.tags || [];

  const dm = darkMode;

  return (
    <div
      onClick={() => onClick(mentor)}
      className={`${dm.bgCard} rounded-xl shadow-sm border ${dm.border} overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group cursor-pointer`}
    >
      {/* Image with Name/Position Overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {mentor.picture_url && !imageError ? (
          <>
            <Image
              src={mentor.picture_url}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized={mentor.picture_url.includes('supabase.co')}
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Name and Position on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold text-white mb-0.5"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {displayName}
              </h3>
              <p className="text-sm text-white/90 line-clamp-1"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                {displayPosition}
              </p>
            </div>
          </>
        ) : (
          <div className={`flex items-center justify-center h-full ${dm.bgCard}`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-full ${theme.primaryLight} flex items-center justify-center`}>
                <span className={`text-2xl font-bold ${theme.primaryText}`}>{displayName.charAt(0).toUpperCase()}</span>
              </div>
              <p className={`text-base font-semibold ${dm.text}`}>{displayName}</p>
              <p className={`text-sm ${dm.textMuted}`}>{displayPosition}</p>
            </div>
          </div>
        )}

        {/* LinkedIn icon overlay */}
        {mentor.linkedin_url && (
          <a
            href={ensureProtocol(mentor.linkedin_url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 p-2 bg-white/60 hover:bg-[#0A66C2] rounded-full shadow-sm border border-gray-200/10 transition-all group/linkedin"
          >
            <Linkedin size={16} className="text-[#0A66C2] group-hover/linkedin:text-white transition-colors" />
          </a>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Company and Location */}
        <div className={`flex items-center flex-wrap gap-x-1 text-sm ${dm.textMuted}`}>
          {displayCompany && (
            <div className="flex items-center">
              <Building2 size={14} className="mr-1 opacity-60 flex-shrink-0" />
              <span className="truncate">{displayCompany}</span>
            </div>
          )}
          {displayCompany && displayLocation && (
            <span className="opacity-40">·</span>
          )}
          {displayLocation && (
            <div className="flex items-center">
              <MapPin size={14} className="mr-1 opacity-60 flex-shrink-0" />
              <span className="truncate">{displayLocation}</span>
            </div>
          )}
        </div>

        {/* Session info */}
        {(mentor.session_time_minutes || mentor.session_price_usd) && (
          <div className={`flex items-center text-sm font-medium ${theme.accentText}`}>
            {mentor.session_time_minutes && (
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{mentor.session_time_minutes}min</span>
              </div>
            )}
            {mentor.session_time_minutes && mentor.session_price_usd && (
              <span className={`mx-2 ${dm.textMuted} opacity-40`}>·</span>
            )}
            {mentor.session_price_usd && (
              <div className="flex items-center">
                <DollarSign size={14} className="mr-0.5" />
                <span>{mentor.session_price_usd} {t.unicefDonation}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {displayDescription && (
          <p className={`text-sm ${dm.textMuted} line-clamp-5 leading-relaxed flex-1 overflow-hidden`}>
            {displayDescription}
          </p>
        )}

        {/* Tags - scrollable row with arrows */}
        {tags.length > 0 && (
          <div className="relative flex items-center pt-2">
            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={(e) => { e.stopPropagation(); scrollTags('left'); }}
                className={`absolute left-0 z-10 px-0.5 py-1 bg-sky-600/80 text-white hover:bg-sky-600 rounded transition-all`}
                aria-label="Scroll left"
              >
                <ChevronLeft size={14} />
              </button>
            )}
            {/* Tags container */}
            <div
              ref={tagsRef}
              className={`flex items-center gap-1.5 overflow-x-auto scrollbar-hide ${canScrollLeft ? 'pl-4' : ''} ${canScrollRight ? 'pr-4' : ''}`}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 ${theme.primaryLight} ${theme.primaryText} text-xs font-medium rounded-full flex-shrink-0 whitespace-nowrap`}>
                  {tag}
                </span>
              ))}
            </div>
            {/* Right scroll button */}
            {canScrollRight && (
              <button
                onClick={(e) => { e.stopPropagation(); scrollTags('right'); }}
                className={`absolute right-0 z-10 px-0.5 py-1 bg-sky-600/80 text-white hover:bg-sky-600 rounded transition-all`}
                aria-label="Scroll right"
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
