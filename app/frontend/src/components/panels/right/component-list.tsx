import { Accordion } from '@/components/ui/accordion';
import { ComponentGroup } from '@/data/sidebar-components';
import { SearchBox } from '../search-box';
import { ComponentItemGroup } from './component-item-group';
import { useTranslation } from '@/contexts/language-context';

interface ComponentListProps {
  componentGroups: ComponentGroup[];
  searchQuery: string;
  isLoading: boolean;
  openGroups: string[];
  filteredGroups: ComponentGroup[];
  activeItem: string | null;
  onSearchChange: (query: string) => void;
  onAccordionChange: (value: string[]) => void;
}

export function ComponentList({
  componentGroups,
  searchQuery,
  isLoading,
  openGroups,
  filteredGroups,
  activeItem,
  onSearchChange,
  onAccordionChange,
}: ComponentListProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-grow overflow-auto text-primary scrollbar-thin scrollbar-thumb-ramp-grey-700">
      <SearchBox 
        value={searchQuery} 
        onChange={onSearchChange}
        placeholder={t('sidebar.search.placeholder')}
        clearLabel={t('general.clearSearch')}
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground text-sm">{t('sidebar.loading')}</div>
        </div>
      ) : (
        <Accordion 
          type="multiple" 
          className="w-full" 
          value={openGroups} 
          onValueChange={onAccordionChange}
        >
          {filteredGroups.map(group => (
            <ComponentItemGroup
              key={group.name} 
              group={group}
              activeItem={activeItem}
            />
          ))}
        </Accordion>
      )}

      {!isLoading && filteredGroups.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {componentGroups.length === 0 ? (
            <div className="space-y-2">
              <div>{t('sidebar.empty.title')}</div>
              <div className="text-xs">{t('sidebar.empty.subtitle')}</div>
            </div>
          ) : (
            t('sidebar.search.noResults')
          )}
        </div>
      )}
    </div>
  );
}
