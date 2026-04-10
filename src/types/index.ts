export type View = 'dashboard' | 'instances' | 'sql' | 'capacity' | 'metrics' | 'alerts';

export interface NavItem {
  id: View;
  label: string;
  icon: any;
}

export interface Instance {
  name: string;
  ip: string;
  type: 'O' | 'M' | 'P' | 'R';
  cpu: number;
  ramPct: number;
  ramText: string;
  diskPct: number;
  diskText: string;
  tps: number;
  qps: number;
  sessions: number;
  status: 'ONLINE' | 'OFFLINE';
}

export interface WaitEvent {
  name: string;
  class: string;
  waits: number;
  time: number;
  avg: number;
  isWarning?: boolean;
}

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  instance: string;
  time: string;
  status: 'active' | 'resolved';
}
