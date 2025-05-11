import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      {description && <p className="mb-6 text-muted-foreground">{description}</p>}
      {(actionLabel && actionLink) || onAction ? (
        <Button 
          variant="outline" 
          onClick={onAction}
          {...(actionLink ? { asChild: true } : {})}
        >
          {actionLink ? (
            <a href={actionLink}>{actionLabel}</a>
          ) : (
            actionLabel
          )}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState; 