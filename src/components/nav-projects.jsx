import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavLink } from 'react-router-dom'

export function NavProjects({ projects }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavItem({ item }) {
  const [open, setOpen] = useState(false)
  const Icon = item.icon

  // 🔹 DROPDOWN ITEM (Stock Management)
  if (item.children) {
    return (
      <>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => setOpen(!open)}>
            <Icon />
            <span>{item.name}</span>
            <ChevronDown
              className={`ml-auto size-4 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>

        {open &&
          item.children.map((child) => {
            const ChildIcon = child.icon
            return (
              <SidebarMenuItem key={child.name} className="ml-6">
                <SidebarMenuButton asChild size="sm">
                  <NavLink to={child.url}>
                    <ChildIcon />
                    <span>{child.name}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
      </>
    )
  }

  // 🔹 NORMAL ITEM (unchanged)
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink to={item.url}>
          <Icon />
          <span>{item.name}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
