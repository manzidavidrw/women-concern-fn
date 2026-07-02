"use client";

import ActionButton from "./ActionButton";
import ActionDropdown, { DropdownItem } from "./ActionDropdown";

interface RowActionsProps {
  id: string;
  actions: DropdownItem[];
}

export default function RowActions({ id, actions }: RowActionsProps) {
  const visibleActions = actions.filter((action) => action.visible !== false);

  if (visibleActions.length === 0) {
    return null;
  }

  if (visibleActions.length === 1) {
    const [action] = visibleActions;
    return (
      <ActionButton
        icon={action.icon}
        label={action.title ?? action.label}
        onClick={action.onClick}
        disabled={action.disabled}
      />
    );
  }

  return <ActionDropdown id={id} items={visibleActions} />;
}
