
export default function GetOrSet<
    MapType extends Map<unknown, unknown>,
    Key extends PropertyKey,
    Container extends Partial<Record<Key, MapType>> = Partial<Record<Key, MapType>>
>(
    container : Container,
    key : Key,
    factory : () => MapType
) : MapType {

    if(!container[key]) {

        const map = factory();

        container[key as PropertyKey] = map;

        return map;
    }

    return container[key] as MapType;
}