"use client";

import React from "react";
import { motion } from "motion/react";

interface TrophySvgProps {
  tier: "apex" | "build" | "break";
  size?: number;
  className?: string;
  isHovered?: boolean;
}

export function ChampionshipTrophy({
  tier,
  size = 320,
  className = "",
  isHovered = false,
}: TrophySvgProps) {
  // Palettes per tier (Gold / Silver / Bronze)
  const isApex = tier === "apex";
  const isBuild = tier === "build";
  const isBreak = tier === "break";

  const config = {
    apex: {
      rankNum: "1",
      rankLabel: "1ST PLACE",
      title: "GRAND APEX",
      metalGrad: "goldMetal",
      metalDark: "#78470E",
      metalMid: "#D97706",
      metalLight: "#FDE68A",
      metalBright: "#FFFBEB",
      metalShadow: "#451A03",
      accentColor: "#F59E0B",
      coreGlow: "url(#apexCoreGlow)",
      wingAccent: "#8B7CF6",
      wingAccent2: "#C4642E",
      plaqueColor: "#F59E0B",
      scale: 1.0,
    },
    build: {
      rankNum: "2",
      rankLabel: "2ND PLACE",
      title: "BUILD SOVEREIGN",
      metalGrad: "silverMetal",
      metalDark: "#334155",
      metalMid: "#94A3B8",
      metalLight: "#E2E8F0",
      metalBright: "#FFFFFF",
      metalShadow: "#1E293B",
      accentColor: "#8B7CF6",
      coreGlow: "url(#buildCoreGlow)",
      wingAccent: "#8B7CF6",
      wingAccent2: "#60A5FA",
      plaqueColor: "#CBD5E1",
      scale: 0.92,
    },
    break: {
      rankNum: "3",
      rankLabel: "3RD PLACE",
      title: "BREAK ADVERSARY",
      metalGrad: "bronzeMetal",
      metalDark: "#572612",
      metalMid: "#B45309",
      metalLight: "#FDBA74",
      metalBright: "#FED7AA",
      metalShadow: "#371408",
      accentColor: "#C4642E",
      coreGlow: "url(#breakCoreGlow)",
      wingAccent: "#C4642E",
      wingAccent2: "#EA580C",
      plaqueColor: "#FDBA74",
      scale: 0.86,
    },
  }[tier];

  return (
    <div
      style={{ width: size, height: size * 1.25 }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
      >
        <defs>
          {/* ================= GOLD SHADERS ================= */}
          <linearGradient id="goldMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#78470E" />
            <stop offset="18%" stopColor="#D97706" />
            <stop offset="42%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#FFFBEB" />
            <stop offset="68%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <linearGradient id="goldCupShine" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#FDE68A" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#78470E" stopOpacity="0.9" />
          </linearGradient>

          {/* ================= SILVER SHADERS ================= */}
          <linearGradient id="silverMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="20%" stopColor="#94A3B8" />
            <stop offset="45%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#CBD5E1" />
            <stop offset="85%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="silverCupShine" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#E2E8F0" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#64748B" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9" />
          </linearGradient>

          {/* ================= BRONZE SHADERS ================= */}
          <linearGradient id="bronzeMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="20%" stopColor="#9A3412" />
            <stop offset="45%" stopColor="#FDBA74" />
            <stop offset="50%" stopColor="#FED7AA" />
            <stop offset="65%" stopColor="#EA580C" />
            <stop offset="85%" stopColor="#7C2D12" />
            <stop offset="100%" stopColor="#2A0E04" />
          </linearGradient>

          <linearGradient id="bronzeCupShine" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#FDBA74" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#9A3412" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2A0E04" stopOpacity="0.9" />
          </linearGradient>

          {/* Base & Pedestal Titanium Shaders */}
          <linearGradient id="titaniumPlinth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2234" />
            <stop offset="50%" stopColor="#1B1424" />
            <stop offset="100%" stopColor="#100C16" />
          </linearGradient>
          <linearGradient id="plinthHighlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8E2D6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#E8E2D6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E8E2D6" stopOpacity="0.1" />
          </linearGradient>

          {/* Ambient Core Glows */}
          <radialGradient id="apexCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#8B7CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C4642E" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="buildCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#8B7CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="breakCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#EA580C" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
          </radialGradient>

          {/* Filter Glow */}
          <filter id={`trophyGlow-${tier}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Backlight Halo behind Trophy */}
        <circle
          cx="200"
          cy="200"
          r="120"
          fill={config.coreGlow}
          className="opacity-40 animate-pulse"
        />

        {/* ============================================================ */}
        {/*  BASE / PEDESTAL (Stepped Titanium Plinth)                   */}
        {/* ============================================================ */}
        <g id="pedestal">
          {/* Ground Contact Shadow */}
          <ellipse cx="200" cy="480" rx="140" ry="16" fill="#000000" opacity="0.75" />

          {/* Bottom Octagonal Foot */}
          <path
            d="M 80 470 L 110 445 L 290 445 L 320 470 L 305 478 L 95 478 Z"
            fill="url(#titaniumPlinth)"
            stroke="#E8E2D6"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          {/* Foot Top Highlight */}
          <line x1="110" y1="445" x2="290" y2="445" stroke="url(#plinthHighlight)" strokeWidth="1.5" />

          {/* Middle Plinth Body */}
          <path
            d="M 105 445 L 120 395 L 280 395 L 295 445 Z"
            fill="url(#titaniumPlinth)"
            stroke="#E8E2D6"
            strokeOpacity="0.2"
            strokeWidth="1"
          />

          {/* Carbon/Laser Inlay Panel */}
          <rect
            x="135"
            y="405"
            width="130"
            height="30"
            rx="4"
            fill="#0F0A15"
            stroke={config.accentColor}
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          {/* Laser Inscribed Rank Plate */}
          <text
            x="200"
            y="420"
            textAnchor="middle"
            fill={config.plaqueColor}
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
            fontFamily="monospace"
          >
            {config.rankLabel}
          </text>
          <text
            x="200"
            y="430"
            textAnchor="middle"
            fill="#E8E2D6"
            fillOpacity="0.6"
            fontSize="7"
            letterSpacing="1"
            fontFamily="monospace"
          >
            BUILD VS BREAK 2.0
          </text>

          {/* Plinth Upper Collar (Metallic Ring) */}
          <path
            d="M 130 395 L 145 375 L 255 375 L 270 395 Z"
            fill={`url(#${config.metalGrad})`}
            stroke="#FFFFFF"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        </g>

        {/* ============================================================ */}
        {/*  TROPHY STEM & RISER                                         */}
        {/* ============================================================ */}
        <g id="stem">
          {/* Lower Stem Cone */}
          <path
            d="M 155 375 L 175 320 L 225 320 L 245 375 Z"
            fill={`url(#${config.metalGrad})`}
            stroke="#000000"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          {/* Stem Specular Highlight */}
          <path
            d="M 194 375 L 197 320 L 203 320 L 206 375 Z"
            fill={config.metalBright}
            opacity="0.65"
          />

          {/* Stem Cybernetic Conduits */}
          <line
            x1="180"
            y1="370"
            x2="190"
            y2="325"
            stroke={isApex ? "#8B7CF6" : config.accentColor}
            strokeWidth="2"
            strokeOpacity="0.8"
          />
          <line
            x1="220"
            y1="370"
            x2="210"
            y2="325"
            stroke={isApex ? "#C4642E" : config.accentColor}
            strokeWidth="2"
            strokeOpacity="0.8"
          />

          {/* Stem Knurled Ring Collar */}
          <rect
            x="170"
            y="312"
            width="60"
            height="8"
            rx="2"
            fill={`url(#${config.metalGrad})`}
            stroke="#FFFFFF"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
        </g>

        {/* ============================================================ */}
        {/*  CYBERNETIC WINGS / HANDLES                                   */}
        {/* ============================================================ */}
        <g id="wings">
          {/* Left Wing (Build Vector) */}
          <path
            d="M 140 280 C 70 260 50 180 80 120 C 95 90 125 100 135 125 C 105 145 95 210 145 255 Z"
            fill={`url(#${config.metalGrad})`}
            stroke={config.metalBright}
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          {/* Left Wing Neon Conduit Track */}
          <path
            d="M 90 135 C 75 180 85 230 130 265"
            fill="none"
            stroke={config.wingAccent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={isApex ? "4 4" : "none"}
            opacity="0.9"
          />

          {/* Right Wing (Break Vector) */}
          <path
            d="M 260 280 C 330 260 350 180 320 120 C 305 90 275 100 265 125 C 295 145 305 210 255 255 Z"
            fill={`url(#${config.metalGrad})`}
            stroke={config.metalBright}
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          {/* Right Wing Neon Conduit Track */}
          <path
            d="M 310 135 C 325 180 315 230 270 265"
            fill="none"
            stroke={config.wingAccent2}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={isApex ? "4 4" : "none"}
            opacity="0.9"
          />
        </g>

        {/* ============================================================ */}
        {/*  MAIN CHALICE / CUP BODY                                     */}
        {/* ============================================================ */}
        <g id="cup">
          {/* Outer Cup Silhouette */}
          <path
            d="M 130 110 C 130 220 155 315 200 315 C 245 315 270 220 270 110 Z"
            fill={`url(#${config.metalGrad})`}
            stroke="#000000"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />

          {/* Inside Rim Depth */}
          <ellipse
            cx="200"
            cy="110"
            rx="70"
            ry="14"
            fill={config.metalShadow}
            stroke={`url(#${config.metalGrad})`}
            strokeWidth="2"
          />
          <ellipse
            cx="200"
            cy="111"
            rx="66"
            ry="11"
            fill="#0D0914"
          />

          {/* Cup Frontal Specular Sheen (Curved metallic gloss) */}
          <path
            d="M 192 115 C 192 215 197 295 200 310 C 203 295 208 215 208 115 Z"
            fill={config.metalBright}
            opacity="0.45"
          />

          {/* Left Flank Rim Highlight */}
          <path
            d="M 134 125 C 134 200 150 270 175 300 C 160 270 142 205 140 125 Z"
            fill={config.metalLight}
            opacity="0.5"
          />

          {/* Shading Overlay */}
          <path
            d="M 130 110 C 130 220 155 315 200 315 C 245 315 270 220 270 110 Z"
            fill={
              isApex
                ? "url(#goldCupShine)"
                : isBuild
                ? "url(#silverCupShine)"
                : "url(#bronzeCupShine)"
            }
            opacity="0.75"
          />
        </g>

        {/* ============================================================ */}
        {/*  EMBOSSED RANK CREST (Center Medallion)                      */}
        {/* ============================================================ */}
        <g id="medallion">
          {/* Medallion Outer Metallic Rim */}
          <circle
            cx="200"
            cy="195"
            r="38"
            fill={`url(#${config.metalGrad})`}
            stroke="#FFFFFF"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            filter={`url(#trophyGlow-${tier})`}
          />
          {/* Outer Ring Inset */}
          <circle
            cx="200"
            cy="195"
            r="34"
            fill="#120D1A"
            stroke={config.accentColor}
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Inner Disc */}
          <circle
            cx="200"
            cy="195"
            r="28"
            fill="url(#titaniumPlinth)"
            stroke={config.metalMid}
            strokeWidth="1"
          />

          {/* Large Bold Rank Number (1, 2, 3) */}
          <text
            x="200"
            y="206"
            textAnchor="middle"
            fill={config.metalBright}
            fontSize="32"
            fontWeight="900"
            fontFamily="Space Grotesk, sans-serif"
            style={{
              filter: `drop-shadow(0px 2px 4px ${config.metalShadow})`,
            }}
          >
            {config.rankNum}
          </text>

          {/* Subtext: PLACE */}
          <text
            x="200"
            y="218"
            textAnchor="middle"
            fill={config.metalLight}
            fontSize="6.5"
            fontWeight="bold"
            letterSpacing="1.5"
            fontFamily="monospace"
          >
            PLACE
          </text>

          {/* Star Laurels / Chevrons around Medallion */}
          {isApex && (
            <path
              d="M 188 168 L 200 162 L 212 168 L 208 174 L 192 174 Z"
              fill="#FDE68A"
              stroke="#D97706"
              strokeWidth="0.5"
            />
          )}
          {isBuild && (
            <path
              d="M 190 168 L 200 163 L 210 168 L 200 172 Z"
              fill="#E2E8F0"
              stroke="#8B7CF6"
              strokeWidth="0.8"
            />
          )}
          {isBreak && (
            <path
              d="M 192 166 L 200 172 L 208 166 L 200 163 Z"
              fill="#FED7AA"
              stroke="#C4642E"
              strokeWidth="0.8"
            />
          )}
        </g>

        {/* ============================================================ */}
        {/*  APEX CROWN / GEMSTONE FLOATING AT THE SUMMIT                */}
        {/* ============================================================ */}
        <g id="apexCrown">
          {isApex && (
            /* Radiant Apex Diamond Prism (1st Place) */
            <g transform="translate(200, 68)">
              {/* Diamond Glow */}
              <circle cx="0" cy="0" r="28" fill="#F59E0B" opacity="0.3" filter="blur(6px)" />
              {/* Floating Diamond Facets */}
              <polygon points="0,-22 18,-6 12,18 0,26 -12,18 -18,-6" fill="url(#goldMetal)" stroke="#FFFBEB" strokeWidth="1" />
              <polygon points="0,-22 18,-6 0,6" fill="#FFFBEB" opacity="0.8" />
              <polygon points="0,-22 -18,-6 0,6" fill="#FDE68A" opacity="0.6" />
              <polygon points="0,6 18,-6 12,18" fill="#D97706" opacity="0.7" />
              <polygon points="0,6 -18,-6 -12,18" fill="#B45309" opacity="0.7" />
              <polygon points="0,6 12,18 0,26" fill="#78470E" opacity="0.9" />
              <polygon points="0,6 -12,18 0,26" fill="#451A03" opacity="0.9" />
              {/* Dual Energy Beams into Chalice */}
              <line x1="-12" y1="20" x2="-35" y2="44" stroke="#8B7CF6" strokeWidth="1.5" strokeOpacity="0.8" />
              <line x1="12" y1="20" x2="35" y2="44" stroke="#C4642E" strokeWidth="1.5" strokeOpacity="0.8" />
            </g>
          )}

          {isBuild && (
            /* Quantum Architectural Tesseract (2nd Place) */
            <g transform="translate(200, 72)">
              <circle cx="0" cy="0" r="24" fill="#8B7CF6" opacity="0.3" filter="blur(6px)" />
              {/* Outer Wireframe Hexagon */}
              <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="#1E162A" stroke="#8B7CF6" strokeWidth="1.5" />
              {/* Inner Cube */}
              <polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="#8B7CF6" opacity="0.5" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="-9" y1="-5" x2="9" y2="5" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="-9" y1="5" x2="9" y2="-5" stroke="#FFFFFF" strokeWidth="1" />
              {/* Connectors to cup rim */}
              <line x1="-10" y1="16" x2="-25" y2="38" stroke="#8B7CF6" strokeWidth="1.5" />
              <line x1="10" y1="16" x2="25" y2="38" stroke="#8B7CF6" strokeWidth="1.5" />
            </g>
          )}

          {isBreak && (
            /* Volcanic Obsidian Breach Shard (3rd Place) */
            <g transform="translate(200, 74)">
              <circle cx="0" cy="0" r="22" fill="#EA580C" opacity="0.35" filter="blur(6px)" />
              {/* Angular Shattered Shards */}
              <polygon points="0,-20 14,-4 6,16 -8,18 -14,2" fill="#2A1208" stroke="#FED7AA" strokeWidth="1" />
              <polygon points="0,-20 14,-4 2,4" fill="#EA580C" opacity="0.85" />
              <polygon points="0,-20 -14,2 -2,4" fill="#9A3412" opacity="0.75" />
              <polygon points="2,4 14,-4 6,16" fill="#FDBA74" opacity="0.9" />
              <polygon points="-2,4 -14,2 -8,18" fill="#451A03" opacity="0.9" />
              {/* Molten thermal fissure lines */}
              <line x1="0" y1="-20" x2="0" y2="16" stroke="#FED7AA" strokeWidth="1.2" />
              <line x1="-8" y1="18" x2="-22" y2="36" stroke="#C4642E" strokeWidth="1.5" />
              <line x1="6" y1="16" x2="22" y2="36" stroke="#C4642E" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* Orbiting Laser Telemetry Reticle */}
        <g opacity={isHovered ? 0.9 : 0.45} className="transition-opacity duration-300">
          <ellipse
            cx="200"
            cy="110"
            rx="88"
            ry="24"
            fill="none"
            stroke={config.accentColor}
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        </g>
      </svg>
    </div>
  );
}
