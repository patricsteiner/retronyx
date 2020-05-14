// all functions exported here will be deployed. Note that the adminSdk from init.ts must be used in all functions!

import { addItemFunction } from './callables/addItem.function';
import { deleteItemFunction } from './callables/deleteItemFunction';
import { likeItemFunction } from './callables/likeItemFunction';
import { unlikeItemFunction } from './callables/unlikeItemFunction';
import { flagItemFunction } from './callables/flagItemFunction';
import { unflagItemFunction } from './callables/unflagItemFunction';

export const addItem = addItemFunction;
export const deleteItem = deleteItemFunction;
export const likeItem = likeItemFunction;
export const unlikeItem = unlikeItemFunction;
export const flagItem = flagItemFunction;
export const unflagItem = unflagItemFunction;
