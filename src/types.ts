export type AppStep = 
  | 'LANDING' 
  | 'FORMAT_SELECT' 
  | 'PHOTO_UPLOAD' 
  | 'CROP' 
  | 'DETAILS' 
  | 'PREVIEW' 
  | 'GENERATED';

export type FrameFormat = 'PFP' | 'BUILDER_ID';

export interface ImageAdjustment {
  zoom: number; // 0.4 to 3.0
  offsetX: number; // in pixels
  offsetY: number; // in pixels
  rotation: number; // degrees
}

export type ThemeStyle = 'CLASSIC_GOA' | 'SUNSET_PINK' | 'DEEP_SEA' | 'CYBER_GOA';

export interface BuilderData {
  name: string;
  role: string;
  city: string;
  builderTitle: string;
  buildingText: string;
  themeStyle: ThemeStyle;
}

export interface PresetSample {
  id: string;
  name: string;
  role: string;
  city: string;
  title: string;
  building: string;
  format: FrameFormat;
  avatarUrl: string;
}

