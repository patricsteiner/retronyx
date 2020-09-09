// all functions exported here will be deployed. Note that the adminSdk from init.ts must be used in all functions!

import { addItemFunction } from './callables/addItem.function';
import { deleteItemFunction } from './callables/deleteItem.function';
import { likeItemFunction } from './callables/likeItem.function';
import { unlikeItemFunction } from './callables/unlikeItem.function';
import { flagItemFunction } from './callables/flagItem.function';
import { unflagItemFunction } from './callables/unflagItem.function';
import { updateCardTitleFunction } from './callables/updateCardTitle.function';

export const addItem = addItemFunction;
export const deleteItem = deleteItemFunction;
export const likeItem = likeItemFunction;
export const unlikeItem = unlikeItemFunction;
export const flagItem = flagItemFunction;
export const unflagItem = unflagItemFunction;
export const updateCardTitle = updateCardTitleFunction;
