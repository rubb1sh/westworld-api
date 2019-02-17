import { Entity } from 'interfaces/Entity'

export function getNextId<T extends Entity>(collection: T[]): number {
    return getMaxId(collection) + 1
}

function getMaxId<T extends Entity>(collection: T[]): number {
    return collection.reduce((maxId: number, item: T) => {
        if (item.id > maxId) {
            return item.id
        }

        return maxId
    }, 0)
}
