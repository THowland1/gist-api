import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
type GistResponse = Pick<
  RestEndpointMethodTypes['gists']['get']['response']['data'],
  'files'
>;

const defaultGist: GistResponse = {
  files: {
    'private.json': {
      filename: 'private.json',
      type: 'application/json',
      language: 'JSON',
      raw_url:
        'https://gist.githubusercontent.com/THowland1/92477e89d4674f853fcca489522ce53b/raw/ed651b8b78ed04ac9efc6e8c513d07600310d9df/private.json',
      size: 1221,
      truncated: false,
      content:
        '[\n  {\n    "year": "2021",\n    "category": "chemistry",\n    "laureates": [\n      {\n        "id": "1002",\n        "firstname": "Benjamin",\n        "surname": "List",\n        "motivation": "\\"for the development of asymmetric organocatalysis\\"",\n        "share": "2"\n      },\n      {\n        "id": "1003",\n        "firstname": "David",\n        "surname": "MacMillan",\n        "motivation": "\\"for the development of asymmetric organocatalysis\\"",\n        "share": "2"\n      }\n    ]\n  },\n  {\n    "year": "2021",\n    "category": "economics",\n    "laureates": [\n      {\n        "id": "1007",\n        "firstname": "David",\n        "surname": "Card",\n        "motivation": "\\"for his empirical contributions to labour economics\\"",\n        "share": "2"\n      },\n      {\n        "id": "1008",\n        "firstname": "Joshua",\n        "surname": "Angrist",\n        "motivation": "\\"for their methodological contributions to the analysis of causal relationships\\"",\n        "share": "4"\n      },\n      {\n        "id": "1009",\n        "firstname": "Guido",\n        "surname": "Imbens",\n        "motivation": "\\"for their methodological contributions to the analysis of causal relationships\\"",\n        "share": "4"\n      }\n    ]\n  }\n]\n',
    },
  },
};

