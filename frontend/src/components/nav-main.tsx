"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// temporairement, a modifier apres
const sidebarStyles = `
  [data-sidebar="sidebar"] {
    background-color: #f7fbfc !important;
  }
  [data-slot="sidebar-group-label"] {
    color: #769fcd !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    font-size: 0.75rem !important;
    letter-spacing: 0.05em !important;
    margin-bottom: 12px !important;
    padding-left: 12px !important;
    opacity: 0.9 !important;
  }
  [data-sidebar="menu"] {
    gap: 2px !important;
    padding: 0 8px !important;
  }
  [data-sidebar="menu-button"] {
    border-radius: 12px !important;
    transition: all 0.2s ease-in-out !important;
    margin: 2px 0 !important;
    padding: 10px 12px !important;
    font-weight: 500 !important;
    position: relative !important;
    color: #4a4a4a !important;
    background-color: transparent !important;
  }
    

  [data-sidebar="menu-button"] svg {
    color: #7a7a7a !important;
    transition: color 0.2s ease-in-out !important;
    width: 18px !important;
    height: 18px !important;
  }

  [data-sidebar="menu-button"]:hover {
    background-color: #d6e6f2 !important;
    color: #213b61 !important;
    box-shadow: 0 2px 4px rgba(118, 159, 205, 0.12) !important;
    transform: translateY(-1px) !important;
  }

  [data-sidebar="menu-button"]:hover svg {
    color: #769fcd !important;
  }

  [data-sidebar="menu-button"][data-active="true"],
  [data-sidebar="menu-button"].active,
  [data-sidebar="menu-item"].active [data-sidebar="menu-button"] {
    background-color: #b9d7ea !important;
    color: #213b61 !important;
    font-weight: 600 !important;
    box-shadow: 0 3px 8px rgba(118, 159, 205, 0.18) !important;
  }

  [data-sidebar="menu-button"][data-active="true"] svg,
  [data-sidebar="menu-button"].active svg,
  [data-sidebar="menu-item"].active [data-sidebar="menu-button"] svg {
    color: #769fcd !important;
  }
   
  [data-sidebar="menu-button"] svg[class*="ChevronRight"],
  [data-sidebar="menu-button"] .lucide-chevron-right {
    margin-left: auto !important;
    color: #7a7a7a !important;
    transition: all 0.2s ease-in-out !important;
    width: 16px !important;
    height: 16px !important;
  }

  [data-sidebar="menu-button"]:hover svg[class*="ChevronRight"],
  [data-sidebar="menu-button"]:hover .lucide-chevron-right {
    color: #769fcd !important;
  }

  .group-data-\\[state\\=open\\]\\/collapsible svg[class*="ChevronRight"],
  .group-data-\\[state\\=open\\]\\/collapsible .lucide-chevron-right {
    transform: rotate(90deg) !important;
    color: #769fcd !important;
  }

  [data-sidebar="menu-sub"] {
    margin-left: 20px !important;
    margin-top: 6px !important;
    margin-bottom: 4px !important;
    gap: 1px !important;
  }


  /* ===== ANIMATIONS COLLAPSIBLE ===== */
  [data-radix-collapsible-content] {
    overflow: hidden !important;
    transition: all 0.25s ease-in-out !important;
  }

  [data-radix-collapsible-content][data-state="closed"] {
    animation: slideUp 0.25s ease-in-out !important;
  }

  [data-radix-collapsible-content][data-state="open"] {
    animation: slideDown 0.25s ease-in-out !important;
  }

  /* ===== KEYFRAMES ===== */
  @keyframes slideDown {
    from {
      height: 0;
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      height: var(--radix-collapsible-content-height);
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      height: var(--radix-collapsible-content-height);
      opacity: 1;
      transform: translateY(0);
    }
    to {
      height: 0;
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  [data-slot="sidebar-group-label"]::after {
    content: '';
    display: block;
    height: 1px;
    background-color: #d6e6f2;
    margin-top: 8px;
    margin-bottom: 4px;
    width: calc(100% - 12px);
    margin-left: 0;
  }

  [data-sidebar="menu-button"]:focus-visible,
  [data-sidebar="menu-sub-button"]:focus-visible {
    outline: 2px solid #769fcd !important;
    outline-offset: 2px !important;
  }

  [data-sidebar="menu-item"] {
    position: relative !important;
  }

  /* Indicateur subtil pour l'item actif */
  [data-sidebar="menu-item"].active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background-color: #769fcd;
    border-radius: 0 2px 2px 0;
    opacity: 0.8;
  }

  /* ===== FIX POUR MODE ICÔNE (SIDEBAR COLLAPSE) ===== */
  /* Quand la sidebar est collapsée - utilise l'attribut data-state */
  [data-sidebar="sidebar"][data-state="collapsed"] [data-sidebar="menu-button"] {
    justify-content: center !important;
    padding: 10px !important;
  }

  [data-sidebar="sidebar"][data-state="collapsed"] [data-sidebar="menu-button"] svg {
    margin: 0 !important;
  }

  /* Cacher les chevrons en mode collapsed */
  [data-sidebar="sidebar"][data-state="collapsed"] [data-sidebar="menu-button"] svg[class*="ChevronRight"],
  [data-sidebar="sidebar"][data-state="collapsed"] [data-sidebar="menu-button"] .lucide-chevron-right {
    display: none !important;
  }

  /* Cacher le label du groupe en mode collapsed */
  [data-sidebar="sidebar"][data-state="collapsed"] [data-slot="sidebar-group-label"] {
    display: none !important;
  }

  /* Alternative avec data-collapsible="icon" si c'est ce qui est utilisé */
  [data-sidebar="sidebar"][data-collapsible="icon"] [data-sidebar="menu-button"],
  [data-collapsible="icon"] [data-sidebar="menu-button"] {
    justify-content: center !important;
    padding: 10px !important;
  }

  [data-sidebar="sidebar"][data-collapsible="icon"] [data-sidebar="menu-button"] svg,
  [data-collapsible="icon"] [data-sidebar="menu-button"] svg {
    margin: 0 !important;
  }

  [data-sidebar="sidebar"][data-collapsible="icon"] [data-sidebar="menu-button"] svg[class*="ChevronRight"],
  [data-sidebar="sidebar"][data-collapsible="icon"] [data-sidebar="menu-button"] .lucide-chevron-right,
  [data-collapsible="icon"] [data-sidebar="menu-button"] svg[class*="ChevronRight"],
  [data-collapsible="icon"] [data-sidebar="menu-button"] .lucide-chevron-right {
    display: none !important;
  }

  @media (max-width: 768px) {
    [data-sidebar="menu-button"] {
      padding: 8px 10px !important;
    }
    
    [data-sidebar="menu-sub-button"] {
      padding: 6px 10px !important;
      font-size: 0.8rem !important;
    }

    /* Mode icône responsive - plusieurs variantes pour couvrir tous les cas */
    [data-sidebar="sidebar"][data-state="collapsed"] [data-sidebar="menu-button"],
    [data-sidebar="sidebar"][data-collapsible="icon"] [data-sidebar="menu-button"],
    [data-collapsible="icon"] [data-sidebar="menu-button"] {
      padding: 8px !important;
    }
  }
`;

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

