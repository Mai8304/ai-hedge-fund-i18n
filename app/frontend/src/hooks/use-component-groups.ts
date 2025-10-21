import { ComponentGroup } from '@/data/sidebar-components';
import { useEffect, useMemo, useState } from 'react';

export function useComponentGroups(componentGroups: ComponentGroup[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>([]); // Start with all groups collapsed
  const [isSearching, setIsSearching] = useState(false);

  // Filter groups and items based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return componentGroups;

    const lowered = searchQuery.toLowerCase();

    return componentGroups
      .map((group) => {
        const filteredItems = group.items.filter((item) =>
          item.label.toLowerCase().includes(lowered) || item.name.toLowerCase().includes(lowered)
        );

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [componentGroups, searchQuery]);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      // Open all groups that have matching items
      setOpenGroups(filteredGroups.map(group => group.name));
    } else if (isSearching) {
      // Only reset groups when exiting search mode
      setIsSearching(false);
    }
  }, [searchQuery, filteredGroups]);

  // Handle accordion value changes
  const handleAccordionChange = (value: string[]) => {
    // Only update if we're not actively searching
    if (!searchQuery) {
      setOpenGroups(value);
    } else {
      // During search, we need to preserve expanded groups that have matches
      const matchingGroups = filteredGroups.map(group => group.name);
      // Keep all matching groups open while allowing manual toggling of others
      const newValue = value.filter(group => matchingGroups.includes(group));
      if (newValue.length < matchingGroups.length) {
        // If user is closing a search result group, allow that
        setOpenGroups(newValue);
      } else {
        // User is opening a new group during search
        setOpenGroups(value);
      }
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    activeItem,
    setActiveItem,
    openGroups,
    setOpenGroups,
    isSearching,
    filteredGroups,
    handleAccordionChange
  };
} 
