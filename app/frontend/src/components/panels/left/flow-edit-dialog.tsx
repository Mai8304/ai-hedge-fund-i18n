import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTabsContext } from '@/contexts/tabs-context';
import { useTranslation } from '@/contexts/language-context';
import { useToastManager } from '@/hooks/use-toast-manager';
import { flowService } from '@/services/flow-service';
import { Flow } from '@/types/flow';
import { useEffect, useState } from 'react';

interface FlowEditDialogProps {
  flow: Flow | null;
  isOpen: boolean;
  onClose: () => void;
  onFlowUpdated: () => void;
}

export function FlowEditDialog({ flow, isOpen, onClose, onFlowUpdated }: FlowEditDialogProps) {
  const [name, setName] = useState(flow?.name || '');
  const [description, setDescription] = useState(flow?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToastManager();
  const { updateFlowTabTitle } = useTabsContext();
  const { t } = useTranslation();

  // Update form when flow changes
  useEffect(() => {
    if (flow) {
      setName(flow.name);
      setDescription(flow.description || '');
    }
  }, [flow]);

  const handleSave = async () => {
    if (!flow || !name.trim()) {
      error(t('flows.edit.nameRequired'));
      return;
    }

    setIsLoading(true);
    try {
      await flowService.updateFlow(flow.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      
      // Update the tab title if it's currently open
      updateFlowTabTitle(flow.id, name.trim());
      
      success(t('flows.edit.success', { name: name.trim() }));
      onFlowUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update flow:', err);
      error(t('flows.edit.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (flow) {
      setName(flow.name);
      setDescription(flow.description || '');
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (name.trim()) {
        handleSave();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('flows.edit.title')}</DialogTitle>
          <DialogDescription>
            {t('flows.edit.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              {t('flows.edit.nameLabel')}
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('flows.edit.namePlaceholder')}
              className="col-span-3"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              {t('flows.edit.descriptionLabel')}
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('flows.edit.descriptionPlaceholder')}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t('flows.edit.cancel')}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? t('flows.edit.saving') : t('flows.edit.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
