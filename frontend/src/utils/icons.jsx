import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';

export const getSkillIcon = (iconName) => {
  if (!iconName) return <FaIcons.FaCode />;

  // 1. Check in FontAwesome Icons
  if (FaIcons[iconName]) {
    const IconComponent = FaIcons[iconName];
    return <IconComponent />;
  }

  // 2. Check in SimpleIcons (commonly used for dev logos like next.js, tailwind, etc.)
  if (SiIcons[iconName]) {
    const IconComponent = SiIcons[iconName];
    return <IconComponent />;
  }

  // 3. Check with lowercase match or variations
  const cleanedName = iconName.startsWith('Fa') || iconName.startsWith('Si')
    ? iconName
    : `Fa${iconName.charAt(0).toUpperCase() + iconName.slice(1)}`;

  if (FaIcons[cleanedName]) {
    const IconComponent = FaIcons[cleanedName];
    return <IconComponent />;
  }

  // Fallback
  return <FaIcons.FaCode />;
};
