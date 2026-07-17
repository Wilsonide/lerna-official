"use client";

import { useState } from "react";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const closeMobile = () => setMobileOpen(false);

  const toggleGroup = (group: string) =>
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !(prev[group] ?? true),
    }));

  const toggleItem = (item: string) =>
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));

  return {
    collapsed,
    mobileOpen,

    expandedGroups,
    expandedItems,

    toggleSidebar,
    toggleMobile,
    closeMobile,

    toggleGroup,
    toggleItem,
  };
}
