/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Character {
  id: string;
  name: string;
  role: string;
  quote: string;
  description: string;
  timeline: string;
  imageAlt: string;
  accentColor: string;
  faction: 'hero' | 'villain' | 'neutral';
}

export interface MapLocation {
  id: string;
  name: string;
  description: string;
  x: number; // percentage from left
  y: number; // percentage from top
  importance: 'high' | 'medium' | 'low';
  details: string;
}

export interface TimelineEvent {
  id: string;
  movie: string;
  year: string;
  description: string;
  keyMoment: string;
  active: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  color: string;
  imageUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
}
