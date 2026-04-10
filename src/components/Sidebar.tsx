import React from 'react';
import { LayoutDashboard, Server, Database, Activity, Bell, Settings, LogOut, Sun, Moon, HardDrive } from 'lucide-react';
import { View, NavItem } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Sidebar({ currentView, onViewChange, isDark, onToggleTheme }: SidebarProps) {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: '总览', icon: LayoutDashboard },
    { id: 'instances', label: '实例监控', icon: Server },
    { id: 'sql', label: 'SQL 分析', icon: Database },
    { id: 'capacity', label: '容量管理', icon: HardDrive },
    { id: 'metrics', label: '性能指标', icon: Activity },
    { id: 'alerts', label: '告警中心', icon: Bell },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-screen sticky top-0 z-50">
      <div className="p-8 flex-1">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center shadow-glow transition-transform duration-500 group-hover:rotate-12">
            <Database className="text-sidebar-primary-foreground" size={22} />
          </div>
          <div>
            <h2 className="font-headline font-black text-xl tracking-tighter text-sidebar-foreground">CAMMON</h2>
            <p className="text-[9px] text-sidebar-primary font-black tracking-[0.3em] uppercase opacity-80">Observatory</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-md transition-all duration-300 group relative overflow-hidden ${
                currentView === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              {currentView === item.id && (
                <div className="absolute left-0 top-0 w-1 h-full bg-sidebar-primary"></div>
              )}
              <item.icon size={18} className={`transition-colors duration-300 ${currentView === item.id ? 'text-sidebar-primary' : 'group-hover:text-sidebar-foreground'}`} />
              <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
              
              {currentView === item.id && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-sidebar-primary shadow-glow animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8 space-y-4 bg-sidebar-accent/20 border-t border-sidebar-border">
        <button 
          onClick={onToggleTheme}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-300 group"
        >
          <div className="transition-transform duration-500 group-hover:rotate-180">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </div>
          <span className="font-black text-[11px] uppercase tracking-widest">{isDark ? '浅色模式' : '深色模式'}</span>
        </button>
        
        <div className="pt-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-9 h-9 rounded-lg border border-sidebar-border flex items-center justify-center overflow-hidden shadow-sm">
              <img src="https://picsum.photos/seed/user/36/36" alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-sidebar-foreground truncate uppercase tracking-tight">Admin User</p>
              <p className="text-[9px] text-sidebar-foreground/50 truncate font-mono">jingweilu117@gmail.com</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-md text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 group">
            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="font-black text-[11px] uppercase tracking-widest">退出登录</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
