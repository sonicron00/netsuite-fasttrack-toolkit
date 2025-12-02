/**
 * Defines the nsdal handling for record body fields.
 *
 */
import * as record from 'N/record';
import { SublistLine } from './Sublist';
declare type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export declare type Nullable<T> = T | null;
/**
 * Since the netsuite defined 'CurrentRecord' type has almost all the same operations as the normal 'Record'
 * we use this as our base class
 */
export declare abstract class NetsuiteCurrentRecord {
    protected defaultValues?: object | undefined;
    /**
     * Netsuite internal id of this record
     * @type {number}
     */
    protected _id: number;
    get id(): number;
    /**
     * The netsuite record type (constant string) - this is declared here and overridden in derived classes
     */
    static recordType(): string | record.Type;
    /**
     * The underlying netsuite 'record' object. For client scripts, this is the slightly less feature rich
     * 'ClientCurrentRecord' when accessing the 'current' record the script is associated to.
     */
    nsrecord: record.Record | record.ClientCurrentRecord;
    /**
     * Defines a descriptor for nsrecord so as to prevent it from being enumerable. Conceptually only the
     * field properties defined on derived classes should be seen when enumerating
     * @param value
     */
    private makeRecordProp;
    constructor(rec?: null | number | string | record.Record | record.ClientCurrentRecord, isDynamic?: boolean, defaultValues?: object | undefined);
    toJSON(): any;
    /**
     * Returns NetSuite field metadata. Useful for doing things like disabling a field on the form programmatically.
     * @param field field name for which you want to retrieve the NetSuite field object
     */
    getField(field: NonFunctionPropertyNames<this>): record.Field;
}
/**
 * A regular netsuite record.
 */
export declare abstract class NetsuiteRecord extends NetsuiteCurrentRecord {
    /**
     * underlying netsuite record
     */
    nsrecord: record.Record;
    /**
     * Persists this record to the NS database
     * @param enableSourcing
     * @param ignoreMandatoryFields
     * @returns {number}
     */
    save(enableSourcing?: boolean, ignoreMandatoryFields?: boolean): number;
}
/**
 * Generic decorator factory with basic default algorithm that exposes the field value directly with no
 * other processing. If the property name ends with "Text" then the property will use getText()/setText()
 *
 * @returns a decorator that returns a property descriptor to be used
 * with Object.defineProperty
 */
export declare function defaultDescriptor<T extends NetsuiteCurrentRecord>(target: T, propertyKey: string): any;
/**
 * Just like the default descriptor but calls Number() on the value. This exists for numeric types that
 * would blow up if you tried to assign number primitive values to a field. Don't know why - did various checks
 * with lodash and typeof to confirm the raw value was a number but only passing through Number() worked on sets.
 * Reads still seem to return a number.
 * @returns an object property descriptor to be used
 * with Object.defineProperty
 */
export declare function numericDescriptor<T extends NetsuiteCurrentRecord>(target: T, propertyKey: string): any;
declare type LineConstructor<T extends SublistLine> = new (s: string, r: record.Record, n: number) => T;
/**
 * Decorator for adding sublists with each line of the sublist represented by a type T which
 * defines the properties you want on the sublist
 * @param ctor Constructor for the type that has the properties you want from each sublist line.
 * e.g. Invoice.ItemSublistLine
 */
declare function sublistDescriptor<T extends SublistLine>(ctor: LineConstructor<T>): (target: any, propertyKey: string) => any;
/**
 * Decorator for *subrecord* fields with the subrecord shape represented by T (which
 * defines the properties you want on the subrecord)
 * @param ctor Constructor for the type that has the properties you want from the subrecord.
 * e.g. AssemblyBuild.InventoryDetail
 */
declare function subrecordDescriptor<T extends NetsuiteCurrentRecord>(ctor: new (rec: record.Record) => T): (target: any, propertyKey: string) => any;
/**
 *  Netsuite field types - decorate your model properties with these to tie netsuite field types to your
 *  model's field type.
 *  To get 'Text' rather than field value, suffix your property name with 'Text' e.g. 'afieldText' for the
 *  field 'afield'.
 */
export declare namespace FieldType {
    /**
     * use for ns  _address_ field type
     */
    const address: typeof defaultDescriptor;
    /**
     * use for NS _checkbox_ field type - surfaces as `boolean` in TypeScript
     */
    const checkbox: typeof defaultDescriptor;
    const date: typeof defaultDescriptor;
    const currency: typeof numericDescriptor;
    const datetime: typeof defaultDescriptor;
    const document: typeof defaultDescriptor;
    const email: typeof defaultDescriptor;
    const freeformtext: typeof defaultDescriptor;
    const float: typeof numericDescriptor;
    const decimalnumber: typeof numericDescriptor;
    const hyperlink: typeof defaultDescriptor;
    const inlinehtml: typeof defaultDescriptor;
    const image: typeof defaultDescriptor;
    const integernumber: typeof numericDescriptor;
    const longtext: typeof defaultDescriptor;
    const multiselect: typeof defaultDescriptor;
    const percent: (target: any, propertyKey: any) => any;
    /**
     * NetSuite 'Select' field type.
     */
    var select: typeof defaultDescriptor;
    var textarea: typeof defaultDescriptor;
    /**
     * this isn't a native NS 'field' type, but rather is used to indicate a property should represent a NS sub-list.
     * Pass a type derived from SublistLine that describes the sublist fields you want. e.g. Invoice.ItemSublistLine
     * @example
     * class MySublistLine extends Invoice.ItemSublistLine { custcol_foo:string }
     * class Invoice {
     * @FieldType.sublist(MySublistLine)
     * item: SublistLine<MySublistLine>
     * }
     */
    var sublist: typeof sublistDescriptor;
    /**
     * NetSuite _SubRecord_ field type (reference to a subrecord object, usually described as 'summary' in the
     * records browser.
     * Pass in the (TypeScript) type that matches the subrecord this property points to
     * @example the `assemblybuild.inventorydetail` property
     * ```typescript
     * import { InventoryDetail } from './DataAceess/InventoryDetail'
     *
     * class AssemblyBuild {
     *    @FieldType.subrecord(InventoryDetail)
     *    inventorydetail: InventoryDetail
     * }
     * ```
     */
    var subrecord: typeof subrecordDescriptor;
}
export {};
