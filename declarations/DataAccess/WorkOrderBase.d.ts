import { TransactionBase } from './Transaction';
import { Sublist, SublistLine } from './Sublist';
import { InventoryDetailBase } from './InventoryDetailBase';
import * as record from 'N/record';
/**
 * Work Order Item Sublist
 */
export declare class ItemSublist extends SublistLine {
    item: number;
    price: number;
    quantity: number;
    bomquantity: number;
    rate: number;
    units: number;
    amount: number;
    description: string;
    inventorydetail: InventoryDetailBase;
}
/**
 * NetSuite Work Order record type
 */
export declare class WorkOrderBase extends TransactionBase {
    assemblyitem: number;
    assemblyitemText: string;
    billofmaterialsrevision: number;
    billofmaterialsrevisionText: string;
    quantity: number;
    units: number;
    item: Sublist<ItemSublist>;
    static recordType(): record.Type;
}
