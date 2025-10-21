import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/language-context';
import { cn } from '@/lib/utils';
import { Copy, Edit, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface FlowContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function FlowContextMenu({ 
  isOpen, 
  position, 
  onClose, 
  onEdit, 
  onDuplicate, 
  onDelete 
}: FlowContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 min-w-[160px] rounded-md border border-border bg-popover text-popover-foreground shadow-lg",
        "animate-in fade-in-0 zoom-in-95"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="p-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => handleAction(onEdit)}
        >
          <Edit size={14} className="mr-2" />
          {t('flows.contextMenu.edit')}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => handleAction(onDuplicate)}
        >
          <Copy size={14} className="mr-2" />
          {t('flows.contextMenu.duplicate')}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:bg-destructive/10"
          onClick={() => handleAction(onDelete)}
        >
          <Trash2 size={14} className="mr-2" />
          {t('flows.contextMenu.delete')}
        </Button>
      </div>
    </div>
  );
} 
