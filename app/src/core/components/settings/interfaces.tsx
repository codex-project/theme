export interface Settings {
    tabs: SettingsTab[]
    onChange?: (field: SettingsField) => any
}

export interface SettingsTab {
    id: string
    label: string
    fields: SettingsField[]
    onChange?: (field: SettingsField) => any
}

export interface SettingsField<T extends any = any> {
    id: string
    label: string
    type: string
    value: T
    onChange?: (field: T) => any
}
