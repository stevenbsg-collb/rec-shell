
import { 
  IconMath, 
  IconWorld, 
  IconLanguage, 
  IconFlask, 
  IconBook, 
  IconQuestionMark
} from '@tabler/icons-react';

export const iconMap: Record<string, React.ComponentType<any>> = {
  IconMath,
  IconWorld,
  IconLanguage,
  IconFlask,
  IconBook
};

export const getIcon = (iconName: string) => {
  return iconMap[iconName] || IconQuestionMark;
};