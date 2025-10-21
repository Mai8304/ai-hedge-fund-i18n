import {
  BadgeDollarSign,
  Bot,
  Brain,
  Calculator,
  ChartLine,
  ChartPie,
  LucideIcon,
  Network,
  Play,
  Zap
} from 'lucide-react';
import { Agent, getAgents } from './agents';
import { translate } from './translations';
import type { SupportedLanguage } from '@/locales';

// Define component items by group
export interface ComponentItem {
  name: string; // internal identifier
  label: string; // localized label for display
  icon: LucideIcon;
}

export interface ComponentGroup {
  name: string; // internal identifier
  label: string; // localized label for display
  icon: LucideIcon;
  iconColor: string;
  items: ComponentItem[];
}

/**
 * Get all component groups, including agents fetched from the backend
 */
export const getComponentGroups = async (language: SupportedLanguage): Promise<ComponentGroup[]> => {
  const agents = await getAgents();

  return [
    {
      name: 'Start Nodes',
      label: translate('sidebar.start.title', language, 'Start Nodes'),
      icon: Play,
      iconColor: 'text-blue-500',
      items: [
        {
          name: 'Portfolio Input',
          label: translate('sidebar.start.portfolioInput', language, 'Portfolio Input'),
          icon: ChartPie,
        },
        {
          name: 'Stock Input',
          label: translate('sidebar.start.stockInput', language, 'Stock Input'),
          icon: ChartLine,
        },
      ],
    },
    {
      name: 'Analysts',
      label: translate('sidebar.analysts.title', language, 'Analysts'),
      icon: Bot,
      iconColor: 'text-red-500',
      items: agents.map((agent: Agent) => ({
        name: agent.display_name,
        label: agent.display_name,
        icon: Bot,
      })),
    },
    {
      name: 'Swarms',
      label: translate('sidebar.swarms.title', language, 'Swarms'),
      icon: Network,
      iconColor: 'text-yellow-500',
      items: [
        {
          name: 'Data Wizards',
          label: translate('sidebar.swarms.dataWizards', language, 'Data Wizards'),
          icon: Calculator,
        },
        {
          name: 'Market Mavericks',
          label: translate('sidebar.swarms.marketMavericks', language, 'Market Mavericks'),
          icon: Zap,
        },
        {
          name: 'Value Investors',
          label: translate('sidebar.swarms.valueInvestors', language, 'Value Investors'),
          icon: BadgeDollarSign,
        },
      ],
    },
    {
      name: 'End Nodes',
      label: translate('sidebar.end.title', language, 'End Nodes'),
      icon: Brain,
      iconColor: 'text-green-500',
      items: [
        {
          name: 'Portfolio Manager',
          label: translate('sidebar.end.portfolioManager', language, 'Portfolio Manager'),
          icon: Brain,
        },
      ],
    },
  ];
};