type NavSubItem = {
  title: string;
  url: string;
};

export function NavMain({
  items,
  currentPath,
}: {
  items: NavItem[];
  currentPath?: string;
}) {
  const isItemActive = (item: NavItem): boolean | undefined => {
    if (currentPath) {
      return (
        currentPath === `/dashboard${item.url}` ||
        (item.items &&
          item.items.some(
            (subItem: NavSubItem) => currentPath === `/dashboard${subItem.url}`,
          ))
      );
    }
    return item.isActive;
  };

  // =========== ila ma7tajinahach mnbe3d n7iydha   ===========
  // const isSubItemActive = (subItem: any) => {
  //   if (currentPath) {
  //     return currentPath === `/dashboard${subItem.url}`;
  //   }
  //   return false;
  // };
  return (
    <SidebarGroup>
      <style dangerouslySetInnerHTML={{ __html: sidebarStyles }} />
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = item.items && item.items.length > 0;
          const Icon = item.icon;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem >
                <CollapsibleTrigger  asChild>
                  {hasChildren ? (
                    <SidebarMenuButton tooltip={item.title}>
                      {Icon && <Icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  ) : (
                    <Link href={`/dashboard${item.url}`}  >
                      <SidebarMenuButton
                        tooltip={item.title}
                        data-active={isItemActive(item) || undefined}
                        
                      >
                        {Icon && <Icon  />}
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  )}
                </CollapsibleTrigger>

                {hasChildren && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            data-active={isItemActive(item) || undefined}
                          >
                            <Link href={`/dashboard${subItem.url}`}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}