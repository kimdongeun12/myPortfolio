'use client';

import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from 'antd';
import { createContext, useContext, useMemo, type CSSProperties, type HTMLAttributes } from 'react';

type SortableState = ReturnType<typeof useSortable>;

type RowContextValue = {
  setActivatorNodeRef?: SortableState['setActivatorNodeRef'];
  listeners?: SortableState['listeners'];
};

const RowContext = createContext<RowContextValue>({});

export const ReorderEnabledContext = createContext(true);

export function DragHandle() {
  const enabled = useContext(ReorderEnabledContext);
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type='text'
      size='small'
      icon={<HolderOutlined />}
      ref={setActivatorNodeRef}
      {...(enabled ? listeners : {})}
      disabled={!enabled}
      aria-label='드래그해서 순서 변경'
      style={{ cursor: enabled ? 'grab' : 'not-allowed', touchAction: 'none' }}
    />
  );
}

type RowProps = HTMLAttributes<HTMLTableRowElement> & { 'data-row-key'?: string | number };

function SortableTableRow({ rowKey, style, ...props }: RowProps & { rowKey: string | number }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: Number(rowKey),
  });

  const rowStyle: CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 10, background: '#fafafa', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)' } : {}),
  };

  const contextValue = useMemo<RowContextValue>(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={rowStyle} {...attributes} />
    </RowContext.Provider>
  );
}

export default function SortableRow(props: RowProps) {
  const rowKey = props['data-row-key'];
  if (rowKey === undefined) return <tr {...props} />;
  return <SortableTableRow rowKey={rowKey} {...props} />;
}
