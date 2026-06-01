export interface AvailableDomain {
  id: string;
  domain: string;
  found_at: string;
  length: number;
  favorited: boolean;
  note: string;
}

export interface ScanStatus {
  scanning: boolean;
  length: number;
  offset: number;
  total: number;
  started_at: string | null;
}

export interface StatsDay {
  date: string;
  count: number;
}

export interface Stats {
  total_found: number;
  today_found: number;
  last_run: string;
  history: StatsDay[];
}

export interface ControlSettings {
  command: 'run' | 'stop';
  slice: number;
  concurrency: number;
}