export const gistWithValidFile = defaultGist;
export const gistWithNoFiles: GistResponse = { ...defaultGist, files: {} };
export const gistWithNonJsonFile: GistResponse = {
  ...defaultGist,
  files: {
    'dual-listbox.ts': {
      filename: 'dual-listbox.ts',
      type: 'video/MP2T',
      language: 'TypeScript',
      raw_url:
        'https://gist.githubusercontent.com/THowland1/7069bd3578ed8216f9a0d57d5c1abcf4/raw/82d9227ac8439cf45e5fe3adfe88223db94cb78a/dual-listbox.ts',
      size: 7787,
      truncated: false,
      content:
        "import { isNullOrUndefined } from 'util'\ntype FilterFn<T> = (item: T) => boolean\n\n/**\n * DualListbox\n * \n * A class to allow for big multiselection of items from a list\n * - Each item can be \"selected\"\n * - Each item can be \"highlighted\"\n * \n * Although it could be possible to wrap this in a whole Angular component,\n * a decision was made to opt for this way to allow for more UI flexibility\n * \n * If the ids are strings, they will be converted to lowercase\n * \n * This only works on items with an id column (the property name of which is required in the constructor)\n */\nexport class DualListbox<TId, TItem>{\n    constructor(private idPropertyName: string) { }\n\n    /* User Variables */\n    get allItems(): TItem[] { return this.allItemsInternal }\n    set allItems(value: TItem[]) { this.allItemsInternal = value; this.refresh() }\n    private allItemsInternal: TItem[] = []\n\n    get selectedIds(): TId[] { return this.selectedIdsInternal }\n    set selectedIds(value: TId[]) { this.selectedIdsInternal = value.map(id => this.toLowercaseIfString(id)); this.refresh() }\n    private selectedIdsInternal: TId[] = []\n\n    get highlightedIds(): TId[] { return this.highlightedIdsInternal }\n    set highlightedIds(value: TId[]) { this.highlightedIdsInternal = value; this.refresh() }\n    private highlightedIdsInternal: TId[] = []\n\n    /* Private set variables */\n    private filteredItemsInternal: TItem[] = []\n    private selectedFilteredItemsInternal: TItem[] = []\n    private unselectedFilteredItemsInternal: TItem[] = []\n    private highlightedItemsInternal: TItem[] = []\n    private canSelectHighlightedInternal = false\n    private canDeselectHighlightedInternal = false\n    private canSelectAllUnselectedFilteredInternal = false\n    private canDeselectAllSelectedFilteredInternal = false\n    \n    get filteredItems() { return this.filteredItemsInternal }\n    get selectedFilteredItems() { return this.selectedFilteredItemsInternal }\n    get unselectedFilteredItems() { return this.unselectedFilteredItemsInternal }\n    get highlightedItems() { return this.highlightedItemsInternal }\n    get canSelectHighlighted() { return this.canSelectHighlightedInternal }\n    get canDeselectHighlighted() { return this.canDeselectHighlightedInternal }\n    get canSelectAllUnselectedFiltered() { return this.canSelectAllUnselectedFilteredInternal }\n    get canDeselectAllSelectedFiltered() { return this.canDeselectAllSelectedFilteredInternal }\n\n    /* Public Methods */\n    private filterFnInternal: FilterFn<TItem> = () => true\n    get filterFn(): FilterFn<TItem> { return this.filterFnInternal }\n    set filterFn(value: FilterFn<TItem>) { this.clearHighlightedIds(); this.filterFnInternal = value; this.refresh() }\n\n    toggleHighlightedItem(item: TItem) {\n        this.toggleHighlightedId(item[this.idPropertyName])\n    }\n\n    selectHighlighted() {\n        if (this.canSelectHighlighted) {\n            this.selectIds(this.highlightedIds)\n            this.clearHighlightedIds()\n        }\n    }\n\n    deselectHighlighted() {\n        if (this.canDeselectHighlighted) {\n            this.deselectIds(this.highlightedIds)\n            this.clearHighlightedIds()\n        }\n    }\n\n    selectAllUnselectedFiltered() {\n        if (this.canSelectAllUnselectedFiltered) {\n            this.selectIds(this.unselectedFilteredItems.map(item => this.getId(item)))\n            this.clearHighlightedIds()\n        }\n    }\n\n    deselectAllSelectedFiltered() {\n        if (this.canDeselectAllSelectedFiltered) {\n            this.deselectIds(this.selectedFilteredItems.map(item => this.getId(item)))\n            this.clearHighlightedIds()\n        }\n    }\n\n    clearHighlightedIds() {\n        this.highlightedIds = []\n    }\n\n    /* Public Getter Methods */\n    itemIsHighlighted(item: TItem) {\n        return this.itemIdIsInList(item, this.highlightedIds)\n    }\n\n    /* Private Methods */\n    private refresh() {\n        this.filteredItemsInternal = this.getFilteredItems()\n        this.selectedFilteredItemsInternal = this.getSelectedFilteredItems()\n        this.unselectedFilteredItemsInternal = this.getUnselectedFilteredItems()\n        this.highlightedItemsInternal = this.getHighlightedItems()\n\n        this.canSelectHighlightedInternal = this.highlightedItems.length > 0 && this.allHighlightedItemsAreUnselected()\n        this.canDeselectHighlightedInternal = this.highlightedItems.length > 0 && this.allHighlightedItemsAreSelected()\n        this.canSelectAllUnselectedFilteredInternal = this.unselectedFilteredItems.length > 0\n        this.canDeselectAllSelectedFilteredInternal = this.selectedFilteredItems.length > 0\n\n        // console.log('filtered', this.filteredItemsInternal)\n        // console.log('sel', this.selectedFilteredItemsInternal)\n        // console.log('unsel', this.unselectedFilteredItemsInternal)\n        // console.log('high', this.highlightedItemsInternal)\n    }\n\n    private allHighlightedItemsAreSelected() {\n        return this.highlightedItems.every(item => this.itemIdIsInList(item, this.selectedIds))\n    }\n\n    private allHighlightedItemsAreUnselected() {\n        return this.highlightedItems.every(item => !this.itemIdIsInList(item, this.selectedIds))\n    }\n\n    private getFilteredItems(): TItem[] {\n        return this.allItems.filter(this.filterFn)\n    }\n\n    private getSelectedFilteredItems(): TItem[] {\n        return this.filteredItems.filter(item => this.itemIdIsInList(item, this.selectedIds))\n    }\n\n    private getUnselectedFilteredItems(): TItem[] {\n        return this.filteredItems.filter(item => !this.itemIdIsInList(item, this.selectedIds))\n    }\n\n    private getHighlightedItems(): TItem[] {\n        return this.filteredItems.filter(item => this.itemIsHighlighted(item))\n    }\n\n    private toggleHighlightedId(id: TId) {\n        id = this.toLowercaseIfString(id)\n        if (!this.canToggleHighlight(id)) {\n            return\n        }\n        \n        const highlightedIds = this.highlightedIds.map(listId => this.toLowercaseIfString(listId))\n        if (highlightedIds.includes(id)) {\n            highlightedIds.remove(id)\n        } else {\n            highlightedIds.push(id)\n        }\n        this.highlightedIds = highlightedIds\n        console.log(highlightedIds)\n    }\n\n    private getId(item: TItem): TId {\n        return item[this.idPropertyName]\n    }\n\n    private selectIds(ids: TId[]) {\n        this.deselectIds(ids)\n        const selectedIds = this.selectedIds\n        ids.forEach(id => selectedIds.push(id))\n        this.selectedIds = selectedIds\n    }\n\n    private deselectIds(ids: TId[]) {\n        ids = ids.map(id => this.toLowercaseIfString(id))\n\n        const selectedIds = this.selectedIds\n        ids.forEach(id => selectedIds.remove(id))\n        this.selectedIds = selectedIds\n    }\n\n    private canToggleHighlight(id: TId) {\n        const highlightedIds = this.highlightedIds\n        const highlightedIdsAreSelected = highlightedIds.every(highlightedId => this.idIsInList(highlightedId, this.selectedIds))\n        const idIsSelected = this.selectedIds.includes(id)\n        if (highlightedIds.length === 0) {\n            return true\n        }\n\n        return highlightedIdsAreSelected === idIsSelected\n    }\n\n    private itemIdIsInList(item: TItem, ids: TId[]): boolean {\n        const itemId: TId = item[this.idPropertyName]\n        return this.idIsInList(itemId, ids)\n    }\n\n    private idIsInList(id: TId, ids: TId[]): boolean {\n        if (isNullOrUndefined(id))\n            return false\n\n        id = this.toLowercaseIfString(id)\n        ids.map(listId => this.toLowercaseIfString(listId))\n        \n        return ids.includes(id)\n    }\n\n    private toLowercaseIfString(id: TId): TId {\n        if (typeof(id) === 'string') {\n            return (id as unknown as string).toLowerCase() as unknown as any\n        }\n        return id\n    }\n}\n",
    },
  },
};
export const gistWithNonArrayFile: GistResponse = {
  ...defaultGist,
  files: {
    'notarray.json': {
      filename: 'private.json',
      type: 'application/json',
      language: 'JSON',
      raw_url:
        'https://gist.githubusercontent.com/THowland1/92477e89d4674f853fcca489522ce53b/raw/ed651b8b78ed04ac9efc6e8c513d07600310d9df/private.json',
      size: 1221,
      truncated: false,
      content: JSON.stringify({ obj: 'value' }),
    },
  },
};
