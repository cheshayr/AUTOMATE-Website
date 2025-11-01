import * as React from 'react';
import {
  BarChart2,
  BookOpen,
  Bot,
  Calendar,
  Command,
  Frame,
  Home,
  LifeBuoy,
  LogOut,
  Map,
  Package,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  Wrench,
  MessageCircle,
  FileText,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthContext } from '@/context/AuthContext';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-day-picker';

const data = {
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  admin: [
    { url: '/dashboard', icon: Home, name: 'Dashboard' },
    { url: '/appointments', icon: Calendar, name: 'Appointments' },
    { url: '/services', icon: Wrench, name: 'Services' },
    // { url: '/inventory', icon: Package, name: 'Inventory' },
    { url: '/user', icon: Users, name: 'User Management' },
    { url: '/feedbacks', icon: MessageCircle, name: 'Feedbacks' },
    { url: '/analytics', icon: BarChart2, name: 'Analytics' },
    { url: '/reports', icon: FileText, name: 'Reports' },
  ],

  staff: [
    { url: '/dashboard', icon: Home, name: 'Dashboard' },
    { url: '/appointments', icon: Calendar, name: 'Appointments' },
    { url: '/services', icon: Wrench, name: 'Services' },
    // { url: '/inventory', icon: Package, name: 'Inventory' },
    { url: '/feedbacks', icon: MessageCircle, name: 'Feedbacks' },
    { url: '/activities', icon: Frame, name: 'Activity Logs' },
    { url: '/analytics', icon: BarChart2, name: 'Analytics' },
    { url: '/reports', icon: FileText, name: 'Reports' },

    // { to: '/dashboard', icon: <Home size={24} />, label: 'Dashboard' },
    //   { to: '/appointments', icon: <Calendar size={24} />, label: 'Appointments' },
    //   { to: '/services', icon: <Wrench size={24} />, label: 'Services' },
    //   { to: '/inventory', icon: <Package size={24} />, label: 'Inventory' },
    //   { to: '/activities', icon: <ClipboardList size={24} />, label: 'Activity Logs' },
    //   { to: '/analytics', icon: <BarChart2 size={24} />, label: 'Analytics' },
  ],
};

export function AppSidebar({ ...props }) {
  const { user, logout } = useAuthContext();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src="/logo.png"
                    alt="Tierodman Logo"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Tierodman</span>
                  <span className="truncate text-xs">Auto Center</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={user.role === 'admin' ? data.admin : data.staff} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm">
                  <NavLink href={'#'} onClick={logout}>
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}
