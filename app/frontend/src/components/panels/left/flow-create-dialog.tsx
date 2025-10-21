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
import { useToastManager } from '@/hooks/use-toast-manager';
import { flowService } from '@/services/flow-service';
import { Flow } from '@/types/flow';
import { useTranslation } from '@/contexts/language-context';
import { useEffect, useState } from 'react';

interface FlowCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFlowCreated: (flow: Flow) => void;
}

export function FlowCreateDialog({ isOpen, onClose, onFlowCreated }: FlowCreateDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToastManager();
  const { t } = useTranslation();

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!name.trim()) {
      error(t('flowCreate.nameRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const newFlow = await flowService.createFlow({
        name: name.trim(),
        description: description.trim() || undefined,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      });
      
      success(t('flowCreate.success', { name: newFlow.name }));
      onFlowCreated(newFlow);
      onClose();
    } catch (err) {
      console.error('Failed to create flow:', err);
      error(t('flowCreate.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (name.trim()) {
        handleCreate();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('flowCreate.title')}</DialogTitle>
          <DialogDescription>
            {t('flowCreate.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="create-name" className="text-sm font-medium">
              {t('flowCreate.nameLabel')}
            </label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('flowCreate.namePlaceholder')}
              className="col-span-3"
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="create-description" className="text-sm font-medium">
              {t('flowCreate.descriptionLabel')}
            </label>
            <Input
              id="create-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('flowCreate.descriptionPlaceholder')}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t('general.cancel')}
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? t('flowCreate.creating') : t('flowCreate.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
