import { Reducer } from 'redux';

import { MathHelper } from '@app/core';

import {
    Diagram,
    DiagramGroup,
    EditorState
} from '@app/wireframes/model';

import {
    createItemsAction,
    DiagramRef,
    ItemsRef
} from './utils';

export const GROUP_ITEMS = 'GROUP_ITEMS';
export const groupItems = (diagram: DiagramRef, items: ItemsRef, groupId?: string) => {
    return createItemsAction(GROUP_ITEMS, diagram, items, { groupId: groupId || MathHelper.guid() });
};

export const UNGROUP_ITEMS = 'UNGROUP_ITEMS';
export const ungroupItems = (diagram: Diagram, groups: ItemsRef) => {
    return createItemsAction(UNGROUP_ITEMS, diagram, groups);
};

export function grouping(): Reducer<EditorState> {
    const reducer: Reducer<EditorState> = (state: EditorState, action: any) => {
        switch (action.type) {
            case GROUP_ITEMS:
                return state.updateDiagram(action.payload.diagramId, diagram => {
                    const groupId = action.payload.groupId;

                    return diagram.group(action.payload.itemIds, groupId).selectItems([groupId]);
                });
            case UNGROUP_ITEMS:
                return state.updateDiagram(action.payload.diagramId, diagram => {
                    const childIds: string[] = [];

                    for (let groupId of action.payload.itemIds) {
                        const target = <DiagramGroup>diagram.items.get(groupId);

                        if (target) {
                            childIds.push(...target.childIds.toArray());

                            diagram = diagram.ungroup(groupId);
                        }
                    }

                    diagram = diagram.selectItems(childIds);

                    return diagram;
                });
            default:
                return state;
        }
    };

    return reducer;
}